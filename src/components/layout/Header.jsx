import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineBars3, HiOutlineXMark } from 'react-icons/hi2';
import nexoLogo from '../../assets/images/nexo-white-logo.webp';
import nexopayLogo from '../../assets/images/NexoPay-Logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Función para determinar si un enlace está activo
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Función para obtener las clases de un enlace
  const getLinkClasses = (path) => {
    const baseClasses = "font-medium transition duration-200";
    const activeClasses = "text-highlight-500";
    const inactiveClasses = "text-white hover:text-highlight-500";
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  // Función para obtener las clases de un enlace móvil
  const getMobileLinkClasses = (path) => {
    const baseClasses = "block font-medium transition duration-200 py-3 text-lg";
    const activeClasses = "text-highlight-500";
    const inactiveClasses = "text-primary-900 hover:text-primary-600";
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={nexoLogo} 
              alt="NexoPay - Crédito digital y pago a plazos en México" 
              className="h-16 lg:h-24 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <Link to="/" className={getLinkClasses("/")}>
              Inicio
            </Link>
            <Link to="/sobre-nosotros" className={getLinkClasses("/sobre-nosotros")}>
              Nosotros
            </Link>
            <Link to="/proveedores" className={getLinkClasses("/proveedores")}>
              Proveedores
            </Link>
            <Link to="/contacto" className={getLinkClasses("/contacto")}>
              Contáctanos
            </Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-white hover:text-highlight-500 font-medium transition duration-200"
            >
              Iniciar sesión
            </Link>
            <Link 
              to="/solicitar-credito" 
              className="bg-highlight-500 hover:bg-highlight-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 shadow-glow-highlight"
            >
              Solicita tu crédito
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-white hover:text-highlight-500 transition duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <HiOutlineXMark className="w-6 h-6" />
            ) : (
              <HiOutlineBars3 className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMenuOpen(false)}
            ></div>
            
            {/* Menu Panel */}
            <div className={`absolute top-0 left-0 h-full w-full bg-white transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-neutral-200">
                  <img 
                    src={nexopayLogo} 
                    alt="NexoPay Logo" 
                    className="h-12 w-auto"
                  />
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-primary-600 hover:text-primary-700 transition duration-200"
                  >
                    <HiOutlineXMark className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 px-6 py-8 space-y-6">
                  <Link 
                    to="/" 
                    className={getMobileLinkClasses("/")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inicio
                  </Link>
                  <Link 
                    to="/sobre-nosotros" 
                    className={getMobileLinkClasses("/sobre-nosotros")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Nosotros
                  </Link>
                  <Link 
                    to="/proveedores" 
                    className={getMobileLinkClasses("/proveedores")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Proveedores
                  </Link>
                  <Link 
                    to="/contacto" 
                    className={getMobileLinkClasses("/contacto")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contáctanos
                  </Link>
                </nav>
                
                {/* CTA Buttons */}
                <div className="p-6 border-t border-neutral-200 space-y-3">
                  <Link 
                    to="/login" 
                    className="block bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-semibold py-4 px-6 rounded-lg transition duration-200 text-center text-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                  <Link 
                    to="/solicitar-credito" 
                    className="block bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 text-center text-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Solicita tu crédito
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export { Header };
