import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineChevronRight } from 'react-icons/hi2';
import { useCategories } from '../../hooks/useCategories';
import { useSubcategories } from '../../hooks/useSubcategories';
import { getProductsByCategoryUrl } from '../../utils/routes';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

const CategoriesMegaMenu = ({ isHomePage = false, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const menuRef = useRef(null);
  const submenuRef = useRef(null);

  const { categories, isLoading: categoriesLoading } = useCategories();
  const { subcategories, isLoading: subcategoriesLoading } = useSubcategories(
    activeCategoryId
  );

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

  const activeCategory = useMemo(
    () => categoriesDropdown.find((c) => c.id === activeCategoryId) ?? categoriesDropdown[0],
    [activeCategoryId, categoriesDropdown]
  );

  useEffect(() => {
    if (categoriesDropdown.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categoriesDropdown[0].id);
    }
  }, [categoriesDropdown, activeCategoryId]);

  useEffect(() => {
    if (isOpen && submenuRef.current && menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const submenu = submenuRef.current;
      
      if (menuRect) {
        submenu.style.position = 'fixed';
        submenu.style.left = `${menuRect.right}px`;
        submenu.style.right = 'auto';
        submenu.style.top = `${menuRect.top}px`;
        submenu.style.height = `${menuRect.height}px`;
        submenu.style.marginLeft = '0';
        submenu.style.marginTop = '0';
      }
    }
  }, [isOpen, activeCategoryId, subcategories]);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = (e) => {
    const relatedTarget = e.relatedTarget;
    if (
      !menuRef.current?.contains(relatedTarget) &&
      !submenuRef.current?.contains(relatedTarget)
    ) {
      setIsOpen(false);
      setActiveCategoryId(null);
    }
  };

  const handleCategoryHover = (categoryId) => {
    if (categoryId) {
      setActiveCategoryId(categoryId);
    }
  };

  const handleItemClick = () => {
    setIsOpen(false);
    setActiveCategoryId(null);
    if (onClose) onClose();
  };

  const hasSubcategories = subcategories && subcategories.length > 0;

  if (categoriesDropdown.length === 0) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 backdrop-blur-sm overflow-visible flex h-[75vh]">
        <div className="grid grid-cols-12 w-[920px] h-full">
          {/* 1) PRIMERO: Categorías */}
          <div className="col-span-3 border-r border-gray-200 p-2 flex flex-col h-full">
            <div className="px-4 pb-2 pt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Categorías
            </div>

            <ul className="p-2 flex-1 overflow-y-auto">
              {categoriesDropdown.map((category) => {
                const isActive = category.id === activeCategoryId;
                return (
                  <li key={category.id}>
                    <Link
                      to={category.path}
                      onMouseEnter={() => handleCategoryHover(category.id)}
                      onFocus={() => handleCategoryHover(category.id)}
                      onClick={handleItemClick}
                      className={cx(
                        'w-full text-left flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-600/20',
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-800 hover:bg-gray-100'
                      )}
                    >
                      <span>{category.label}</span>
                      <HiOutlineChevronRight className={cx(
                        'w-4 h-4 transition',
                        isActive ? 'text-white' : 'text-gray-400'
                      )} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 2) SEGUNDO: Subcategorías */}
          <div className="col-span-5 border-r border-gray-200 p-6 flex flex-col h-full overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Subcategorías
                </div>
                <div className="mt-1 text-base font-semibold text-gray-900">
                  {activeCategory?.label || 'Categoría'}
                </div>
              </div>
              {activeCategory && (
                <Link
                  to={activeCategory.path}
                  onClick={handleItemClick}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Ver todo →
                </Link>
              )}
            </div>

            {subcategoriesLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-600 mb-3"></div>
                <p className="text-sm text-gray-500">Cargando subcategorías...</p>
              </div>
            ) : hasSubcategories ? (
              <ul className="space-y-2">
                {subcategories.map((subcategory, index) => {
                  const subcategoryId = subcategory.id || subcategory.subcategory_id || subcategory.subcategoryId;
                  const subcategoryLabel = subcategory.name || subcategory.subcategory_name || subcategory.title || 'Sin nombre';
                  const subcategoryPath = subcategory.path || getProductsByCategoryUrl(activeCategoryId, subcategoryId);

                  return (
                    <li key={subcategoryId || index}>
                      <Link
                        to={subcategoryPath}
                        onClick={handleItemClick}
                        className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all"
                      >
                        <span>{subcategoryLabel}</span>
                        <HiOutlineChevronRight className="w-4 h-4 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                No hay subcategorías disponibles para esta categoría.
              </div>
            )}

          </div>

          {/* 3) TERCERO: Featured / Información destacada */}
          <div className="col-span-4 p-6 flex flex-col">
            <div className="rounded-2xl bg-gray-50 p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Destacado
              </div>
              <div className="mt-2 text-base font-semibold text-gray-900">
                {activeCategory?.label || 'Categoría destacada'}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Explora los productos más populares de esta categoría.
              </p>
              {activeCategory && (
                <Link
                  to={activeCategory.path}
                  onClick={handleItemClick}
                  className="mt-4 inline-flex items-center rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
                >
                  Explorar →
                </Link>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Selección actual
              </div>
              <div className="mt-2 text-sm font-medium text-gray-900">
                {activeCategory?.label || 'Selecciona una categoría'}
              </div>
              {activeCategory && (
                <Link
                  to={activeCategory.path}
                  onClick={handleItemClick}
                  className="mt-3 inline-flex text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Ver todo →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesMegaMenu;
