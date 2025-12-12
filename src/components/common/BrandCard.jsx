import React from 'react';
import { Link } from 'react-router-dom';

const BrandCard = ({ brand }) => {
  const { name, logo, path } = brand;

  const content = (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border-2 border-gray-100 hover:border-primary-400 hover:shadow-xl transition-all duration-300 group h-full min-h-[140px]">
      {logo ? (
        <img
          src={logo}
          alt={name || 'Marca'}
          className="max-h-16 max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
        />
      ) : (
        <div className="text-center w-full">
          <div className="text-4xl font-bold text-gray-300 group-hover:text-primary-500 mb-2 transition-colors duration-300">
            {name ? name.charAt(0).toUpperCase() : '?'}
          </div>
          {name && (
            <div className="text-sm font-medium text-gray-600 group-hover:text-primary-600 transition-colors duration-300">
              {name}
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (path) {
    return (
      <Link to={path} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
};

export default BrandCard;

