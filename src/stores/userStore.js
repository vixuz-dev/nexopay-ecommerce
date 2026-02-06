import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,

      setUser: (userData) => {
        set({
          user: {
            client_id: userData.client_id,
            name: userData.name,
            paternalLastName: userData.paternalLastName,
            maternalLastName: userData.maternalLastName,
            phone: userData.phone,
            birthdate: userData.birthdate,
            creditApproved: userData.creditApproved,
            limitCreditAmount: userData.limitCreditAmount,
            creditStatus: userData.creditStatus,
            address: userData.address || {
              street: '',
              externalNumber: '',
              internalNumber: '',
              neighborhood: '',
              city: '',
              state: '',
              zipCode: '',
              references: '',
            },
          },
        });
      },

      clearUser: () => {
        set({ user: null });
      },

      isAuthenticated: () => {
        return get().user !== null;
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

export default useUserStore;

