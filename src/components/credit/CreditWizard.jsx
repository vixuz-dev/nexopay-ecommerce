import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreditForm } from '../../stores/creditFormStore';
import useUserStore from '../../stores/userStore';
import useToastStore from '../../stores/toastStore';
import { mapCreditRequestToBackend } from '../../utils/creditRequestMapper';
import { creditLineRequestService } from '../../api/services/creditLineRequestService';
import { ROUTES, EMAIL_VERIFY_FROM_QUERY, EMAIL_VERIFY_FROM } from '../../utils/routes';
import {
  getCreditShowButtonFromApiBody,
  getCreditRequestStatusFromApiBody
} from '../../utils/creditLineShowButton';
import StepIndicator from './StepIndicator';
import NavigationButtons from './NavigationButtons';
import PersonalAddressStep from './steps/PersonalAddressStep';
import LocationStep from './steps/LocationStep';
import IdentityVerificationStep from './steps/IdentityVerificationStep';
import OfficialIdStep from './steps/OfficialIdStep';
import EmailCurpStep from './steps/EmailCurpStep';
import PersonalReferencesStep from './steps/PersonalReferencesStep';
import TellUsAboutYouStep from './steps/TellUsAboutYouStep';
import ConfirmationStep from './steps/ConfirmationStep';
import EmailErrorModal from './EmailErrorModal';

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
    title: 'Datos complementarios',
    description: 'Correo y CURP',
    component: EmailCurpStep
  },
  {
    id: 5,
    title: 'Identificación Oficial',
    description: 'Documento de identidad',
    component: OfficialIdStep
  },
  {
    id: 6,
    title: 'Referencias personales',
    description: 'Datos de referencias',
    component: PersonalReferencesStep
  },
  {
    id: 7,
    title: 'Conozcámonos mejor',
    description: 'Preguntas rápidas',
    component: TellUsAboutYouStep
  },
  {
    id: 8,
    title: 'Confirmación',
    description: 'Revisa tu solicitud',
    component: ConfirmationStep
  }
];

const CreditWizard = () => {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailErrorModal, setEmailErrorModal] = useState({ isOpen: false, message: '' });
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
    setLastCreditRequestResult,
    setCreditLineStatus,
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
      const response = await creditLineRequestService.createCreditLineRequest(payload);
      if (response?.success === false) {
        const message = response?.statusMessage || response?.message || 'No se pudo crear la solicitud de crédito.';
        setEmailErrorModal({ isOpen: true, message });
        return;
      }
      const body = response?.body || response?.data || response;
      const approvedRaw = body?.approvedRequest;
      const isApprovedRequest =
        approvedRaw === true ||
        approvedRaw === 'true' ||
        String(approvedRaw ?? '').toLowerCase() === 'true';

      if (
        body &&
        (body.approvedRequest !== undefined ||
          body.creditLineAmount !== undefined ||
          body.showButton !== undefined ||
          body.showButtonCreditLineRequest !== undefined)
      ) {
        const sbNum = getCreditShowButtonFromApiBody(body);
        const statusStr = getCreditRequestStatusFromApiBody(body);
        setLastCreditRequestResult({
          approvedRequest: body.approvedRequest ?? null,
          creditLineAmount: body.creditLineAmount ?? 0,
          showButton: sbNum,
        });
        setCreditLineStatus(sbNum, statusStr);
        const creditFormEmail = String(formData?.emailCurp?.email ?? '').trim();
        const sessionEmail = String(useUserStore.getState().user?.email ?? '').trim();
        const verificationEmail = creditFormEmail || sessionEmail;

        useUserStore.getState().patchUser({
          showButtonCreditLineRequest: sbNum === 1,
          ...(statusStr !== '' ? { creditRequest: statusStr } : {}),
          ...(body.creditLineAmount != null && !Number.isNaN(Number(body.creditLineAmount))
            ? { limitCreditAmount: Number(body.creditLineAmount) }
            : {}),
          ...(isApprovedRequest ? { creditApproved: true, creditStatus: true } : {}),
          ...(verificationEmail ? { email: verificationEmail } : {}),
        });
      }
      showToast(
        isApprovedRequest
          ? 'Tu solicitud fue aprobada. Verifica tu correo para poder comprar en la tienda.'
          : 'Solicitud enviada correctamente. Te contactaremos pronto.',
        'success'
      );
      const verificationEmailForNav = String(formData?.emailCurp?.email ?? '').trim();
      resetForm();
      await Promise.all([fetchCreditLineStatus(), fetchCreditLineRequests()]);
      if (isApprovedRequest) {
        navigate(
          `${ROUTES.EMAIL_VERIFICATION}?${EMAIL_VERIFY_FROM_QUERY}=${EMAIL_VERIFY_FROM.CREDIT_REQUEST}`,
          {
            replace: true,
            state: {
              fromApprovedCreditRequest: true,
              ...(verificationEmailForNav ? { verificationEmail: verificationEmailForNav } : {}),
            },
          }
        );
      } else {
        navigate(ROUTES.MY_CREDIT);
      }
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

      <EmailErrorModal
        isOpen={emailErrorModal.isOpen}
        message={emailErrorModal.message}
        onEdit={() => {
          setEmailErrorModal({ isOpen: false, message: '' });
          goToStep(4);
        }}
        onClose={() => setEmailErrorModal({ isOpen: false, message: '' })}
      />
    </div>
  );
};

export default CreditWizard;

