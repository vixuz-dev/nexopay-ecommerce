import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../api/services/authService';
import { profileService } from '../api/services/profileService';
import useProfileStore from '../stores/profileStore';
import { getCookie, removeCookie } from '../utils/cookieUtils';
import useAddressesStore from '../stores/addressesStore';
import useUserStore from '../stores/userStore';
import { useCreditFormStore } from '../stores/creditFormStore';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload.error,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload.loading,
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getCookie('authToken') || authService.getToken();
        if (!token) {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: { loading: false } });
          return;
        }

        const storedUser = useUserStore.getState().user;
        if (storedUser) {
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user: storedUser },
          });
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
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user },
          });
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: { loading: false } });
        }
      } catch (error) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: { error: error.message },
        });
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const unsubscribe = useUserStore.subscribe(() => {
      const token = getCookie('authToken') || authService.getToken();
      const user = useUserStore.getState().user;
      if (token && user) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user },
        });
      }
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const response = await authService.login(email, password);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: response.user },
      });
      return response;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: error.message },
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeCookie('authToken');
      useUserStore.getState().clearUser();
      useProfileStore.getState().clearProfileInformation();
      const { resetForm } = useCreditFormStore.getState();
      resetForm();
      useAddressesStore.getState().clearAddresses();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
