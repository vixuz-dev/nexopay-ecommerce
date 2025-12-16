import React, { useState } from 'react';
import { HiOutlineXMark, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi2';

const SidebarFilter = ({
  categories = [],
  selectedCategories = [],
  onCategoryChange,
  minPrice,
  maxPrice,
  onPriceChange,
  showOnlyInStock = false,
  onInStockChange,
  showOnlyOnSale = false,
  onOnSaleChange,
  minRating,
  onRatingChange,
  minDiscount,
  maxDiscount,
  onDiscountChange,
  showOnlyNew = false,
  onNewChange,
  onClearFilters,
  hasActiveFilters = false
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
    discount: true,
    availability: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="w-full space-y-6">
      {/* Categorías */}
      <div>
            <button
              onClick={() => toggleSection('categories')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="font-semibold text-gray-900">Categorías</h3>
              {expandedSections.categories ? (
                <HiOutlineChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <HiOutlineChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSections.categories && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={(e) => onCategoryChange(category, e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Precio */}
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={() => toggleSection('price')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="font-semibold text-gray-900">Precio</h3>
              {expandedSections.price ? (
                <HiOutlineChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <HiOutlineChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSections.price && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Mínimo</label>
                    <input
                      type="number"
                      value={minPrice || ''}
                      onChange={(e) => onPriceChange('min', e.target.value ? parseInt(e.target.value) : '')}
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Máximo</label>
                    <input
                      type="number"
                      value={maxPrice || ''}
                      onChange={(e) => onPriceChange('max', e.target.value ? parseInt(e.target.value) : '')}
                      placeholder="Sin límite"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    />
                  </div>
                </div>
                {(minPrice || maxPrice) && (
                  <div className="text-xs text-gray-600">
                    Rango: {minPrice ? formatPrice(minPrice) : '$0'} - {maxPrice ? formatPrice(maxPrice) : 'Sin límite'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Calificación */}
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={() => toggleSection('rating')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="font-semibold text-gray-900">Calificación</h3>
              {expandedSections.rating ? (
                <HiOutlineChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <HiOutlineChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSections.rating && (
              <div className="space-y-3">
                {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === rating}
                      onChange={() => onRatingChange(rating)}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 cursor-pointer"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {rating}+
                      </span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-300'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </label>
                ))}
                {minRating && (
                  <button
                    onClick={() => onRatingChange(null)}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Descuento */}
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={() => toggleSection('discount')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="font-semibold text-gray-900">Descuento</h3>
              {expandedSections.discount ? (
                <HiOutlineChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <HiOutlineChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSections.discount && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Mínimo (%)</label>
                    <input
                      type="number"
                      value={minDiscount || ''}
                      onChange={(e) => onDiscountChange('min', e.target.value ? parseInt(e.target.value) : '')}
                      placeholder="0"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Máximo (%)</label>
                    <input
                      type="number"
                      value={maxDiscount || ''}
                      onChange={(e) => onDiscountChange('max', e.target.value ? parseInt(e.target.value) : '')}
                      placeholder="100"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    />
                  </div>
                </div>
                {(minDiscount || maxDiscount) && (
                  <div className="text-xs text-gray-600">
                    Rango: {minDiscount || 0}% - {maxDiscount || 100}%
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Disponibilidad y Ofertas */}
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={() => toggleSection('availability')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="font-semibold text-gray-900">Disponibilidad</h3>
              {expandedSections.availability ? (
                <HiOutlineChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <HiOutlineChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSections.availability && (
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={showOnlyInStock}
                    onChange={(e) => onInStockChange(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    Solo productos disponibles
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={showOnlyOnSale}
                    onChange={(e) => onOnSaleChange(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    Solo ofertas
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={showOnlyNew}
                    onChange={(e) => onNewChange(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    Solo productos nuevos
                  </span>
                </label>
              </div>
            )}
          </div>
    </div>
  );
};

export default SidebarFilter;

