import React, { useState, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineBars3, HiOutlineXMark, HiOutlineBell, HiOutlineShoppingCart, HiOutlineHeart, HiOutlineChevronDown } from 'react-icons/hi2';
import NavItem from './NavItem';
import CategoriesMegaMenu from './CategoriesMegaMenu';
import CategoriesMobileMenu from './CategoriesMobileMenu';
import SearchBar from './SearchBar';
import UserAvatar from './UserAvatar';
import useCartStore from '../../stores/cartStore';
import useUIStore from '../../stores/uiStore';
import { useCategories } from '../../hooks/useCategories';
import { ROUTES, getProductsByCategoryUrl } from '../../utils/routes';
import nexoLogo from '../../assets/images/nexo-white-logo.webp';
import nexopayLogo from '../../assets/images/NexoPay-Logo.png';

const Navbar = ({ 
  searchPlaceholder = "Buscar productos, marcas y más...",
  onSearch,
  navItems = [],
  showSearch = true
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const categoriesRef = useRef(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const totalItems = useCartStore((state) => state.getTotalItems());
  const openCartSidebar = useUIStore((state) => state.openCartSidebar);
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();

  const categoriesDropdown = useMemo(() => {
    if (!categories) {
      return [];
    }

    console.log('Categories from API:', categories);

    const categoriesArray = Array.isArray(categories) ? categories : [];

    if (categoriesArray.length === 0) {
      console.log('Categories array is empty or not an array');
      return [];
    }

    const mapped = categoriesArray.map((category) => {
      const label = category.name || category.category_name || category.title || category.categoryName || 'Sin nombre';
      const categoryId = category.id || category.category_id || category.categoryId;
      
      return {
        id: categoryId,
        label,
        path: getProductsByCategoryUrl(categoryId),
      };
    });

    return mapped;
  }, [categories]);

  const defaultNavItems = useMemo(() => [
    {
      label: 'Categorías',
      path: ROUTES.PRODUCTS,
      dropdown: categoriesDropdown.length > 0 
        ? categoriesDropdown 
        : (categoriesLoading 
          ? [] 
          : [
              { label: 'Electrónica', path: getProductsByCategoryUrl('Electrónica') },
              { label: 'Computadoras', path: getProductsByCategoryUrl('Computadoras') },
              { label: 'Audio', path: getProductsByCategoryUrl('Audio') },
              { label: 'Tablets', path: getProductsByCategoryUrl('Tablets') },
              { label: 'Televisores', path: getProductsByCategoryUrl('Televisores') },
              { label: 'Fotografía', path: getProductsByCategoryUrl('Fotografía') },
              { label: 'Smartwatches', path: getProductsByCategoryUrl('Smartwatches') },
              { label: 'Gaming', path: getProductsByCategoryUrl('Gaming') },
              { label: 'Monitores', path: getProductsByCategoryUrl('Monitores') },
              { label: 'Accesorios', path: getProductsByCategoryUrl('Accesorios') }
            ])
    },
    {
      label: 'Ofertas',
      path: ROUTES.OFFERS
    },
    {
      label: 'Mis compras',
      path: ROUTES.MY_ORDERS
    }
  ], [categoriesDropdown]);

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
              to={ROUTES.FAVORITES}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isHomePage 
                  ? 'text-white hover:bg-white/20' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Favoritos"
            >
              <HiOutlineHeart className="w-6 h-6" />
            </Link>

            <button
              onClick={openCartSidebar}
              className={`p-2 rounded-full transition-colors duration-200 relative ${
                isHomePage 
                  ? 'text-white hover:bg-white/20' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Carrito de compras"
            >
              <HiOutlineShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-highlight-500 rounded-full text-xs text-white flex items-center justify-center font-semibold">
                  {totalItems > 99 ? '99+' : totalItems}
              </span>
              )}
            </button>

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
          {items.map((item, index) => {
            if (item.label === 'Categorías' && categoriesDropdown.length > 0) {
              return (
                <div
                  key={index}
                  ref={categoriesRef}
                  className="relative"
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={(e) => {
                    const relatedTarget = e.relatedTarget;
                    if (!categoriesRef.current?.contains(relatedTarget)) {
                      setIsCategoriesOpen(false);
                    }
                  }}
                >
                  <button
                    className={`flex items-center gap-1 ${isHomePage ? 'text-white hover:text-highlight-400' : 'text-gray-700 hover:text-primary-600'} font-medium transition-colors duration-200 py-2`}
                    aria-expanded={isCategoriesOpen}
                    aria-haspopup="true"
                  >
                    <span>{item.label}</span>
                    <HiOutlineChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isCategoriesOpen && (
                    <div
                      className="absolute top-full left-0 z-50"
                      onMouseEnter={() => setIsCategoriesOpen(true)}
                      onMouseLeave={(e) => {
                        const relatedTarget = e.relatedTarget;
                        if (!categoriesRef.current?.contains(relatedTarget)) {
                          setIsCategoriesOpen(false);
                        }
                      }}
                    >
                      <CategoriesMegaMenu 
                        isHomePage={isHomePage}
                        onClose={() => setIsCategoriesOpen(false)}
                      />
                    </div>
                  )}
                </div>
              );
            }
            return (
              <NavItem 
                key={index} 
                item={item} 
                isHomePage={isHomePage}
              />
            );
          })}
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
                  to={ROUTES.FAVORITES}
                  onClick={closeMobileMenu}
                  className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <HiOutlineHeart className="w-6 h-6" />
                </Link>
                <button
                  onClick={() => {
                    openCartSidebar();
                    closeMobileMenu();
                  }}
                  className="p-2 text-gray-700 hover:text-primary-600 transition-colors relative"
                >
                  <HiOutlineShoppingCart className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-highlight-500 rounded-full text-xs text-white flex items-center justify-center font-semibold">
                      {totalItems > 99 ? '99+' : totalItems}
                  </span>
                  )}
                </button>
                <div onClick={closeMobileMenu}>
                  <UserAvatar isHomePage={false} />
                </div>
              </div>
              
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {items.map((item, index) => {
                  if (item.label === 'Categorías' && categoriesDropdown.length > 0) {
                    return (
                      <CategoriesMobileMenu 
                        key={index}
                        onClose={closeMobileMenu}
                      />
                    );
                  }
                  return (
                    <NavItem 
                      key={index} 
                      item={item} 
                      isHomePage={false}
                      onClose={closeMobileMenu}
                    />
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
    </nav>
  );
};

export default Navbar;

