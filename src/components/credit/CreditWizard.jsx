import React, { useState, createContext, useContext, useEffect } from 'react';
import StepIndicator from './StepIndicator';
import NavigationButtons from './NavigationButtons';
import PersonalAddressStep from './steps/PersonalAddressStep';
import LocationStep from './steps/LocationStep';
import IdentityVerificationStep from './steps/IdentityVerificationStep';
import OfficialIdStep from './steps/OfficialIdStep';
import PersonalReferencesStep from './steps/PersonalReferencesStep';
import TellUsAboutYouStep from './steps/TellUsAboutYouStep';
import ConfirmationStep from './steps/ConfirmationStep';

const CreditFormContext = createContext();

export const useCreditForm = () => {
  const context = useContext(CreditFormContext);
  if (!context) {
    throw new Error('useCreditForm must be used within CreditWizard');
  }
  return context;
};

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
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('creditFormData');
    return saved ? JSON.parse(saved) : {};
  });
  const [completedSteps, setCompletedSteps] = useState(() => {
    const saved = localStorage.getItem('completedSteps');
    return saved ? JSON.parse(saved) : [];
  });

  const updateFormData = (stepData) => {
    const newData = { ...formData, ...stepData };
    setFormData(newData);
    localStorage.setItem('creditFormData', JSON.stringify(newData));
  };

  const markStepAsCompleted = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      const newCompleted = [...completedSteps, stepId];
      setCompletedSteps(newCompleted);
      localStorage.setItem('completedSteps', JSON.stringify(newCompleted));
    }
  };

  const goToNextStep = () => {
    if (currentStep < steps.length) {
      markStepAsCompleted(currentStep);
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (stepId) => {
    if (completedSteps.includes(stepId - 1) || stepId <= currentStep) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentStepData = steps.find(step => step.id === currentStep);
  const CurrentStepComponent = currentStepData?.component;

  const [customNextHandler, setCustomNextHandler] = useState(null);

  useEffect(() => {
    setCustomNextHandler(null);
  }, [currentStep]);

  const contextValue = {
    currentStep,
    formData,
    updateFormData,
    completedSteps,
    markStepAsCompleted,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    totalSteps: steps.length,
    setCustomNextHandler
  };

  const handleNext = () => {
    if (customNextHandler) {
      customNextHandler();
    } else {
      goToNextStep();
    }
  };

  return (
    <CreditFormContext.Provider value={contextValue}>
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
              formData={formData}
              updateFormData={updateFormData}
              setCustomNextHandler={setCustomNextHandler}
            />
          )}
          
          <NavigationButtons 
            currentStep={currentStep}
            totalSteps={steps.length}
            onPrevious={goToPreviousStep}
            onNext={handleNext}
          />
        </div>
      </div>
    </CreditFormContext.Provider>
  );
};

export default CreditWizard;

