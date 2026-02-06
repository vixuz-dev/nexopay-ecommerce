import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { creditLineRequestService } from '../api/services/creditLineRequestService';

/**
 * Store for credit line request status (have they already requested?).
 * showButton === 1 → can request (show banner, allow /solicitar-credito)
 * showButton === 0 → already requested (hide banner, block /solicitar-credito)
 */
const useCreditLineStatusStore = create(
  persist(
    (set, get) => ({
      showButton: 1,
      requestStatus: '',
      isLoaded: false,

      setCreditLineStatus: (showButton, requestStatus) => {
        set({
          showButton: showButton !== undefined ? Number(showButton) : get().showButton,
          requestStatus: requestStatus != null ? String(requestStatus) : get().requestStatus,
          isLoaded: true,
        });
      },

      fetchCreditLineStatus: async () => {
        try {
          const result = await creditLineRequestService.haveCreditLineRequest();
          set({
            showButton: result.showButton !== undefined ? Number(result.showButton) : 1,
            requestStatus: result.requestStatus != null ? String(result.requestStatus) : '',
            isLoaded: true,
          });
          return result;
        } catch (err) {
          set({ isLoaded: true });
          throw err;
        }
      },

      canRequestCredit: () => {
        return get().showButton === 1;
      },

      reset: () => {
        set({ showButton: 1, requestStatus: '', isLoaded: false });
      },
    }),
    {
      name: 'credit-line-status-storage',
      partialize: (state) => ({
        showButton: state.showButton,
        requestStatus: state.requestStatus,
        isLoaded: state.isLoaded,
      }),
    }
  )
);

export default useCreditLineStatusStore;
