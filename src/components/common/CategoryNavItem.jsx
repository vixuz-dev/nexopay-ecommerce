import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineChevronRight } from 'react-icons/hi2';
import { useSubcategories } from '../../hooks/useSubcategories';
import { getProductsByCategoryUrl } from '../../utils/routes';

const CategoryNavItem = ({ category, isHomePage = false, onClose }) => {
  const [isHovered, setIsHovered] = useState(false);
  const itemRef = useRef(null);
  const submenuRef = useRef(null);

  const categoryId = category.id || category.category_id || category.categoryId;
  const shouldLoadSubcategories = isHovered && categoryId;
  const { subcategories, isLoading: subcategoriesLoading } = useSubcategories(
    shouldLoadSubcategories ? categoryId : null
  );

  const categoryLabel = category.label || category.name || category.category_name || category.title || 'Sin nombre';
  const categoryPath = category.path || getProductsByCategoryUrl(categoryId || categoryLabel);

  const hasSubcategories = subcategories && subcategories.length > 0;

  useEffect(() => {
    if (isHovered && submenuRef.current && itemRef.current) {
      const categoryItem = itemRef.current.closest('[data-category-dropdown]');
      if (categoryItem) {
        const categoryRect = categoryItem.getBoundingClientRect();
        const submenu = submenuRef.current;
        const viewportWidth = window.innerWidth;
        
        if (categoryRect) {
          const spaceOnRight = viewportWidth - categoryRect.right;
          const spaceOnLeft = categoryRect.left;
          
          if (spaceOnRight < 320 && spaceOnLeft > 320) {
            submenu.style.position = 'fixed';
            submenu.style.left = 'auto';
            submenu.style.right = `${viewportWidth - categoryRect.left}px`;
            submenu.style.top = `${categoryRect.top}px`;
            submenu.style.height = `${categoryRect.height}px`;
            submenu.style.marginRight = '0';
            submenu.style.marginLeft = '0';
            submenu.style.marginTop = '0';
          } else {
            submenu.style.position = 'fixed';
            submenu.style.left = `${categoryRect.right + 8}px`;
            submenu.style.right = 'auto';
            submenu.style.top = `${categoryRect.top}px`;
            submenu.style.height = `${categoryRect.height}px`;
            submenu.style.marginLeft = '0';
            submenu.style.marginRight = '0';
            submenu.style.marginTop = '0';
          }
        }
      }
    }
  }, [isHovered, subcategories]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = (e) => {
    const relatedTarget = e.relatedTarget;
    if (
      !itemRef.current?.contains(relatedTarget) &&
      !submenuRef.current?.contains(relatedTarget)
    ) {
      setIsHovered(false);
    }
  };

  const handleItemClick = () => {
    setIsHovered(false);
    if (onClose) onClose();
  };

  return (
    <div
      ref={itemRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={categoryPath}
        onClick={handleItemClick}
        className={`flex items-center justify-between px-4 py-3 text-sm transition-all duration-200 group relative ${
          isHovered 
            ? 'bg-primary-600 text-white' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <span className="flex-1 truncate font-medium">{categoryLabel}</span>
        {categoryId && (
          <HiOutlineChevronRight className={`w-4 h-4 flex-shrink-0 ml-2 transition-colors duration-200 ${
            isHovered ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
          }`} />
        )}
      </Link>

      {isHovered && categoryId && (
        <div
          ref={submenuRef}
          className="fixed z-[60] hidden lg:block"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="bg-white h-full flex flex-col min-w-[600px] max-w-[800px]">
            {subcategoriesLoading ? (
              <div className="px-6 py-12 flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-600 mb-3"></div>
                <p className="text-sm text-gray-500">Cargando subcategorías...</p>
              </div>
            ) : hasSubcategories ? (
              <div className="flex-1 overflow-y-auto p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{categoryLabel}</h2>
                <div className="grid grid-cols-3 gap-6">
                  {subcategories.map((subcategory, index) => {
                    const subcategoryId = subcategory.id || subcategory.subcategory_id || subcategory.subcategoryId;
                    const subcategoryLabel = subcategory.name || subcategory.subcategory_name || subcategory.title || 'Sin nombre';
                    const subcategoryPath = subcategory.path || getProductsByCategoryUrl(subcategoryId || subcategoryLabel);

                    return (
                      <Link
                        key={subcategoryId || index}
                        to={subcategoryPath}
                        onClick={handleItemClick}
                        className="block py-2 text-sm text-gray-700 hover:text-primary-600 transition-colors duration-150"
                      >
                        {subcategoryLabel}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-sm text-gray-500">No hay subcategorías disponibles</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryNavItem;
