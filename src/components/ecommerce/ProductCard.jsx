import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineShoppingCart, HiOutlineHeart } from 'react-icons/hi2';
import ProductPlaceholder from '../common/ProductPlaceholder';
import useCartStore from '../../stores/cartStore';
import useUIStore from '../../stores/uiStore';
import { ROUTES, getProductDetailUrl } from '../../utils/routes';
import { CHECKOUT_CONFIG } from '../../constants/checkoutConfig';

const ProductCard = ({ product, showAddToCart = false }) => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const openCartSidebar = useUIStore((state) => state.openCartSidebar);
  
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

  const productDetailUrl = getProductDetailUrl(name, product.categoryId, product.subcategoryId);

  const handleCardClick = () => {
    navigate(productDetailUrl);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inStock) {
      addItem(product, 1, null, {
        productVariantId: product.productVariantId,
        attributes: product.attributes || [],
      });
      openCartSidebar();
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const getMonthlyFromApi = (p) => {
    const amountToDefer = p.remainingBalance ?? p.price;
    return amountToDefer / CHECKOUT_CONFIG.PRODUCT_CARD_MONTHLY_INSTALLMENTS;
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className="group bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
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
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
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
      <div className="p-4 flex flex-col flex-1 min-h-0">
        {/* Category */}
        {category && (
          <p className="text-xs text-primary-600 font-medium mb-1.5 uppercase tracking-wide">
            {category}
          </p>
        )}

        {/* Product Name */}
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors min-h-[2.5rem] mb-2">
          {name}
        </h3>

        {/* Rating */}
        {false && rating && (
          <div className="flex items-center gap-1 mb-3">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600">{rating}</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          
          {/* Monthly Payment */}
          <p className="text-xs text-primary-600 font-medium">
            {product.monthlyPaymentOption || `Desde ${formatPrice(getMonthlyFromApi(product))} mensual`}
          </p>
        </div>

        {/* Add to Cart Button */}
        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-3 ${
              inStock
                ? 'bg-primary-500 hover:bg-primary-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <HiOutlineShoppingCart className="w-4 h-4" />
            {inStock ? 'Agregar al carrito' : 'No disponible'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

