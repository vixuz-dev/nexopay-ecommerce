import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineBars3, HiOutlineXMark, HiOutlineBell, HiOutlineShoppingCart, HiOutlineHeart } from 'react-icons/hi2';
import NavItem from './NavItem';
import SearchBar from './SearchBar';
import UserAvatar from './UserAvatar';
import nexoLogo from '../../assets/images/nexo-white-logo.webp';
import nexopayLogo from '../../assets/images/NexoPay-Logo.png';

const Navbar = ({ 
  searchPlaceholder = "Buscar productos, marcas y más...",
  onSearch,
  navItems = [],
  showSearch = true
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const defaultNavItems = [
    {
      label: 'Categorías',
      path: '/categorias',
      dropdown: [
        { label: 'Electrónica', path: '/categorias/electronica' },
        { label: 'Computadoras', path: '/categorias/computadoras' },
        { label: 'Audio', path: '/categorias/audio' },
        { label: 'Tablets', path: '/categorias/tablets' },
        { label: 'Televisores', path: '/categorias/televisores' },
        { label: 'Fotografía', path: '/categorias/fotografia' }
      ]
    },
    {
      label: 'Ofertas',
      path: '/ofertas'
    },
    {
      label: 'Mis compras',
      path: '/mis-compras'
    },
    {
      label: 'Para ti',
      path: '/para-ti'
    },
    {
      label: 'Los más buscados',
      path: '/mas-buscados'
    },
    {
      label: 'Favoritos',
      path: '/favoritos',
      icon: <HiOutlineHeart className="w-5 h-5" />
    }
  ];

  const items = navItems.length > 0 ? navItems : defaultNavItems;

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`relative ${isHomePage ? 'bg-primary-500' : 'bg-white shadow-md'} transition-all duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 py-4">
          <Link to="/" className="flex items-center flex-shrink-0 md:flex-shrink-0 mx-auto md:mx-0">
            <img 
              src={isHomePage ? nexoLogo : nexopayLogo}
              alt="NexoPay" 
              className={`${isHomePage ? 'h-16 md:h-12 lg:h-16' : 'h-14 md:h-10'} w-auto`}
            />
          </Link>

          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <SearchBar placeholder={searchPlaceholder} onSearch={onSearch} />
            </div>
          )}

          <div className="hidden md:flex items-center gap-4 ml-auto">
            <button
              className={`p-2 rounded-full transition-colors duration-200 ${
                isHomePage 
                  ? 'text-white hover:bg-white/20' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Notificaciones"
            >
              <HiOutlineBell className="w-6 h-6" />
            </button>

            <Link
              to="/carrito"
              className={`p-2 rounded-full transition-colors duration-200 relative ${
                isHomePage 
                  ? 'text-white hover:bg-white/20' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Carrito de compras"
            >
              <HiOutlineShoppingCart className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-highlight-500 rounded-full text-xs text-white flex items-center justify-center">
                0
              </span>
            </Link>

            <UserAvatar isHomePage={isHomePage} />
          </div>
        </div>

        {showSearch && (
          <div className="md:hidden pb-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <SearchBar placeholder={searchPlaceholder} onSearch={onSearch} />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg transition-colors duration-200 flex-shrink-0 ${
                  isHomePage 
                    ? 'text-white hover:bg-white/20' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <HiOutlineXMark className="w-7 h-7" />
                ) : (
                  <HiOutlineBars3 className="w-7 h-7" />
                )}
              </button>
            </div>
          </div>
        )}

        {!showSearch && (
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors duration-200 ml-auto ${
                isHomePage 
                  ? 'text-white hover:bg-white/20' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <HiOutlineXMark className="w-7 h-7" />
              ) : (
                <HiOutlineBars3 className="w-7 h-7" />
              )}
            </button>
          </div>
        )}

        <div className="hidden md:flex items-center gap-6 pb-4">
          {items.map((item, index) => (
            <NavItem 
              key={index} 
              item={item} 
              isHomePage={isHomePage}
            />
          ))}
        </div>
      </div>

      <div className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
        isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
        
        <div className={`absolute top-0 right-0 h-full w-80 bg-white transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <img 
                  src={nexopayLogo} 
                  alt="NexoPay Logo" 
                  className="h-10 w-auto"
                />
                <button
                  onClick={closeMobileMenu}
                  className="text-gray-700 hover:text-primary-600 transition duration-200 p-2"
                >
                  <HiOutlineXMark className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex items-center justify-around p-4 border-b border-gray-200">
                <button className="p-2 text-gray-700 hover:text-primary-600 transition-colors">
                  <HiOutlineBell className="w-6 h-6" />
                </button>
                <Link
                  to="/carrito"
                  className="p-2 text-gray-700 hover:text-primary-600 transition-colors relative"
                  onClick={closeMobileMenu}
                >
                  <HiOutlineShoppingCart className="w-6 h-6" />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-highlight-500 rounded-full text-xs text-white flex items-center justify-center">
                    0
                  </span>
                </Link>
                <div onClick={closeMobileMenu}>
                  <UserAvatar isHomePage={false} />
                </div>
              </div>
              
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                {items.map((item, index) => (
                  <NavItem 
                    key={index} 
                    item={item} 
                    isHomePage={false}
                    onClose={closeMobileMenu}
                  />
                ))}
              </nav>
            </div>
          </div>
        </div>
    </nav>
  );
};

export default Navbar;

