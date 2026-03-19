import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { profileService } from '../api/services/profileService';

const useProfileStore = create(
  persist(
    (set) => ({
      profileInformation: null,
      isProfileLoaded: false,

      fetchProfileInformation: async () => {
        set({ isProfileLoaded: false });
        try {
          const data = await profileService.getProfileInformation();
          set({ profileInformation: data, isProfileLoaded: true });
          return data;
        } catch (err) {
          set({ profileInformation: null, isProfileLoaded: true });
          throw err;
        }
      },

      setProfileInformation: (data) => set({ profileInformation: data, isProfileLoaded: true }),

      setClientFromLogin: (client) => {
        set((state) => ({
          profileInformation: {
            ...state.profileInformation,
            client: {
              client_id: client.client_id,
              name: client.name,
              paternalLastName: client.paternalLastName,
              maternalLastName: client.maternalLastName,
              phone: client.phone,
              birthdate: client.birthdate,
              limitCreditAmount: client.limitCreditAmount,
              creditStatus: client.creditStatus,
              address: client.address,
            },
          },
          isProfileLoaded: true,
        }));
      },

      clearProfileInformation: () => set({ profileInformation: null }),
    }),
    {
      name: 'profile-storage',
      partialize: (state) => ({
        profileInformation: state.profileInformation,
      }),
    }
  )
);

export default useProfileStore;
