import React from 'react';
import { Link } from 'react-router-dom';
import ProductPlaceholder from '../common/ProductPlaceholder';

const ProductCardHorizontal = ({ product }) => {
  const {
    id,
    name,
    price,
    originalPrice,
    image,
    discount,
    category,
    inStock = true
  } = product;

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Link 
      to={`/producto?id=${id}${category ? `&category=${encodeURIComponent(category)}` : ''}`}
      className="group bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden flex h-full"
    >
      <div className="relative w-32 sm:w-40 flex-shrink-0 bg-gray-100">
        {image && !image.includes('via.placeholder.com') ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <ProductPlaceholder name={name} className="w-full h-full" />
        )}
        
        {discount && (
          <div className="absolute top-2 left-2 bg-highlight-500 text-white px-2 py-1 rounded text-xs font-semibold">
            -{discount}%
          </div>
        )}

        {!inStock && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="bg-white px-2 py-1 rounded text-xs font-semibold text-gray-900">
              Agotado
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {name}
          </h3>
          
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCardHorizontal;

