import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { referenceSchema } from '../schemas/creditFormSchemas';

const useCreditFormStore = create(
  persist(
    (set, get) => ({
      // State
      formData: {},
      currentStep: 1,
      completedSteps: [],
      customNextHandler: null,
      referenceValidationErrors: null,

      // Actions
      updateFormData: (stepData) => {
        set((state) => {
          const newData = { ...state.formData, ...stepData };
          return { formData: newData };
        });
      },

      markStepAsCompleted: (stepId) => {
        set((state) => {
          if (!state.completedSteps.includes(stepId)) {
            return {
              completedSteps: [...state.completedSteps, stepId]
            };
          }
          return state;
        });
      },

      setCurrentStep: (step) => {
        set({ currentStep: step });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      goToNextStep: () => {
        const { currentStep, completedSteps, formData } = get();
        const totalSteps = 7;

        if (currentStep === 5) {
          const referencesData = formData.personalReferences || {};
          const reference1 = referencesData.reference1 || {};
          const reference2 = referencesData.reference2 || {};

          const normalizeReference = (ref) => {
            return {
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
              referenciaUbicacion: ref.referenciaUbicacion ?? ''
            };
          };

          const result1 = referenceSchema.safeParse(normalizeReference(reference1));
          const result2 = referenceSchema.safeParse(normalizeReference(reference2));

          if (!result1.success || !result2.success) {
            const errors = {
              reference1: result1.success ? null : result1.error.flatten().fieldErrors,
              reference2: result2.success ? null : result2.error.flatten().fieldErrors
            };
            set({ referenceValidationErrors: errors });
            return;
          }

          set({ referenceValidationErrors: null });
        }

        if (currentStep < totalSteps) {
          const newCompleted = completedSteps.includes(currentStep) 
            ? completedSteps 
            : [...completedSteps, currentStep];
          set({
            currentStep: currentStep + 1,
            completedSteps: newCompleted
          });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },

      goToPreviousStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },

      goToStep: (stepId) => {
        const { completedSteps, currentStep } = get();
        if (completedSteps.includes(stepId - 1) || stepId <= currentStep) {
          set({ currentStep: stepId });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },

      setCustomNextHandler: (handler) => {
        set({ customNextHandler: handler });
      },

      resetForm: () => {
        set({
          formData: {},
          currentStep: 1,
          completedSteps: [],
          customNextHandler: null,
          referenceValidationErrors: null
        });
      }
    }),
    {
      name: 'credit-form-storage',
      partialize: (state) => {
        const sanitizedFormData = { ...state.formData };

        delete sanitizedFormData.identityVerification;
        delete sanitizedFormData.officialId;

        return {
          formData: sanitizedFormData,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps
        };
      }
    }
  )
);

export const useCreditForm = () => {
  const store = useCreditFormStore();
  return {
    ...store,
    totalSteps: 7
  };
};

export { useCreditFormStore };

export default useCreditFormStore;
