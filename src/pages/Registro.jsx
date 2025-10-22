import React from 'react';
import { motion } from 'framer-motion';
import { SEO } from '../components/common/SEO';
import { RegistroForm } from '../components/forms/RegistroForm';
import { Link } from 'react-router-dom';

const Registro = () => {

  const handleRegistroSuccess = (data) => {
    // Redirigir a la página de solicitar crédito o dashboard
    console.log('Registro exitoso:', data);
    // Aquí podrías redirigir a /solicitar-credito o a un dashboard
    window.location.href = '/solicitar-credito';
  };

  const handleBack = () => {
    // Regresar a la página anterior
    window.history.back();
  };

  const keywords = [
    'registro NexoPay',
    'crear cuenta crédito digital',
    'registro fintech México',
    'cuenta NexoPay',
    'registro crédito sin buró',
    'crear cuenta pago a plazos',
    'registro plataforma crédito digital'
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Registro NexoPay",
    "url": "https://www.nexopay.com/registro",
    "description": "Crea tu cuenta NexoPay y accede a tu línea de crédito digital. Registro rápido y seguro con solo tu teléfono y contraseña.",
    "mainEntity": {
      "@type": "FinancialService",
      "name": "NexoPay - Registro",
      "description": "Registro para obtener crédito digital"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <SEO
        title="Registro NexoPay - Crea tu cuenta"
        description="Crea tu cuenta NexoPay y accede a tu línea de crédito digital. Registro rápido y seguro con solo tu teléfono y contraseña."
        keywords={keywords}
        schema={schema}
      />
      
      <div className="w-full max-w-lg mx-auto px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/src/assets/images/NexoPay-Logo.png" 
            alt="NexoPay Logo" 
            className="h-12 mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Crea tu cuenta NexoPay
          </h1>
          <p className="text-gray-600">
            Solo necesitas tu teléfono y una contraseña segura
          </p>
        </div>

        {/* Form */}
        <RegistroForm 
          onRegistroSuccess={handleRegistroSuccess}
          onBack={handleBack}
        />

        {/* Login Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link 
              to="/login" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registro;
