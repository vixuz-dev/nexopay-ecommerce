import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreditForm } from '../../stores/creditFormStore';
import useToastStore from '../../stores/toastStore';
import { mapCreditRequestToBackend } from '../../utils/creditRequestMapper';
import { creditLineRequestService } from '../../api/services/creditLineRequestService';
import { ROUTES } from '../../utils/routes';
import StepIndicator from './StepIndicator';
import NavigationButtons from './NavigationButtons';
import PersonalAddressStep from './steps/PersonalAddressStep';
import LocationStep from './steps/LocationStep';
import IdentityVerificationStep from './steps/IdentityVerificationStep';
import OfficialIdStep from './steps/OfficialIdStep';
import PersonalReferencesStep from './steps/PersonalReferencesStep';
import TellUsAboutYouStep from './steps/TellUsAboutYouStep';
import ConfirmationStep from './steps/ConfirmationStep';

export { useCreditForm };

const steps = [
  {
    id: 1,
    title: 'Dirección personal',
    description: 'Información de contacto',
    component: PersonalAddressStep
  },
  {
    id: 2,
    title: 'Ubicación',
    description: 'Ubica tu domicilio',
    component: LocationStep
  },
  {
    id: 3,
    title: 'Verificación de identidad',
    description: 'Foto de tu rostro',
    component: IdentityVerificationStep
  },
  {
    id: 4,
    title: 'Identificación Oficial',
    description: 'Documento de identidad',
    component: OfficialIdStep
  },
  {
    id: 5,
    title: 'Referencias personales',
    description: 'Datos de referencias',
    component: PersonalReferencesStep
  },
  {
    id: 6,
    title: 'Conozcámonos mejor',
    description: 'Preguntas rápidas',
    component: TellUsAboutYouStep
  },
  {
    id: 7,
    title: 'Confirmación',
    description: 'Revisa tu solicitud',
    component: ConfirmationStep
  }
];

const CreditWizard = () => {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    currentStep,
    formData,
    completedSteps,
    updateFormData,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    totalSteps,
    customNextHandler,
    setCustomNextHandler,
    isCurrentStepValid,
    setIsCurrentStepValid,
    resetForm,
    fetchCreditLineStatus,
    fetchCreditLineRequests,
  } = useCreditForm();

  const currentStepData = steps.find(step => step.id === currentStep);
  const CurrentStepComponent = currentStepData?.component;
  const isLastStep = currentStep === totalSteps;

  useEffect(() => {
    setCustomNextHandler(null);
  }, [currentStep, setCustomNextHandler]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = await mapCreditRequestToBackend(formData);
      await creditLineRequestService.createCreditLineRequest(payload);
      showToast('Solicitud enviada correctamente. Te contactaremos pronto.', 'success');
      resetForm();
      await Promise.all([fetchCreditLineStatus(), fetchCreditLineRequests()]);
      navigate(ROUTES.MY_CREDIT);
    } catch (error) {
      const message = error.message || error.statusMessage || 'No se pudo enviar la solicitud. Intenta de nuevo.';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit();
      return;
    }
    if (customNextHandler) {
      customNextHandler();
    } else {
      goToNextStep();
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <StepIndicator 
        steps={steps} 
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={goToStep}
      />
      
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mt-8">
          {CurrentStepComponent && (
            <CurrentStepComponent 
              setCustomNextHandler={setCustomNextHandler}
            />
          )}
        
        <NavigationButtons 
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={goToPreviousStep}
          onNext={handleNext}
          isFormValid={isCurrentStepValid}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default CreditWizard;

