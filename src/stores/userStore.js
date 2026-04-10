import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,

      patchUser: (partial) => {
        const user = get().user;
        if (!user) return;
        set({ user: { ...user, ...partial } });
      },

      setUser: (userData) => {
        const email = userData.email ?? userData.personal_email ?? userData.client_email;
        const emailVerified = userData.emailVerified ?? userData.verifiedEmail ?? false;
        const clientId = userData.client_id ?? userData.clientId;
        set({
          user: {
            client_id: clientId,
            email,
            name: userData.name,
            paternalLastName: userData.paternalLastName ?? userData.paternal_lastname,
            maternalLastName: userData.maternalLastName ?? userData.maternal_lastname,
            phone: userData.phone,
            birthdate: userData.birthdate,
            creditApproved: userData.creditApproved ?? userData.credit_approved,
            limitCreditAmount: userData.limitCreditAmount ?? userData.limit_credit_amount,
            creditStatus: userData.creditStatus ?? userData.credit_status,
            hasCreditLine: userData.hasCreditLine ?? userData.has_credit_line,
            showButtonCreditLineRequest:
              userData.showButtonCreditLineRequest ?? userData.show_button_credit_line_request,
            creditRequest:
              (userData.creditRequest ?? userData.credit_request) != null &&
              String(userData.creditRequest ?? userData.credit_request).trim() !== ''
                ? String(userData.creditRequest ?? userData.credit_request)
                : undefined,
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
            emailVerified,
          },
        });
      },

      setEmailVerified: (verified) => {
        const user = get().user;
        if (user) {
          set({ user: { ...user, emailVerified: verified } });
        }
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

