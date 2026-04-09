import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addressService } from '../api/services/addressService';

const useAddressesStore = create(
  persist(
    (set, get) => ({
      addresses: [],
      isLoaded: false,
      isLoading: false,
      error: null,

      /**
       * @param {{ force?: boolean }} [options] - force: true ignora caché y vuelve a llamar al API
       */
      fetchAddresses: async (options = {}) => {
        const force = options.force === true;
        const { isLoaded, isLoading } = get();
        if (isLoading) return get().addresses;
        if (!force && isLoaded) return get().addresses;

        set({ error: null, isLoading: true });
        try {
          const data = await addressService.getAddresses();
          const list = Array.isArray(data) ? data : [];
          set({ addresses: list, isLoaded: true, isLoading: false });
          return list;
        } catch (err) {
          set({ addresses: [], isLoaded: true, isLoading: false, error: err });
          throw err;
        }
      },

      invalidateAddresses: () => set({ isLoaded: false }),

      clearAddresses: () => set({ addresses: [], isLoaded: false, error: null }),
    }),
    {
      name: 'addresses-storage',
      partialize: (state) => ({
        addresses: state.addresses,
        isLoaded: state.isLoaded,
      }),
    }
  )
);

export default useAddressesStore;
