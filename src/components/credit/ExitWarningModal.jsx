import React from 'react';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

const ExitWarningModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <HiOutlineExclamationTriangle className="w-8 h-8 text-amber-600" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            ¿Estás seguro de que deseas salir?
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Si sales ahora, perderás toda la información de tu solicitud de crédito. 
            Tendrás que comenzar desde el principio.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={onConfirm}
              className="w-full px-4 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Salir de todas formas
            </button>
            <button
              onClick={onCancel}
              className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitWarningModal;

