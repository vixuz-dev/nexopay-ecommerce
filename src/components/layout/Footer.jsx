import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineMapPin, HiOutlineShieldCheck } from 'react-icons/hi2';
import { ROUTES } from '../../utils/routes';
import nexopayLogo from '../../assets/images/NexoPay-Logo.png';

const TERMS_URL = 'https://nexopay.mx/terminos-condiciones';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800">
      <div className="flex justify-center">
        <div className="w-4/5 border-t border-gray-200"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img 
                src={nexopayLogo} 
                alt="NexoPay Logo" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
              La plataforma de crédito digital que te permite comprar lo que necesitas y pagarlo a tu ritmo. Sin buró, sin complicaciones.
            </p>
            <div className="flex items-center gap-2 text-gray-500">
              <HiOutlineShieldCheck className="w-5 h-5" />
              <span className="text-sm">Seguridad bancaria garantizada</span>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-800">Navegación</h4>
            <ul className="space-y-3">
              <li><Link to={ROUTES.HOME} className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Inicio</Link></li>
              <li><Link to={ROUTES.PRODUCTS} className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Productos</Link></li>
              <li><Link to={ROUTES.CART} className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Ver carrito</Link></li>
              <li><Link to={ROUTES.MY_ACCOUNT} className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Mi cuenta</Link></li>
              <li><Link to={ROUTES.MY_ORDERS} className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Mis pedidos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-800">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <HiOutlineEnvelope className="w-5 h-5 text-primary-600" />
                <span className="text-gray-600">contacto@nexopay.mx</span>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlinePhone className="w-5 h-5 text-primary-600" />
                <span className="text-gray-600">351 145 7093</span>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlineMapPin className="w-5 h-5 text-primary-600" />
                <span className="text-gray-600">Zamora, Michoacán, México</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-3 text-gray-800">Legal</h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href={TERMS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                  >
                    Términos y condiciones
                  </a>
                </li>
                <li><span className="text-gray-400 text-sm">Aviso de privacidad</span></li>
                <li><span className="text-gray-400 text-sm">Política de cookies</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Nexo Technologies. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
