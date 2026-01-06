import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      deferralMonths: 6, // Meses globales de diferimiento (3, 6, 9, 12)
      
      // Actualizar meses de diferimiento global
      setDeferralMonths: (months) => {
        set({ deferralMonths: months });
      },

      // Agregar producto al carrito
      addItem: (product, quantity = 1, size = null) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(
          item => item.id === product.id && item.size === size
        );

        if (existingItemIndex >= 0) {
          // Si el producto ya existe, actualizar cantidad
          const updatedItems = items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity, total: item.price * (item.quantity + quantity) }
              : item
          );
          set({ items: updatedItems });
        } else {
          // Si es un nuevo producto, agregarlo
          const newItem = {
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            originalPrice: product.originalPrice,
            discount: product.discount,
            category: product.category,
            size: size || 'Estándar',
            quantity: quantity,
            total: product.price * quantity,
          };
          set({ items: [...items, newItem] });
        }
      },

      // Remover producto del carrito
      removeItem: (itemId, size = null) => {
        const items = get().items;
        const filteredItems = items.filter(
          item => !(item.id === itemId && item.size === (size || 'Estándar'))
        );
        set({ items: filteredItems });
      },

      // Actualizar cantidad de un producto
      updateQuantity: (itemId, quantity, size = null) => {
        if (quantity < 1) {
          get().removeItem(itemId, size);
          return;
        }

        const items = get().items;
        const updatedItems = items.map(item =>
          item.id === itemId && item.size === (size || 'Estándar')
            ? { ...item, quantity, total: item.price * quantity }
            : item
        );
        set({ items: updatedItems });
      },

      // Actualizar tamaño de un producto
      updateSize: (itemId, oldSize, newSize) => {
        const items = get().items;
        const item = items.find(
          item => item.id === itemId && item.size === oldSize
        );

        if (item) {
          // Verificar si ya existe con el nuevo tamaño
          const existingItem = items.find(
            i => i.id === itemId && i.size === newSize
          );

          if (existingItem) {
            // Si existe, combinar cantidades
            const updatedItems = items
              .filter(i => !(i.id === itemId && i.size === oldSize))
              .map(i =>
                i.id === itemId && i.size === newSize
                  ? { ...i, quantity: i.quantity + item.quantity, total: i.price * (i.quantity + item.quantity) }
                  : i
              );
            set({ items: updatedItems });
          } else {
            // Si no existe, actualizar el tamaño
            const updatedItems = items.map(i =>
              i.id === itemId && i.size === oldSize
                ? { ...i, size: newSize }
                : i
            );
            set({ items: updatedItems });
          }
        }
      },

      // Limpiar el carrito
      clearCart: () => {
        set({ items: [], deferralMonths: 6 });
      },

      // Calcular subtotal
      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.total, 0);
      },

      // Calcular pago inicial (30%)
      getInitialPayment: () => {
        const subtotal = get().getSubtotal();
        return subtotal * 0.30;
      },

      // Calcular total a diferir (70%)
      getDeferredAmount: () => {
        const subtotal = get().getSubtotal();
        return subtotal * 0.70;
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
