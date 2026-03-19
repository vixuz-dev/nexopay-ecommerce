import React from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';

const PaymentErrorModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-error-title"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <HiOutlineExclamationCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h3 id="payment-error-title" className="text-lg font-bold text-gray-900 mb-3">
            ¡Ups! Hubo un error al procesar tu pago.
          </h3>
          <div className="w-full text-left mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-500  tracking-wide mb-1">
              Mensaje de error
            </p>
            <p className="text-sm text-gray-700">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentErrorModal;
