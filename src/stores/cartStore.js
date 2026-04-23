import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CHECKOUT_CONFIG } from '../constants/checkoutConfig';
import { isSameCartLine } from '../utils/cartLineUtils';
import { resolveCartLineImageFromProduct } from '../utils/cartMapper';
import { splitDeferredIntoInstallments } from '../utils/deferredInstallments';

const resolvePaymentPerUnit = (product) => {
  const unitTotalPrice = product.finalPrice ?? product.price ?? 0;
  const hasApiValues = product.initialPaymentCost != null && product.remainingBalance != null;
  const unitInitialPayment = hasApiValues
    ? product.initialPaymentCost
    : unitTotalPrice * CHECKOUT_CONFIG.INITIAL_PAYMENT_PERCENT;
  const unitDeferredAmount = hasApiValues
    ? product.remainingBalance
    : unitTotalPrice - unitInitialPayment;
  return { unitTotalPrice, unitInitialPayment, unitDeferredAmount };
};

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      deferralMonths: CHECKOUT_CONFIG.DEFAULT_DEFERRAL_MONTHS,

      setDeferralMonths: (months) => {
        set({ deferralMonths: months });
      },

      addItem: (product, quantity = 1, size = null, options = {}) => {
        const { productVariantId, attributes = [] } = options;
        const items = get().items;
        const normalizedSize = size || 'Estándar';
        const resolvedVariantId = productVariantId ?? product.productVariantId ?? null;
        const existingItemIndex = items.findIndex((item) =>
          isSameCartLine(item, {
            productId: product.id,
            size: normalizedSize,
            productVariantId: resolvedVariantId,
          })
        );

        const { unitTotalPrice, unitInitialPayment, unitDeferredAmount } = resolvePaymentPerUnit(product);

        const lineImage = resolveCartLineImageFromProduct(product) ?? product.image;

        if (existingItemIndex >= 0) {
          const existingItem = items[existingItemIndex];
          const maxStock = product.stock ?? existingItem.stock ?? 999;
          const newQuantity = Math.min(existingItem.quantity + quantity, maxStock);
          const updatedItems = items.map((item, index) =>
            index === existingItemIndex
              ? {
                  ...item,
                  stock: maxStock,
                  quantity: newQuantity,
                  price: unitTotalPrice,
                  unitInitialPayment,
                  unitDeferredAmount,
                  total: unitTotalPrice * newQuantity,
                  productVariantId: productVariantId ?? item.productVariantId,
                  attributes: attributes.length > 0 ? attributes : item.attributes,
                  categoryId: product.categoryId ?? item.categoryId,
                  subcategoryId: product.subcategoryId ?? item.subcategoryId,
                  image: lineImage ?? item.image,
                }
              : item
          );
          set({ items: updatedItems });
        } else {
          const newItem = {
            id: product.id,
            name: product.name,
            image: lineImage,
            price: unitTotalPrice,
            originalPrice: product.originalPrice,
            discount: product.discount,
            category: product.category,
            categoryId: product.categoryId ?? null,
            subcategoryId: product.subcategoryId ?? null,
            size: normalizedSize,
            stock: product.stock ?? 999,
            quantity,
            total: unitTotalPrice * quantity,
            unitInitialPayment,
            unitDeferredAmount,
            productVariantId: productVariantId ?? product.productVariantId ?? null,
            attributes: attributes.length > 0 ? attributes : [],
          };
          set({ items: [...items, newItem] });
        }
      },

      // Remover producto del carrito
      removeItem: (itemId, size = null, productVariantId) => {
        const items = get().items;
        const filteredItems = items.filter(
          (item) =>
            !isSameCartLine(item, {
              productId: itemId,
              size,
              productVariantId,
            })
        );
        set({ items: filteredItems });
      },

      updateQuantity: (itemId, quantity, size = null, productVariantId) => {
        if (quantity < 1) {
          get().removeItem(itemId, size, productVariantId);
          return;
        }

        const items = get().items;
        const maxStock = 999;
        const updatedItems = items.map(item => {
          if (
            isSameCartLine(item, {
              productId: itemId,
              size,
              productVariantId,
            })
          ) {
            const cappedQuantity = Math.min(quantity, item.stock ?? maxStock);
            const unitTotal = item.price ?? 0;
            const unitInit = item.unitInitialPayment ?? unitTotal * CHECKOUT_CONFIG.INITIAL_PAYMENT_PERCENT;
            const unitDeferred = item.unitDeferredAmount ?? unitTotal - unitInit;
            return {
              ...item,
              quantity: cappedQuantity,
              total: unitTotal * cappedQuantity,
              unitInitialPayment: unitInit,
              unitDeferredAmount: unitDeferred,
            };
          }
          return item;
        });
        set({ items: updatedItems });
      },

      updateItemCategoryIds: (itemId, size, categoryId, subcategoryId, productVariantId) => {
        const items = get().items;
        const normalizedSize = size || 'Estándar';
        const updatedItems = items.map((item) =>
          isSameCartLine(item, {
            productId: itemId,
            size: normalizedSize,
            productVariantId,
          })
            ? { ...item, categoryId: categoryId ?? item.categoryId, subcategoryId: subcategoryId ?? item.subcategoryId }
            : item
        );
        set({ items: updatedItems });
      },

      // Limpiar el carrito
      clearCart: () => {
        set({ items: [], deferralMonths: CHECKOUT_CONFIG.DEFAULT_DEFERRAL_MONTHS });
      },

      setItemsFromApi: (items) => {
        const validItems = Array.isArray(items) ? items : [];
        set({ items: validItems });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.total, 0);
      },

      getInitialPayment: () => {
        return get().items.reduce((sum, item) => {
          const unitInit = item.unitInitialPayment ?? (item.price ?? 0) * CHECKOUT_CONFIG.INITIAL_PAYMENT_PERCENT;
          return sum + unitInit * item.quantity;
        }, 0);
      },

      getDeferredAmount: () => {
        return get().items.reduce((sum, item) => {
          const unitDeferred = item.unitDeferredAmount ?? (item.price ?? 0) * (1 - CHECKOUT_CONFIG.INITIAL_PAYMENT_PERCENT);
          return sum + unitDeferred * item.quantity;
        }, 0);
      },

      getDeferredInstallmentPlan: () => {
        const deferredAmount = get().getDeferredAmount();
        const months = get().deferralMonths;
        return splitDeferredIntoInstallments(deferredAmount, months);
      },

      getMonthlyPayment: () => {
        const plan = get().getDeferredInstallmentPlan();
        return plan.baseInstallment;
      },

      getPaymentSchedule: () => {
        const deferredAmount = get().getDeferredAmount();
        const months = get().deferralMonths;
        const plan = splitDeferredIntoInstallments(deferredAmount, months);
        const schedule = [];
        const today = new Date();

        for (let i = 1; i <= plan.totalMonths; i++) {
          const paymentDate = new Date(today);
          paymentDate.setMonth(paymentDate.getMonth() + i);

          const amount =
            i < plan.totalMonths ? plan.baseInstallment : plan.lastInstallment;

          schedule.push({
            number: i,
            date: paymentDate,
            amount,
            status: 'pending',
          });
        }

        return schedule;
      },

      // Obtener cantidad total de items
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        items: state.items,
        deferralMonths: state.deferralMonths,
      }),
    }
  )
);

export default useCartStore;
