import React from 'react';
import { motion } from 'framer-motion';
import { SEO } from '../components/common/SEO';
import { LoginForm } from '../components/forms/LoginForm';
import { Link } from 'react-router-dom';

const Login = () => {
  const handleLoginSuccess = (data) => {
    // Redirigir a dashboard o página principal
    console.log('Login exitoso:', data);
    // Aquí podrías redirigir a un dashboard o página principal
    window.location.href = '/';
  };

  const handleBack = () => {
    // Regresar a la página anterior
    window.history.back();
  };

  const keywords = [
    'login NexoPay',
    'iniciar sesión crédito digital',
    'acceso cuenta NexoPay',
    'login fintech México',
    'sesión plataforma crédito',
    'acceso usuario NexoPay',
    'login pago a plazos'
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Login NexoPay",
    "url": "https://www.nexopay.com/login",
    "description": "Inicia sesión en tu cuenta NexoPay y accede a tu línea de crédito digital. Login seguro con teléfono y contraseña.",
    "mainEntity": {
      "@type": "FinancialService",
      "name": "NexoPay - Login",
      "description": "Inicio de sesión para usuarios de crédito digital"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <SEO
        title="Login NexoPay - Inicia sesión"
        description="Inicia sesión en tu cuenta NexoPay y accede a tu línea de crédito digital. Login seguro con teléfono y contraseña."
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
            Inicia sesión en NexoPay
          </h1>
          <p className="text-gray-600">
            Accede a tu línea de crédito digital
          </p>
        </div>

        {/* Form */}
        <LoginForm 
          onLoginSuccess={handleLoginSuccess}
          onBack={handleBack}
        />

        {/* Register Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link 
              to="/registro" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
