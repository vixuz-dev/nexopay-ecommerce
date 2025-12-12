import React from 'react';
import { motion } from 'framer-motion';
import { RegistroForm } from '../components/forms/RegistroForm';
import { Link, useNavigate } from 'react-router-dom';

const Registro = () => {
  const navigate = useNavigate();

  const handleRegistroSuccess = (data) => {
    // Redirigir al login después del registro exitoso
    console.log('Registro exitoso:', data);
    // Redirigir al login para que el usuario inicie sesión
    navigate('/iniciar-sesion');
  };

  const handleBack = () => {
    // Regresar a la página anterior
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
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
              to="/iniciar-sesion" 
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
