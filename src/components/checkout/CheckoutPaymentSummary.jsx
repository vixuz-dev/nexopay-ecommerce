import React from 'react';
import { HiOutlineBanknotes } from 'react-icons/hi2';
import { formatPriceMXN } from '../../utils/format';

export const CheckoutPaymentSummary = ({ initialPayment }) => {
  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <HiOutlineBanknotes className="w-6 h-6" />
        <span className="font-medium">Pago de hoy</span>
      </div>
      <div className="text-4xl font-bold mb-2">
        {formatPriceMXN(initialPayment)}
      </div>
      <p className="text-primary-100 text-sm">
        Pago inicial para adquirir tus productos
      </p>
    </div>
  );
};
