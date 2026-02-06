import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineChevronDown, HiOutlineChevronRight } from 'react-icons/hi2';
import { useCategories } from '../../hooks/useCategories';
import { useSubcategories } from '../../hooks/useSubcategories';
import { getProductsByCategoryUrl } from '../../utils/routes';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

const CategoriesMobileMenu = ({ onClose }) => {
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const { categories } = useCategories();

  const categoriesDropdown = useMemo(() => {
    if (!categories) {
      return [];
    }

    const categoriesArray = Array.isArray(categories) ? categories : [];

    if (categoriesArray.length === 0) {
      return [];
    }

    return categoriesArray.map((category) => {
      const label = category.name || category.category_name || category.title || category.categoryName || 'Sin nombre';
      const categoryId = category.id || category.category_id || category.categoryId;
      
      return {
        id: categoryId,
        label,
        path: getProductsByCategoryUrl(categoryId),
      };
    });
  }, [categories]);

  const handleCategoryToggle = (categoryId) => {
    setExpandedCategoryId(expandedCategoryId === categoryId ? null : categoryId);
  };

  if (categoriesDropdown.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
        Categorías
      </div>
      <div className="space-y-1">
        {categoriesDropdown.map((category) => {
          const isExpanded = expandedCategoryId === category.id;
          return (
            <CategoryAccordion
              key={category.id}
              category={category}
              isExpanded={isExpanded}
              onToggle={() => handleCategoryToggle(category.id)}
              onClose={onClose}
            />
          );
        })}
      </div>
    </div>
  );
};

const CategoryAccordion = ({ category, isExpanded, onToggle, onClose }) => {
  const { subcategories, isLoading: subcategoriesLoading } = useSubcategories(
    isExpanded ? category.id : null
  );

  const hasSubcategories = subcategories && subcategories.length > 0;

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
      >
        <span className="font-medium">{category.label}</span>
        {category.id && (
          <HiOutlineChevronDown
            className={cx(
              'w-5 h-5 text-gray-400 transition-transform duration-200',
              isExpanded ? 'rotate-180' : ''
            )}
          />
        )}
      </button>

      {isExpanded && (
        <div className="bg-gray-50 border-t border-gray-100">
          {subcategoriesLoading ? (
            <div className="px-4 py-6 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-200 border-t-primary-600 mb-2"></div>
              <p className="text-xs text-gray-500">Cargando...</p>
            </div>
          ) : hasSubcategories ? (
            <div className="py-2">
              <Link
                to={category.path}
                onClick={onClose}
                className="block px-6 py-2.5 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors"
              >
                Ver todos los productos →
              </Link>
              <div className="px-4 py-2 space-y-1">
                {subcategories.map((subcategory, index) => {
                  const subcategoryId = subcategory.id || subcategory.subcategory_id || subcategory.subcategoryId;
                  const subcategoryLabel = subcategory.name || subcategory.subcategory_name || subcategory.title || 'Sin nombre';
                  const categoryId = expandedCategoryId || 0;
                  const subcategoryPath = subcategory.path || getProductsByCategoryUrl(categoryId, subcategoryId);

                  return (
                    <Link
                      key={subcategoryId || index}
                      to={subcategoryPath}
                      onClick={onClose}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 hover:bg-white hover:text-primary-600 rounded-lg transition-colors"
                    >
                      <span>{subcategoryLabel}</span>
                      <HiOutlineChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="px-6 py-4 text-center">
              <p className="text-sm text-gray-500">No hay subcategorías disponibles</p>
              <Link
                to={category.path}
                onClick={onClose}
                className="mt-2 inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Ver productos →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesMobileMenu;

