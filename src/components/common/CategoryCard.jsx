import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const categoryName = category.name || category.label || category.category_name || category.title || 'Sin nombre';
  const categoryId = category.id || category.category_id || category.categoryId;
  const categoryPath = category.path || `/categorias/${categoryId || categoryName}`;

  return (
    <Link
      to={categoryPath}
      className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-200 bg-white hover:border-primary-300 hover:shadow-md transition-all duration-200 group h-full min-h-[120px]"
    >
      <h3 className="text-sm font-semibold text-gray-900 text-center group-hover:text-primary-600 transition-colors duration-200">
        {categoryName}
      </h3>
    </Link>
  );
};

export default CategoryCard;

