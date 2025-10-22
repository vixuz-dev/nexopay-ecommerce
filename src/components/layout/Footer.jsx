import React from 'react';
import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineMapPin, HiOutlineShieldCheck } from 'react-icons/hi2';
import nexopayLogo from '../../assets/images/NexoPay-Logo.png';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800">
      {/* Top Border - 80% width */}
      <div className="flex justify-center">
        <div className="w-4/5 border-t border-gray-200"></div>
      </div>
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
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

          {/* Usuarios */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-800">Para Usuarios</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Solicitar crédito</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Cómo funciona</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Beneficios</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Comercios afiliados</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">App móvil</a></li>
            </ul>
          </div>

          {/* Proveedores */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-800">Para Proveedores</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Únete como proveedor</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Beneficios B2B</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Integración API</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Dashboard</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Soporte técnico</a></li>
            </ul>
          </div>

          {/* Contacto y Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-800">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <HiOutlineEnvelope className="w-5 h-5 text-primary-600" />
                <span className="text-gray-600">hola@nexopay.com</span>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlinePhone className="w-5 h-5 text-primary-600" />
                <span className="text-gray-600">+52 55 1234 5678</span>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlineMapPin className="w-5 h-5 text-primary-600" />
                <span className="text-gray-600">Ciudad de México, México</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-3 text-gray-800">Legal</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm">Términos y condiciones</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm">Aviso de privacidad</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm">Política de cookies</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              © 2025 NexoPay. Todos los derechos reservados.
            </div>
            <div className="flex items-center gap-6">
              {/* <span className="text-primary-200 text-sm">Regulada por CNBV</span> */}
              {/* <div className="w-1 h-1 bg-primary-300 rounded-full"></div>
              <span className="text-primary-200 text-sm">Seguridad SSL</span> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
