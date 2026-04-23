import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mutate } from 'swr';
import { HiOutlineUser, HiOutlineCreditCard, HiOutlineShoppingBag, HiOutlineArrowRightOnRectangle, HiOutlineIdentification, HiOutlineDocumentText } from 'react-icons/hi2';
import { ROUTES } from '../../utils/routes';
import { removeCookie } from '../../utils/cookieUtils';
import useUserStore from '../../stores/userStore';
import { useCreditFormStore } from '../../stores/creditFormStore';
import useCreditLineStatusStore from '../../stores/creditLineStatusStore';
import useCreditStore from '../../stores/creditStore';
import { isApprovedCreditLineStatus } from '../../utils/emailVerification';
import {
  isRejectedCreditRequestStatus,
  isNoCreditRequestYetFromUser,
} from '../../utils/creditLinePurchaseAccess';

const UserAvatar = ({ isHomePage = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const resetCreditForm = useCreditFormStore((state) => state.resetForm);
  const showButton = useCreditLineStatusStore((state) => state.showButton);
  const requestStatus = useCreditLineStatusStore((state) => state.requestStatus);
  const isStatusLoaded = useCreditLineStatusStore((state) => state.isStatusLoaded);
  const fetchCreditLineStatus = useCreditLineStatusStore((state) => state.fetchCreditLineStatus);

  useEffect(() => {
    if (user) {
      void fetchCreditLineStatus();
    }
  }, [user, fetchCreditLineStatus]);

  const hasApprovedCreditRequest =
    isStatusLoaded && isApprovedCreditLineStatus(showButton, requestStatus);

  const hideMyAccountInMenu =
    isRejectedCreditRequestStatus(user?.creditRequest) || isNoCreditRequestYetFromUser(user);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    removeCookie('authToken');
    clearUser();
    resetCreditForm();
    useCreditStore.getState().resetStatus();
    useCreditStore.getState().clearCreditData();
    
    mutate(
      (key) => typeof key === 'string',
      undefined,
      { revalidate: false }
    );
    
    setIsOpen(false);
    navigate(ROUTES.LOGIN);
  };

  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const avatarBgColor = isHomePage ? 'bg-white hover:bg-gray-50' : 'bg-primary-500 hover:bg-primary-600';
  const avatarTextColor = isHomePage ? 'text-primary-700' : 'text-white';

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`flex items-center justify-center w-10 h-10 rounded-full ${avatarBgColor} ${avatarTextColor} font-semibold transition-colors duration-200`}
        aria-label="Menú de usuario"
        aria-expanded={isOpen}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name || 'Usuario'}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-sm">{getInitials()}</span>
        )}
      </button>

      <div 
        className={`absolute top-full right-0 pt-2 w-56 z-50 transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'opacity-100 visible translate-y-0 pointer-events-auto' 
            : 'opacity-0 invisible -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 py-2">
          {!hideMyAccountInMenu && (
            <Link
              to={ROUTES.MY_ACCOUNT}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
            >
              <HiOutlineUser className="w-5 h-5" />
              <span>Mi cuenta</span>
            </Link>
          )}

        <Link
            to={ROUTES.MY_PROFILE}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
          >
            <HiOutlineIdentification className="w-5 h-5" />
            <span>Mi perfil</span>
          </Link>

          <Link
            to={ROUTES.MY_CREDIT}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
          >
            <HiOutlineCreditCard className="w-5 h-5" />
            <span>Mis solicitudes</span>
          </Link>

        {hasApprovedCreditRequest && (
          <>
            <Link
              to={ROUTES.MY_ORDERS}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
            >
              <HiOutlineShoppingBag className="w-5 h-5" />
              <span>Mis pedidos</span>
            </Link>

            <Link
              to={ROUTES.MY_INVOICES}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
            >
              <HiOutlineDocumentText className="w-5 h-5" />
              <span>Mis facturas</span>
            </Link>
          </>
        )}

          <div className="border-t border-gray-200 my-2" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 text-left"
          >
            <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAvatar;

