import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import CreditWizard from '../components/credit/CreditWizard';
import ExitWarningModal from '../components/credit/ExitWarningModal';
import { useCreditFormStore } from '../stores/creditFormStore';
import useCreditLineStatusStore from '../stores/creditLineStatusStore';
import { ROUTES } from '../utils/routes';

const RequestCredit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const resetForm = useCreditFormStore((state) => state.resetForm);
  const formData = useCreditFormStore((state) => state.formData);
  const currentStep = useCreditFormStore((state) => state.currentStep);
  const canRequestCredit = useCreditLineStatusStore((state) => state.canRequestCredit);
  const isLoaded = useCreditLineStatusStore((state) => state.isLoaded);
  const fetchCreditLineStatus = useCreditLineStatusStore((state) => state.fetchCreditLineStatus);
  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const hasFormData = useRef(false);
  const isNavigatingAway = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      if (!isLoaded) {
        try {
          await fetchCreditLineStatus();
        } catch {
          if (!cancelled) setCheckingAccess(false);
        }
      }
      if (!cancelled) setCheckingAccess(false);
    };
    check();
    return () => { cancelled = true; };
  }, [isLoaded, fetchCreditLineStatus]);

  useEffect(() => {
    if (checkingAccess) return;
    if (!canRequestCredit()) {
      navigate(ROUTES.MY_CREDIT, { replace: true });
    }
  }, [checkingAccess, canRequestCredit, navigate]);

  useEffect(() => {
    const hasData = Object.keys(formData).length > 0 || currentStep > 1;
    hasFormData.current = hasData;
  }, [formData, currentStep]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasFormData.current && !isNavigatingAway.current) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      const to = link.getAttribute('to');
      const targetPath = href || to;

      if (!targetPath) return;

      const isExternal = targetPath.startsWith('http') || targetPath.startsWith('//') || targetPath.startsWith('mailto:');
      const isCreditRequest = targetPath === ROUTES.REQUEST_CREDIT || targetPath === ROUTES.CREDIT_REQUEST || targetPath === location.pathname;

      if (isExternal || isCreditRequest) {
        return;
      }

      if (hasFormData.current && !isNavigatingAway.current) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setPendingNavigation(targetPath);
        setShowExitModal(true);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClick, true);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClick, true);
    };
  }, [location.pathname]);

  useEffect(() => {
    let isBlocked = false;

    const handlePopState = (e) => {
      if (hasFormData.current && !isNavigatingAway.current && !isBlocked) {
        isBlocked = true;
        window.history.pushState(null, '', location.pathname);
        setShowExitModal(true);
        setTimeout(() => {
          isBlocked = false;
        }, 100);
      }
    };

    window.history.pushState(null, '', location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname]);

  const handleConfirmExit = () => {
    isNavigatingAway.current = true;
    resetForm();
    setShowExitModal(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    } else {
      navigate(-1);
    }
    setTimeout(() => {
      isNavigatingAway.current = false;
    }, 1000);
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
    setPendingNavigation(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Solicitud de Crédito
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Completa los siguientes pasos para solicitar tu línea de crédito
          </p>
        </div>
        <CreditWizard />
      </div>
      <Footer />
      <ExitWarningModal
        isOpen={showExitModal}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
      />
    </div>
  );
};

export default RequestCredit;
