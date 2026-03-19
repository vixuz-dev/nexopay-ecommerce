import React from 'react';
import { LoginForm } from '../components/forms/LoginForm';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/routes';
import useCategoriesStore from '../stores/categoriesStore';

const Login = () => {
  const navigate = useNavigate();
  const invalidateCategories = useCategoriesStore((s) => s.invalidateCategories);
  const fetchCategories = useCategoriesStore((s) => s.fetchCategories);

  const handleLoginSuccess = async () => {
    try {
      invalidateCategories();
      await fetchCategories();
    } catch (err) {
      console.error('Error al pre-cargar categorías:', err);
    }
    navigate(ROUTES.HOME);
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
              to={ROUTES.REGISTER} 
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
