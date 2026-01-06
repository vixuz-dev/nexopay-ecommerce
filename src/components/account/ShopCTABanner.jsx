import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineShoppingBag } from 'react-icons/hi2';
import { ROUTES } from '../../utils/routes';

const ShopCTABanner = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200 p-4 md:p-5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <HiOutlineShoppingBag className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900">¿Buscas algo más?</h3>
            <p className="text-xs md:text-sm text-gray-600">Explora nuestros productos y encuentra lo que necesitas</p>
          </div>
        </div>
        <button
          onClick={() => navigate(ROUTES.PRODUCTS)}
          className="w-full sm:w-auto px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
        >
          Explorar productos
          <HiOutlineArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ShopCTABanner;

