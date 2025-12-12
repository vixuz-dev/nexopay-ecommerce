import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineUser, HiOutlineCreditCard, HiOutlineShoppingBag, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';

const UserAvatar = ({ isHomePage = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();

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

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
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

  const avatarBgColor = isHomePage ? 'bg-white/20 hover:bg-white/30' : 'bg-primary-100 hover:bg-primary-200';
  const avatarTextColor = isHomePage ? 'text-primary-600' : 'text-primary-700';

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
          <Link
          to="/mi-cuenta"
          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
        >
          <HiOutlineUser className="w-5 h-5" />
          <span>Mi cuenta</span>
        </Link>

        <Link
          to="/solicitud-credito"
          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
        >
          <HiOutlineCreditCard className="w-5 h-5" />
          <span>Solicitud de crédito</span>
        </Link>

        <Link
          to="/mis-compras"
          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
        >
          <HiOutlineShoppingBag className="w-5 h-5" />
          <span>Mis compras</span>
        </Link>

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

