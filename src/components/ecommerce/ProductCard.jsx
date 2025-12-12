import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineShoppingCart, HiOutlineHeart } from 'react-icons/hi2';
import ProductPlaceholder from '../common/ProductPlaceholder';

const ProductCard = ({ product, showAddToCart = false }) => {
  const {
    id,
    name,
    price,
    originalPrice,
    image,
    discount,
    category,
    rating,
    inStock = true
  } = product;

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const calculateMonthlyPayment = (totalPrice) => {
    // Ejemplo: dividir en 4 quincenas
    return totalPrice / 4;
  };

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
        {image && !image.includes('via.placeholder.com') ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <ProductPlaceholder name={name} className="w-full h-full" />
        )}
        
        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-3 left-3 bg-highlight-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            -{discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100"
          aria-label="Agregar a favoritos"
        >
          <HiOutlineHeart className="w-5 h-5 text-gray-700" />
        </button>

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white px-4 py-2 rounded-lg font-semibold text-gray-900">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          {/* Category */}
          {category && (
            <p className="text-xs text-primary-600 font-medium mb-2 uppercase tracking-wide">
              {category}
            </p>
          )}

          {/* Product Name */}
          <Link to={`/producto/${id}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
              {name}
            </h3>
          </Link>

          {/* Rating */}
          {false && rating && (
            <div className="flex items-center gap-1 mb-3">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600">{rating}</span>
            </div>
          )}

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(price)}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            
            {/* Monthly Payment */}
            <p className="text-sm text-primary-600 font-medium mt-1">
              Desde {formatPrice(calculateMonthlyPayment(price))} quincenal
            </p>
          </div>
        </div>

        {/* Add to Cart Button */}
        {showAddToCart && (
          <button
            disabled={!inStock}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 mt-auto ${
              inStock
                ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <HiOutlineShoppingCart className="w-5 h-5" />
            {inStock ? 'Agregar al carrito' : 'No disponible'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

