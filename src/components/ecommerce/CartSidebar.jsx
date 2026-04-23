import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../stores/cartStore';
import { useCartApi } from '../../hooks/useCartApi';
import { useRemoveFromCart } from '../../hooks/useRemoveFromCart';
import { useUpdateCartQuantity } from '../../hooks/useUpdateCartQuantity';
import { useClearCart } from '../../hooks/useClearCart';
import useUserStore from '../../stores/userStore';
import { ROUTES, getProductDetailUrl } from '../../utils/routes';
import { CHECKOUT_CONFIG, getShippingCost } from '../../constants/checkoutConfig';
import { productsService } from '../../api/services/productsService';
import {
  HiOutlineXMark,
  HiOutlineShoppingCart,
  HiOutlineTrash,
  HiOutlineArrowRight,
} from 'react-icons/hi2';
import ProductPlaceholder from '../common/ProductPlaceholder';

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!useUserStore((s) => s.user);
  const { fetchCart, loading: cartLoading } = useCartApi({ syncToStore: true });
  const { removeFromCart } = useRemoveFromCart();
  const { updateQuantityInCart } = useUpdateCartQuantity();
  const { clearCart } = useClearCart();
  const {
    items,
    updateItemCategoryIds,
    getSubtotal,
    getTotalItems,
    getInitialPayment,
  } = useCartStore();

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchCart();
    }
  }, [isOpen, isAuthenticated, fetchCart]);

  useEffect(() => {
    if (!isOpen || items.length === 0) return;
    const itemsToHydrate = items.filter(
      (item) => !item.categoryId || !item.subcategoryId
    );
    if (itemsToHydrate.length === 0) return;

    const hydrate = async () => {
      for (const item of itemsToHydrate) {
        try {
          const data = await productsService.getProducts({
            page: 1,
            totalItems: 5,
            categoryId: 0,
            subcategoryId: 0,
            productName: item.name,
          });
          const list = (() => {
            if (!data) return [];
            if (Array.isArray(data?.body?.products)) return data.body.products;
            if (Array.isArray(data?.body)) return data.body;
            if (Array.isArray(data?.products)) return data.products;
            return Array.isArray(data) ? data : [];
          })();
          const match = list.find(
            (p) =>
              String(p.productId) === String(item.id) ||
              String(p.productName) === String(item.name)
          );
          if (match?.categoryId != null || match?.subcategoryId != null) {
            const catId = match.categoryId ?? match.category_id;
            const subId = match.subcategoryId ?? match.subcategory_id;
            if (catId != null || subId != null) {
              updateItemCategoryIds(item.id, item.size, catId, subId, item.productVariantId);
            }
          }
        } catch {
          // ignore
        }
      }
    };

    hydrate();
  }, [isOpen, items, updateItemCategoryIds]);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const subtotal = getSubtotal();
  const shipping = getShippingCost(subtotal);
  const total = subtotal + shipping;
  const totalItems = getTotalItems();
  const initialPayment = getInitialPayment();

  const handleQuantityChange = (itemId, size, newQuantity, maxStock = 999, productVariantId) => {
    if (newQuantity < 1) {
      removeFromCart(itemId, size, productVariantId);
      return;
    }
    updateQuantityInCart(itemId, size, Math.min(newQuantity, maxStock), productVariantId);
  };

  const handleRemoveItem = (itemId, size, productVariantId) => {
    removeFromCart(itemId, size, productVariantId);
  };

  const handleViewCart = () => {
    onClose();
    navigate(ROUTES.CART);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <HiOutlineShoppingCart className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Carrito
            </h2>
            {cartLoading && (
              <div className="w-5 h-5 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            aria-label="Cerrar carrito"
          >
            <HiOutlineXMark className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <HiOutlineShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium mb-2">Tu carrito está vacío</p>
              <p className="text-sm text-gray-500 mb-6">
                Agrega productos para comenzar a comprar
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {items.map((item) => {
                const productDetailUrl = getProductDetailUrl(item.id);
                const isOutOfStock = item.stock != null && item.stock <= 0;
                return (
                <div
                  key={`${item.id}-${item.productVariantId ?? 'nv'}-${item.size}`}
                  className={`flex gap-4 p-4 rounded-lg border border-gray-200 ${isOutOfStock ? 'bg-gray-50/50 opacity-75' : 'bg-gray-50'}`}
                >
                  <Link
                    to={productDetailUrl}
                    onClick={onClose}
                    className={`w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 block ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ProductPlaceholder name={item.name} className="w-full h-full" />
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={productDetailUrl}
                      onClick={onClose}
                      className="block"
                    >
                      <h3 className={`font-semibold text-sm mb-1 line-clamp-2 hover:text-primary-600 transition-colors ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}>
                        {item.name}
                      </h3>
                      {item.attributes && item.attributes.length > 0 && (
                        <p className="text-xs text-gray-400">
                          {item.attributes.map((a) => `${a.name}: ${a.value}`).join(' · ')}
                        </p>
                      )}
                    </Link>

                    {isOutOfStock ? (
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs font-medium text-red-500">No disponible</span>
                        <span className="text-gray-300">·</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id, item.size, item.productVariantId)}
                          className="text-xs font-medium text-primary-600 hover:text-primary-700 underline underline-offset-2 transition-colors"
                        >
                          Remover
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1, item.stock ?? 999, item.productVariantId)}
                              disabled={item.quantity <= 1}
                              className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1, item.stock ?? 999, item.productVariantId)}
                              disabled={item.quantity >= (item.stock ?? 999)}
                              className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 text-sm">
                              {formatPrice(item.total)}
                            </p>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <p className="text-xs text-gray-500 line-through">
                                {formatPrice(item.originalPrice * item.quantity)}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveItem(item.id, item.size, item.productVariantId);
                          }}
                          className="mt-2 text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                          Remover
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </div>

        {/* Footer - Resumen y Acciones */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-white">
            {/* Resumen */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'producto' : 'productos'}):</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Envío:</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">Gratis</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Info de Financiamiento */}
              <div className="bg-primary-50 rounded-lg p-3 mt-3 border border-primary-100">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Pago inicial:</span>
                  <span className="font-semibold text-primary-600">{formatPrice(initialPayment)}</span>
                </div>
              </div>
            </div>

            {/* Botón */}
            <button
              onClick={handleViewCart}
              className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              Continuar al pago
              <HiOutlineArrowRight className="w-5 h-5" />
            </button>

            {/* Limpiar Carrito */}
            <button
              onClick={clearCart}
              className="mt-4 w-full text-sm text-red-600 hover:text-red-700 font-medium flex items-center justify-center gap-2"
            >
              <HiOutlineTrash className="w-4 h-4" />
              Vaciar Carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;

