import { useState, useEffect } from 'react';
import { authService } from '../api/services/authService';
import { getCookie } from '../utils/cookieUtils';
import useUserStore from '../stores/userStore';
import useProfileStore from '../stores/profileStore';

/**
 * Initializes authentication state on app mount.
 * Checks for an existing token and hydrates userStore/profileStore if needed.
 */
export const useAuthInit = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getCookie('authToken') || authService.getToken();
        if (!token) {
          setLoading(false);
          return;
        }

        const storedUser = useUserStore.getState().user;
        if (storedUser) {
          setLoading(false);
          return;
        }

        const profile = await useProfileStore.getState().fetchProfileInformation();
        const client = profile?.client ?? profile?.user ?? profile?.client_information;
        if (client) {
          const user = {
            client_id: client.client_id ?? client.clientId ?? client.id,
            email: client.email ?? client.personal_email ?? client.client_email,
            name: client.name,
            paternalLastName: client.paternalLastName ?? client.paternal_lastname,
            maternalLastName: client.maternalLastName ?? client.maternal_lastname,
            phone: client.phone,
            birthdate: client.birthdate,
            creditApproved: client.creditApproved ?? client.credit_approved,
            limitCreditAmount: client.limitCreditAmount ?? client.limit_credit_amount,
            creditStatus: client.creditStatus ?? client.credit_status,
            address: client.address,
            emailVerified: client.emailVerified ?? client.verifiedEmail ?? client.verified_email ?? false,
          };
          useUserStore.getState().setUser(user);
          useProfileStore.getState().setClientFromLogin(user);
        }
      } catch {
        // Silent fail — user stays unauthenticated
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { loading };
};
