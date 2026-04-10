import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { referenceSchema } from '../schemas/credit';
import { creditLineRequestService } from '../api/services/creditLineRequestService';
import { creditLineService } from '../api/services/creditLineService';
import { profileService } from '../api/services/profileService';
import useUserStore from './userStore';
import {
  getCreditShowButtonFromApiBody,
  getCreditRequestStatusFromApiBody,
} from '../utils/creditLineShowButton';

const useCreditStore = create(
  persist(
    (set, get) => ({
      formData: {},
      currentStep: 1,
      completedSteps: [],
      customNextHandler: null,
      referenceValidationErrors: null,
      isCurrentStepValid: false,

      showButton: 1,
      requestStatus: '',
      isStatusLoaded: false,
      isLoaded: false,
      lastCreditStatusFetchAt: 0,

      creditLineProfile: null,
      isProfileLoaded: false,

      creditLineRequests: [],
      isRequestsLoaded: false,

      creditLine: null,
      creditLineHistory: null,

      lastCreditRequestResult: null,

      setLastCreditRequestResult: (result) => set({ lastCreditRequestResult: result }),
      clearLastCreditRequestResult: () => set({ lastCreditRequestResult: null }),

      updateFormData: (stepData) => {
        set((state) => {
          const newData = { ...state.formData, ...stepData };
          return { formData: newData };
        });
      },

      markStepAsCompleted: (stepId) => {
        set((state) => {
          if (!state.completedSteps.includes(stepId)) {
            return { completedSteps: [...state.completedSteps, stepId] };
          }
          return state;
        });
      },

      setCurrentStep: (step) => {
        set({ currentStep: step });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      goToNextStep: () => {
        const { currentStep, completedSteps, formData, isCurrentStepValid } = get();
        const totalSteps = 8;

        if (!isCurrentStepValid) return;

        if (currentStep === 5) {
          const referencesData = formData.personalReferences || {};
          const reference1 = referencesData.reference1 || {};
          const reference2 = referencesData.reference2 || {};
          const normalizeReference = (ref) => ({
            nombres: ref.nombres ?? '',
            apellidoPaterno: ref.apellidoPaterno ?? '',
            apellidoMaterno: ref.apellidoMaterno ?? '',
            telefono: ref.telefono ?? '',
            calle: ref.calle ?? '',
            numeroExterior: ref.numeroExterior ?? '',
            numeroInterior: ref.numeroInterior ?? '',
            colonia: ref.colonia ?? '',
            ciudad: ref.ciudad ?? '',
            estado: ref.estado ?? '',
            codigoPostal: ref.codigoPostal ?? '',
            referenciaUbicacion: ref.referenciaUbicacion ?? '',
          });
          const result1 = referenceSchema.safeParse(normalizeReference(reference1));
          const result2 = referenceSchema.safeParse(normalizeReference(reference2));
          if (!result1.success || !result2.success) {
            set({
              referenceValidationErrors: {
                reference1: result1.success ? null : result1.error.flatten().fieldErrors,
                reference2: result2.success ? null : result2.error.flatten().fieldErrors,
              },
            });
            return;
          }
          set({ referenceValidationErrors: null });
        }

        if (currentStep < totalSteps) {
          const newCompleted = completedSteps.includes(currentStep) ? completedSteps : [...completedSteps, currentStep];
          const nextStep = currentStep + 1;
          set({ currentStep: nextStep, completedSteps: newCompleted });
          setTimeout(() => {
            const el = document.getElementById(`step-title-${nextStep}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
        }
      },

      goToPreviousStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1, isCurrentStepValid: false });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },

      goToStep: (stepId) => {
        const { completedSteps, currentStep } = get();
        if (completedSteps.includes(stepId - 1) || stepId <= currentStep) {
          set({ currentStep: stepId, isCurrentStepValid: false });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },

      setCustomNextHandler: (handler) => set({ customNextHandler: handler }),
      setIsCurrentStepValid: (isValid) => set({ isCurrentStepValid: isValid }),

      resetForm: () => {
        set({
          formData: {},
          currentStep: 1,
          completedSteps: [],
          customNextHandler: null,
          referenceValidationErrors: null,
          isCurrentStepValid: false,
        });
      },

      clearCreditData: () => {
        set({
          creditLineProfile: null,
          creditLineRequests: [],
          creditLine: null,
          creditLineHistory: null,
          isProfileLoaded: false,
          isRequestsLoaded: false,
        });
      },

      fetchCreditLineStatus: async () => {
        const user = useUserStore.getState().user;
        if (user) {
          const showButtonNum = getCreditShowButtonFromApiBody(user);
          const requestStatusStr = getCreditRequestStatusFromApiBody(user);
          set({
            showButton: showButtonNum,
            requestStatus: requestStatusStr,
            isStatusLoaded: true,
            isLoaded: true,
            lastCreditStatusFetchAt: Date.now(),
          });
        } else {
          set({ isStatusLoaded: true, isLoaded: true });
        }
        const s = get();
        return { showButton: s.showButton, requestStatus: s.requestStatus };
      },

      canRequestCredit: () => get().showButton === 1,

      setCreditLineStatus: (showButton, requestStatus) => {
        set({
          showButton: showButton !== undefined ? Number(showButton) : get().showButton,
          requestStatus: requestStatus != null ? String(requestStatus) : get().requestStatus,
          isStatusLoaded: true,
          isLoaded: true,
          lastCreditStatusFetchAt: Date.now(),
        });
      },

      resetStatus: () =>
        set({
          showButton: 1,
          requestStatus: '',
          isStatusLoaded: false,
          isLoaded: false,
          lastCreditStatusFetchAt: 0,
        }),

      fetchCreditLineProfile: async () => {
        set({ isProfileLoaded: false });
        try {
          const data = await profileService.getCreditLine();
          set({
            creditLineProfile: data,
            isProfileLoaded: true,
          });
          return data;
        } catch (err) {
          set({ creditLineProfile: null, isProfileLoaded: true });
          throw err;
        }
      },

      setCreditLineProfile: (profile) => set({ creditLineProfile: profile, isProfileLoaded: true }),

      fetchCreditLineRequests: async () => {
        set({ isRequestsLoaded: false });
        try {
          const data = await creditLineRequestService.getCreditLineRequests();
          const list = Array.isArray(data) ? data : [];
          set({ creditLineRequests: list, isRequestsLoaded: true });
          return list;
        } catch (err) {
          set({ creditLineRequests: [], isRequestsLoaded: true });
          throw err;
        }
      },

      setCreditLineRequests: (requests) => set({ creditLineRequests: requests ?? [], isRequestsLoaded: true }),

      fetchCreditLine: async () => {
        try {
          const data = await creditLineService.getCreditLine();
          set({ creditLine: data });
          return data;
        } catch (err) {
          set({ creditLine: null });
          throw err;
        }
      },

      fetchCreditLineHistory: async () => {
        try {
          const data = await creditLineService.getCreditLineHistory();
          set({ creditLineHistory: data ?? null });
          return data;
        } catch (err) {
          set({ creditLineHistory: null });
          throw err;
        }
      },
    }),
    {
      name: 'credit-storage',
      partialize: (state) => {
        const sanitizedFormData = { ...state.formData };
        if (sanitizedFormData.identityVerification) {
          const { selfieFile, ...rest } = sanitizedFormData.identityVerification;
          sanitizedFormData.identityVerification = rest;
        }
        if (sanitizedFormData.officialId) {
          const { frontFile, backFile, passportFile, ...rest } = sanitizedFormData.officialId;
          sanitizedFormData.officialId = rest;
        }
        return {
          formData: sanitizedFormData,
          currentStep: state.currentStep,
          completedSteps: state.completedSteps,
          showButton: state.showButton,
          requestStatus: state.requestStatus,
          isStatusLoaded: state.isStatusLoaded,
          isLoaded: state.isLoaded,
          creditLineProfile: state.creditLineProfile,
          isProfileLoaded: state.isProfileLoaded,
          creditLineRequests: state.creditLineRequests,
          isRequestsLoaded: state.isRequestsLoaded,
          creditLine: state.creditLine,
          creditLineHistory: state.creditLineHistory,
          lastCreditRequestResult: state.lastCreditRequestResult,
        };
      },
    }
  )
);

export const useCreditForm = () => {
  const store = useCreditStore();
  return {
    ...store,
    totalSteps: 8,
  };
};

export const useCreditFormStore = (selector) => useCreditStore(selector);
useCreditFormStore.getState = useCreditStore.getState;

export default useCreditStore;
