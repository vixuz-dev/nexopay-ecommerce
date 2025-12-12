import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const { id, name, icon: Icon, path, color = 'primary' } = category;

  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600 hover:bg-primary-100',
    highlight: 'bg-highlight-50 text-highlight-600 hover:bg-highlight-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
    orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
    pink: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
    teal: 'bg-teal-50 text-teal-600 hover:bg-teal-100',
    indigo: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
    red: 'bg-red-50 text-red-600 hover:bg-red-100'
  };

  return (
    <Link
      to={path || `/categorias/${id}`}
      className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 group h-full"
    >
      <div className={`w-16 h-16 rounded-full ${colorClasses[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {Icon && <Icon className="w-8 h-8" />}
      </div>
      <h3 className="text-sm font-semibold text-gray-900 text-center group-hover:text-primary-600 transition-colors duration-200">
        {name}
      </h3>
    </Link>
  );
};

export default CategoryCard;

