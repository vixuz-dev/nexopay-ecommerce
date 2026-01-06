import React from 'react';
import { formatShortDate, getDaysUntil } from '../../utils/creditUtils';

const CreditInfoCard = ({ icon: Icon, iconBg, iconColor, label, value, subtitle }) => {
  const isDate = value instanceof Date;
  const daysUntil = isDate ? getDaysUntil(value) : null;
  const displayValue = isDate ? formatShortDate(value) : value;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 ${iconBg} rounded-lg`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-xs text-gray-600">{label}</p>
          <p className="text-lg font-bold text-gray-900">{displayValue}</p>
        </div>
      </div>
      {subtitle && (
        <p className="text-xs text-gray-500">{subtitle}</p>
      )}
      {daysUntil !== null && (
        <p className="text-xs text-gray-500 mt-1">
          {daysUntil > 0 
            ? `Faltan ${daysUntil} días`
            : daysUntil === 0
            ? 'Vence hoy'
            : 'Fecha pasada'}
        </p>
      )}
    </div>
  );
};

export default CreditInfoCard;

