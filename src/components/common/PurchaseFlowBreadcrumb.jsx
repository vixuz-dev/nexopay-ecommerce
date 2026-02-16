import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, PURCHASE_FLOW_STEPS } from '../../utils/routes';
import { HiOutlineChevronRight, HiOutlineHome } from 'react-icons/hi2';

const PurchaseFlowBreadcrumb = ({ currentStep }) => {
  const currentIndex = PURCHASE_FLOW_STEPS.findIndex(s => s.key === currentStep);

  const getStepsToShow = () => {
    if (currentIndex < 0) return [];
    return PURCHASE_FLOW_STEPS.slice(0, currentIndex + 1);
  };

  const steps = getStepsToShow();

  return (
    <nav className="mb-6" aria-label="Navegación del proceso de compra">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
        <li>
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-1 hover:text-primary-600 transition-colors"
          >
            <HiOutlineHome className="w-4 h-4" />
            Inicio
          </Link>
        </li>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isCurrentStep = step.key === currentStep;

          return (
            <li key={step.key} className="flex items-center gap-2">
              <HiOutlineChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              {isCurrentStep ? (
                <span className="font-medium text-gray-900" aria-current="page">
                  {step.label}
                </span>
              ) : (
                <Link
                  to={step.path}
                  className="hover:text-primary-600 transition-colors"
                >
                  {step.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default PurchaseFlowBreadcrumb;
