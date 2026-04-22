import { create } from 'zustand';

const initialState = {
  phoneNumber: '',
  flowCommitted: false,
  otpValidated: false,
  /** Token devuelto por `validate_otp` solo en flujo `reset_password`; se envía en `update_client_password`. */
  tokenResetPassword: '',
};

/**
 * Estado del flujo "Olvidé mi contraseña". Sin persistencia: al recargar se pierde y las pantallas redirigen.
 */
const usePasswordResetStore = create((set) => ({
  ...initialState,

  setPhoneAndCommitFlow: (phoneNumber) =>
    set({
      phoneNumber,
      flowCommitted: true,
      otpValidated: false,
      tokenResetPassword: '',
    }),

  setOtpValidatedWithToken: (tokenResetPassword) =>
    set({
      otpValidated: true,
      tokenResetPassword,
    }),

  reset: () => set({ ...initialState }),
}));

export default usePasswordResetStore;
