import React from 'react';
import { HiOutlineCreditCard } from 'react-icons/hi2';
import { formatPrice, calculateCreditUsage } from '../../utils/creditUtils';

const CreditCard = ({ creditInfo }) => {
  if (!creditInfo) return null;

  const usagePercentage = calculateCreditUsage(creditInfo.creditUsed, creditInfo.creditLimit);

  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl shadow-xl p-6 md:p-8 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-primary-100 text-sm mb-1">Línea de Crédito NexoPay</p>
          <h2 className="text-2xl md:text-3xl font-bold">Crédito Disponible</h2>
        </div>
        <div className="p-3 bg-white/20 rounded-xl">
          <HiOutlineCreditCard className="w-8 h-8" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-primary-100 text-xs mb-1">Límite de Crédito</p>
          <p className="text-2xl font-bold">{formatPrice(creditInfo.creditLimit)}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-primary-100 text-xs mb-1">Saldo Actual</p>
          <p className="text-2xl font-bold">{formatPrice(creditInfo.currentBalance)}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-primary-100 text-xs mb-1">Disponible</p>
          <p className="text-2xl font-bold text-green-300">{formatPrice(creditInfo.creditAvailable)}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-primary-100">Uso de crédito</span>
          <span className="font-semibold">{usagePercentage}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div
            className="bg-white h-3 rounded-full transition-all duration-300"
            style={{ width: `${usagePercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;

