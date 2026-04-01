import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/routes';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-8">Página no encontrada</h2>
        <p className="text-gray-600 mb-8">
          La página que buscas no existe.
        </p>
        <Link
          to={ROUTES.HOME}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
