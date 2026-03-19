import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mercadoPagoService } from '../api/services/mercadoPagoService';
import { MERCADO_PAGO_PAYMENT_METHOD_IDS } from '../constants/app';

const usePaymentMethodsStore = create(
  persist(
    (set, get) => ({
      paymentMethods: [],
      isLoaded: false,
      isLoading: false,
      error: null,

      fetchPaymentMethods: async () => {
        const { isLoaded, isLoading } = get();
        if (isLoaded || isLoading) return get().paymentMethods;

        set({ error: null, isLoading: true });
        try {
          const methods = await mercadoPagoService.getPaymentMethods();
          const filtered = (methods || [])
            .filter((pm) => {
              if (!MERCADO_PAGO_PAYMENT_METHOD_IDS.includes(pm.id)) return false;
              if (pm.id === 'visa' || pm.id === 'master') {
                return pm.payment_type_id === 'credit_card';
              }
              return true;
            })
            .sort((a, b) => MERCADO_PAGO_PAYMENT_METHOD_IDS.indexOf(a.id) - MERCADO_PAGO_PAYMENT_METHOD_IDS.indexOf(b.id));
          set({ paymentMethods: filtered, isLoaded: true, isLoading: false });
          return filtered;
        } catch (err) {
          set({ paymentMethods: [], isLoaded: true, isLoading: false, error: err });
          throw err;
        }
      },

      clearPaymentMethods: () => set({ paymentMethods: [], isLoaded: false, error: null }),
    }),
    {
      name: 'payment-methods-storage',
      partialize: (state) => ({
        paymentMethods: state.paymentMethods,
        isLoaded: state.isLoaded,
      }),
    }
  )
);

export default usePaymentMethodsStore;
