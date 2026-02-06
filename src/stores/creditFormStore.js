import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { referenceSchema } from '../schemas/credit';

const useCreditFormStore = create(
  persist(
    (set, get) => ({
      // State
      formData: {},
      currentStep: 1,
      completedSteps: [],
      customNextHandler: null,
      referenceValidationErrors: null,
      isCurrentStepValid: false,

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
        const { currentStep, completedSteps, formData, isCurrentStepValid } = get();
        const totalSteps = 7;

        if (!isCurrentStepValid) {
          return;
        }

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
          const nextStep = currentStep + 1;
          set({
            currentStep: nextStep,
            completedSteps: newCompleted
          });
          
          setTimeout(() => {
            const titleElement = document.getElementById(`step-title-${nextStep}`);
            if (titleElement) {
              titleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }, 100);
        }
      },

      goToPreviousStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ 
            currentStep: currentStep - 1,
            isCurrentStepValid: false
          });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },

      goToStep: (stepId) => {
        const { completedSteps, currentStep } = get();
        if (completedSteps.includes(stepId - 1) || stepId <= currentStep) {
          set({ 
            currentStep: stepId,
            isCurrentStepValid: false
          });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },

      setCustomNextHandler: (handler) => {
        set({ customNextHandler: handler });
      },

      setIsCurrentStepValid: (isValid) => {
        set({ isCurrentStepValid: isValid });
      },

      resetForm: () => {
        set({
          formData: {},
          currentStep: 1,
          completedSteps: [],
          customNextHandler: null,
          referenceValidationErrors: null,
          isCurrentStepValid: false
        });
      }
    }),
    {
      name: 'credit-form-storage',
      partialize: (state) => {
        const sanitizedFormData = { ...state.formData };

        if (sanitizedFormData.identityVerification) {
          const { selfieFile, ...identityData } = sanitizedFormData.identityVerification;
          sanitizedFormData.identityVerification = identityData;
        }

        if (sanitizedFormData.officialId) {
          const { frontFile, backFile, passportFile, ...officialIdData } = sanitizedFormData.officialId;
          sanitizedFormData.officialId = officialIdData;
        }

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
