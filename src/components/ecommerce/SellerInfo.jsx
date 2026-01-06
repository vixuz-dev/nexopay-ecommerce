import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlineChatBubbleOvalLeft, 
  HiOutlineClock,
  HiOutlineShoppingBag
} from 'react-icons/hi2';

const SellerInfo = ({ 
  sellerId,
  productCount = 0,
  sales = 0,
  onViewMoreProducts
}) => {
  const formatNumber = (num) => {
    if (num >= 1000) {
      return `+${(num / 1000).toFixed(1)}k`;
    }
    return `+${num}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <p className="text-sm text-gray-700 mb-1">
          Vendido por <span className="font-semibold text-gray-900">{sellerId || 'NexoPay'}</span>
        </p>
        <p className="text-xs text-gray-600">
          {productCount > 0 ? `+${productCount} Productos` : 'Vendedor oficial'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <HiOutlineShoppingBag className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {formatNumber(sales)}
          </p>
          <p className="text-xs text-gray-600">Ventas</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <HiOutlineChatBubbleOvalLeft className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex items-center justify-center mb-1">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-xs text-gray-600">Buena atención</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <HiOutlineClock className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex items-center justify-center mb-1">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-xs text-gray-600">Entrega a tiempo</p>
        </div>
      </div>

      {onViewMoreProducts && (
        <button
          onClick={onViewMoreProducts}
          className="w-full py-3 px-4 bg-secondary-50 hover:bg-secondary-100 text-primary-600 font-semibold rounded-lg transition-colors duration-200"
        >
          Ver más productos del vendedor
        </button>
      )}
    </div>
  );
};

export default SellerInfo;

