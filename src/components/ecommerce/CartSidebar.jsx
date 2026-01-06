import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../stores/cartStore';
import { ROUTES } from '../../utils/routes';
import {
  HiOutlineXMark,
  HiOutlineShoppingCart,
  HiOutlineTrash,
  HiOutlineArrowRight,
} from 'react-icons/hi2';
import ProductPlaceholder from '../common/ProductPlaceholder';

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTotalItems,
    clearCart,
    isEmpty,
    deferralMonths,
    getInitialPayment,
    getMonthlyPayment,
  } = useCartStore();

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const subtotal = getSubtotal();
  const shipping = subtotal > 5000 ? 0 : 200;
  const total = subtotal + shipping;
  const totalItems = getTotalItems();
  const initialPayment = getInitialPayment();
  const monthlyPayment = getMonthlyPayment();

  const handleQuantityChange = (itemId, size, newQuantity) => {
    updateQuantity(itemId, newQuantity, size);
  };

  const handleRemoveItem = (itemId, size) => {
    removeItem(itemId, size);
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
              Carrito ({totalItems})
            </h2>
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
          {isEmpty() ? (
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
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  {/* Imagen */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ProductPlaceholder name={item.name} className="w-full h-full" />
                    )}
                  </div>

                  {/* Información */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`${ROUTES.PRODUCT_DETAIL}?id=${item.id}${item.category ? `&category=${encodeURIComponent(item.category)}` : ''}`}
                      onClick={onClose}
                      className="block"
                    >
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 hover:text-primary-600 transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-600 mb-2">Tamaño: {item.size}</p>

                    {/* Cantidad y Precio */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-200 transition-colors text-sm"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-200 transition-colors text-sm"
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

                    {/* Eliminar */}
                    <button
                      onClick={() => handleRemoveItem(item.id, item.size)}
                      className="mt-2 text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Resumen y Acciones */}
        {!isEmpty() && (
          <div className="border-t border-gray-200 p-6 bg-white">
            {/* Resumen */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Subtotal ({totalItems} items):</span>
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
              {subtotal < 5000 && (
                <p className="text-xs text-gray-500">
                  Agrega {formatPrice(5000 - subtotal)} más para envío gratis
                </p>
              )}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Info de Financiamiento */}
              <div className="bg-primary-50 rounded-lg p-3 mt-3 border border-primary-100">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Pago inicial (30%):</span>
                  <span className="font-semibold text-primary-600">{formatPrice(initialPayment)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{deferralMonths} mensualidades de:</span>
                  <span className="font-medium">{formatPrice(monthlyPayment)}</span>
                </div>
              </div>
            </div>

            {/* Botón */}
            <button
              onClick={handleViewCart}
              className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              Ver Carrito y Configurar Pago
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

