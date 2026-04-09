import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { profileService } from '../api/services/profileService';

const useProfileStore = create(
  persist(
    (set) => ({
      profileInformation: null,
      personalInformation: null,
      isProfileLoaded: false,
      isPersonalInformationLoaded: false,

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

      fetchPersonalInformation: async () => {
        set({ isPersonalInformationLoaded: false });
        try {
          const data = await profileService.getPersonalInformation();
          set({ personalInformation: data, isPersonalInformationLoaded: true });
          return data;
        } catch (err) {
          set({ personalInformation: null, isPersonalInformationLoaded: true });
          throw err;
        }
      },

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

      clearProfileInformation: () =>
        set({ profileInformation: null, personalInformation: null, isPersonalInformationLoaded: false }),
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
