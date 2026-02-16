import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CHECKOUT_CONFIG } from '../constants/checkoutConfig';

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
        const existingItemIndex = items.findIndex(
          item => item.id === product.id && item.size === normalizedSize
        );

        const { unitTotalPrice, unitInitialPayment, unitDeferredAmount } = resolvePaymentPerUnit(product);

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
                }
              : item
          );
          set({ items: updatedItems });
        } else {
          const newItem = {
            id: product.id,
            name: product.name,
            image: product.image,
            price: unitTotalPrice,
            originalPrice: product.originalPrice,
            discount: product.discount,
            category: product.category,
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
      removeItem: (itemId, size = null) => {
        const items = get().items;
        const normalizedSize = size || 'Estándar';
        const filteredItems = items.filter(
          (item) => !(String(item.id) === String(itemId) && item.size === normalizedSize)
        );
        set({ items: filteredItems });
      },

      updateQuantity: (itemId, quantity, size = null) => {
        if (quantity < 1) {
          get().removeItem(itemId, size);
          return;
        }

        const items = get().items;
        const maxStock = 999;
        const updatedItems = items.map(item => {
          if (item.id === itemId && item.size === (size || 'Estándar')) {
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

      updateSize: (itemId, oldSize, newSize) => {
        const items = get().items;
        const item = items.find(
          item => item.id === itemId && item.size === oldSize
        );

        if (item) {
          const existingItem = items.find(
            i => i.id === itemId && i.size === newSize
          );

          if (existingItem) {
            const mergedQty = existingItem.quantity + item.quantity;
            const unitTotal = existingItem.price ?? 0;
            const unitInit = existingItem.unitInitialPayment ?? unitTotal * CHECKOUT_CONFIG.INITIAL_PAYMENT_PERCENT;
            const unitDeferred = existingItem.unitDeferredAmount ?? unitTotal - unitInit;
            const updatedItems = items
              .filter(i => !(i.id === itemId && i.size === oldSize))
              .map(i =>
                i.id === itemId && i.size === newSize
                  ? {
                      ...i,
                      quantity: mergedQty,
                      total: unitTotal * mergedQty,
                      unitInitialPayment: unitInit,
                      unitDeferredAmount: unitDeferred,
                    }
                  : i
              );
            set({ items: updatedItems });
          } else {
            set({ items: items.map(i =>
              i.id === itemId && i.size === oldSize ? { ...i, size: newSize } : i
            ) });
          }
        }
      },

      // Limpiar el carrito
      clearCart: () => {
        set({ items: [], deferralMonths: CHECKOUT_CONFIG.DEFAULT_DEFERRAL_MONTHS });
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

      // Calcular pago mensual
      getMonthlyPayment: () => {
        const deferredAmount = get().getDeferredAmount();
        const months = get().deferralMonths;
        return months > 0 ? deferredAmount / months : 0;
      },

      // Generar calendario de pagos
      getPaymentSchedule: () => {
        const monthlyPayment = get().getMonthlyPayment();
        const months = get().deferralMonths;
        const schedule = [];
        
        const today = new Date();
        
        for (let i = 1; i <= months; i++) {
          const paymentDate = new Date(today);
          paymentDate.setMonth(paymentDate.getMonth() + i);
          
          schedule.push({
            number: i,
            date: paymentDate,
            amount: monthlyPayment,
            status: 'pending', // pending, paid, overdue
          });
        }
        
        return schedule;
      },

      // Obtener cantidad total de items
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      // Verificar si el carrito está vacío
      isEmpty: () => {
        return get().items.length === 0;
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
