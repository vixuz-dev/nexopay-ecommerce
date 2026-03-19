import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineEnvelope, HiOutlineArrowRight } from 'react-icons/hi2';
import { ROUTES } from '../../utils/routes';
import useUserStore from '../../stores/userStore';
import { useAuth } from '../../context/AuthContext';

const EmailVerificationBanner = () => {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const user = useUserStore((state) => state.user);
  const emailVerified = user?.emailVerified === true;

  const isVerificationPage =
    pathname === ROUTES.EMAIL_VERIFICATION ||
    pathname === ROUTES.EMAIL_VERIFICATION_ENTER_CODE;

  if (!isAuthenticated || !user || emailVerified || isVerificationPage) {
    return null;
  }

  return (
    <div className="sticky top-0 z-40 bg-amber-50 border-b border-amber-200 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          <div className="flex items-start gap-2 md:gap-3 flex-1">
            <HiOutlineEnvelope className="w-4 h-4 md:w-5 md:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm lg:text-base text-gray-800 leading-relaxed">
              <span className="font-semibold">Verifica tu correo electrónico</span> para poder realizar compras en la tienda
            </p>
          </div>
          <Link
            to={ROUTES.EMAIL_VERIFICATION}
            className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-colors duration-200 whitespace-nowrap flex-shrink-0 w-full md:w-auto"
          >
            Verificar correo
            <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
