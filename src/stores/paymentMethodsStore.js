import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mercadoPagoService } from '../api/services/mercadoPagoService';
import {
  MERCADO_PAGO_CHECKOUT_DEBIT_CARD_IDS,
  MERCADO_PAGO_PAYMENT_METHOD_IDS,
} from '../constants/app';

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
          const debitSet = new Set(MERCADO_PAGO_CHECKOUT_DEBIT_CARD_IDS);
          const filtered = (methods || [])
            .filter((pm) => MERCADO_PAGO_PAYMENT_METHOD_IDS.includes(pm.id) && debitSet.has(pm.id))
            .sort(
              (a, b) =>
                MERCADO_PAGO_CHECKOUT_DEBIT_CARD_IDS.indexOf(a.id) -
                MERCADO_PAGO_CHECKOUT_DEBIT_CARD_IDS.indexOf(b.id)
            );
          set({ paymentMethods: filtered, isLoaded: true, isLoading: false });
          return filtered;
        } catch (err) {
          set({ paymentMethods: [], isLoaded: true, isLoading: false, error: err });
          throw err;
        }
      },

    }),
    {
      name: 'payment-methods-storage-v2',
      partialize: (state) => ({
        paymentMethods: state.paymentMethods,
        isLoaded: state.isLoaded,
      }),
    }
  )
);

export default usePaymentMethodsStore;
