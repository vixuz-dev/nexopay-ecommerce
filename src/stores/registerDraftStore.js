import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const REGISTER_DRAFT_STORAGE_KEY = 'nexopay-register-draft';

const emptyFormDraft = () => ({
  telefono: '',
  password: '',
  name: '',
  paternalLastname: '',
  maternalLastname: '',
});

/**
 * Borrador del registro + datos para validar OTP. Persistido en sessionStorage del tab
 * para recuperar el formulario al volver desde /validar-otp (atrás del navegador o enlace).
 */
const useRegisterDraftStore = create(
  persist(
    (set) => ({
      pendingOtpStep: false,
      phoneNumber: '',
      registrationData: null,
      formDraft: emptyFormDraft(),
      acceptedTerms: false,

      saveAfterOtpSent: ({ phoneNumber, registrationData, formDraft, acceptedTerms }) =>
        set({
          pendingOtpStep: true,
          phoneNumber,
          registrationData,
          formDraft: { ...formDraft },
          acceptedTerms,
        }),

      clearRegistrationDraft: () =>
        set({
          pendingOtpStep: false,
          phoneNumber: '',
          registrationData: null,
          formDraft: emptyFormDraft(),
          acceptedTerms: false,
        }),
    }),
    {
      name: REGISTER_DRAFT_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useRegisterDraftStore;
