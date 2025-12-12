import React from 'react';
import { HiOutlineCheck } from 'react-icons/hi2';

const StepIndicator = ({ steps, currentStep, completedSteps, onStepClick }) => {
  return (
    <div className="w-full">
      <div className="hidden md:block">
        <div className="relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
            <div 
              className="h-full bg-primary-600 transition-all duration-500"
              style={{ 
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
              }}
            />
          </div>
          
          <div className="flex justify-between relative">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;
              const isClickable = isCompleted || step.id <= currentStep;
              
              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center flex-1 relative"
                  style={{ minHeight: '80px' }}
                >
                  <div className="h-10 flex items-center justify-center">
                    <button
                      onClick={() => isClickable && onStepClick(step.id)}
                      disabled={!isClickable}
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 flex-shrink-0 ${
                        isCompleted
                          ? 'bg-primary-600 text-white'
                          : isCurrent
                          ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                          : 'bg-gray-200 text-gray-500'
                      } ${
                        isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'
                      }`}
                    >
                      {isCompleted ? (
                        <HiOutlineCheck className="w-6 h-6" />
                      ) : (
                        <span>{step.id}</span>
                      )}
                    </button>
                  </div>
                  
                  <div className="mt-3 text-center w-full px-1">
                    <p className={`text-xs font-semibold leading-tight ${
                      isCurrent ? 'text-primary-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 hidden lg:block leading-tight">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex items-center gap-2 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {steps.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            const isClickable = isCompleted || step.id <= currentStep;
            
            return (
              <button
                key={step.id}
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary-600 text-white'
                    : isCurrent
                    ? 'bg-primary-100 text-primary-700 border-2 border-primary-600'
                    : 'bg-gray-200 text-gray-500'
                } ${
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
              >
                {step.id}. {step.title}
              </button>
            );
          })}
        </div>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default StepIndicator;

