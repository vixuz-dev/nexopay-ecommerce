import React from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';

const NavigationButtons = ({ currentStep, totalSteps, onPrevious, onNext }) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
      <button
        onClick={onPrevious}
        disabled={isFirstStep}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
          isFirstStep
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <HiOutlineChevronLeft className="w-5 h-5" />
        Anterior
      </button>

      <div className="text-sm text-gray-500">
        Paso {currentStep} de {totalSteps}
      </div>

      <button
        onClick={onNext}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
          isLastStep
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-primary-600 hover:bg-primary-700'
        }`}
      >
        {isLastStep ? 'Confirmar' : 'Siguiente'}
        {!isLastStep && <HiOutlineChevronRight className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default NavigationButtons;

