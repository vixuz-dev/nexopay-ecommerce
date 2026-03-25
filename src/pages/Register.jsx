import React from 'react';
import { motion } from 'framer-motion';
import { RegisterForm } from '../components/forms/RegisterForm';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/routes';
import nexopayLogo from '../assets/images/NexoPay-Logo.png';

const Register = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = (data) => {
    console.log('Registro exitoso:', data);
    navigate(ROUTES.LOGIN);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="w-full max-w-lg mx-auto px-6">
        <div className="text-center mb-8">
          <img
            src={nexopayLogo}
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

        <RegisterForm
          onRegisterSuccess={handleRegisterSuccess}
          onBack={handleBack}
        />

        <div className="text-center mt-8">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link
              to={ROUTES.LOGIN}
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

export default Register;
