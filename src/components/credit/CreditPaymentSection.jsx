import React from 'react';
import { HiOutlineBanknotes } from 'react-icons/hi2';

const CreditPaymentSection = ({ onPay }) => {
  return (
    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border-2 border-primary-200 p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Realizar Pago</h3>
          <p className="text-sm text-gray-600">
            Paga tu línea de crédito de forma rápida y segura
          </p>
        </div>
        <button
          onClick={onPay}
          className="w-full md:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <HiOutlineBanknotes className="w-5 h-5" />
          Pagar Ahora
        </button>
      </div>
    </div>
  );
};

export default CreditPaymentSection;

