import React from 'react';
import { 
  HiOutlineChatBubbleOvalLeft, 
  HiOutlineClock,
  HiOutlineShoppingBag
} from 'react-icons/hi2';

const LEVEL_LABELS = {
  bronze: 'Bronce',
  silver: 'Plata',
  gold: 'Oro',
  platinum: 'Platino',
};

const LEVEL_COLORS = {
  bronze: 'bg-amber-100 text-amber-800',
  silver: 'bg-gray-200 text-gray-800',
  gold: 'bg-yellow-100 text-yellow-800',
  platinum: 'bg-primary-100 text-primary-800',
};

const SellerInfo = ({
  sellerId,
  productCount = 0,
  totalSales = 0,
  level,
  timeWithUsDays,
  goodService = false,
}) => {
  const formatNumber = (num) => {
    if (num >= 1000) {
      return `+${(num / 1000).toFixed(1)}k`;
    }
    return `+${num}`;
  };

  const levelLabel = level ? (LEVEL_LABELS[level] ?? level) : null;
  const levelColor = level ? (LEVEL_COLORS[level] ?? 'bg-gray-100 text-gray-800') : null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <p className="text-sm text-gray-700 mb-1">
          Vendido por <span className="font-semibold text-gray-900">{sellerId || 'NexoPay'}</span>
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {productCount > 0 && (
            <p className="text-xs text-gray-600">
              {productCount} {productCount === 1 ? 'Producto' : 'Productos'}
            </p>
          )}
          {levelLabel && (
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${levelColor}`}>
              {levelLabel}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <HiOutlineShoppingBag className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {formatNumber(totalSales)}
          </p>
          <p className="text-xs text-gray-600">Ventas</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <HiOutlineChatBubbleOvalLeft className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex items-center justify-center mb-1">
            {goodService ? (
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <span className="text-xs text-gray-400">—</span>
            )}
          </div>
          <p className="text-xs text-gray-600">Buena atención</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <HiOutlineClock className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {timeWithUsDays != null ? `${timeWithUsDays} días` : '—'}
          </p>
          <p className="text-xs text-gray-600">Con nosotros</p>
        </div>
      </div>
    </div>
  );
};

export default SellerInfo;

