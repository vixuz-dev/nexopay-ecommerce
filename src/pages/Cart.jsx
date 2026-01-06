import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ROUTES } from '../utils/routes';
import useCartStore from '../stores/cartStore';
import {
  HiOutlineXMark,
  HiOutlineChevronLeft,
  HiOutlineShoppingBag,
  HiOutlineTrash,
  HiOutlineCreditCard,
  HiOutlineCalendarDays,
  HiOutlineBanknotes,
  HiOutlineInformationCircle,
} from 'react-icons/hi2';
import ProductPlaceholder from '../components/common/ProductPlaceholder';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    updateSize, 
    clearCart, 
    getSubtotal, 
    isEmpty,
    deferralMonths,
    setDeferralMonths,
    getInitialPayment,
    getDeferredAmount,
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
  const initialPayment = getInitialPayment();
  const deferredAmount = getDeferredAmount();
  const monthlyPayment = getMonthlyPayment();

  const handleQuantityChange = (itemId, size, newQuantity) => {
    updateQuantity(itemId, newQuantity, size);
  };

  const handleSizeChange = (itemId, oldSize, newSize) => {
    updateSize(itemId, oldSize, newSize);
  };

  const handleRemoveItem = (itemId, size) => {
    removeItem(itemId, size);
  };

  const handleCheckout = () => {
    if (!isEmpty()) {
      navigate(ROUTES.CHECKOUT);
    }
  };

  // Calcular pago inicial (30%) por producto
  const calculateProductPaymentInfo = (itemTotal) => {
    const initial = itemTotal * 0.30;
    const deferred = itemTotal * 0.70;
    const monthly = deferralMonths > 0 ? deferred / deferralMonths : 0;
    
    return { initial, deferred, monthly };
  };

  if (isEmpty()) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <HiOutlineShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8">
              Agrega productos para comenzar a comprar
            </p>
            <Link
              to={ROUTES.PRODUCTS}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <HiOutlineChevronLeft className="w-5 h-5" />
              Ir a Productos
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Carrito de Compras
          </h1>
          <p className="text-gray-600">
            {items.length} {items.length === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const paymentInfo = calculateProductPaymentInfo(item.total);
              
              return (
                <div
                  key={`${item.id}-${item.size}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Imagen del Producto */}
                    <div className="w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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

                    {/* Información del Producto */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <Link
                            to={`${ROUTES.PRODUCT_DETAIL}?id=${item.id}${item.category ? `&category=${encodeURIComponent(item.category)}` : ''}`}
                            className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id, item.size)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-2"
                          aria-label="Eliminar producto"
                        >
                          <HiOutlineXMark className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Tamaño */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2">
                            Tamaño
                          </label>
                          <select
                            value={item.size}
                            onChange={(e) => handleSizeChange(item.id, item.size, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                          >
                            <option value="Estándar">Estándar</option>
                            <option value="Pequeño">Pequeño</option>
                            <option value="Mediano">Mediano</option>
                            <option value="Grande">Grande</option>
                          </select>
                        </div>

                        {/* Cantidad */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2">
                            Cantidad
                          </label>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              -
                            </button>
                            <span className="w-12 text-center font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Precio */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2">
                            Precio
                          </label>
                          <div className="flex flex-col">
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-xs text-gray-500 line-through">
                                {formatPrice(item.originalPrice * item.quantity)}
                              </span>
                            )}
                            <span className="text-lg font-bold text-gray-900">
                              {formatPrice(item.total)}
                            </span>
                            <span className="text-xs text-gray-600">
                              {formatPrice(item.price)} c/u
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Info de pago por producto */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <span>Inicial:</span>
                            <span className="font-semibold text-primary-600">{formatPrice(paymentInfo.initial)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <span>Mensualidad:</span>
                            <span className="font-semibold text-primary-600">{formatPrice(paymentInfo.monthly)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Limpiar Carrito */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
              >
                <HiOutlineTrash className="w-5 h-5" />
                Vaciar Carrito
              </button>
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:col-span-1 space-y-6">
            {/* Selector de Meses Global */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <HiOutlineCalendarDays className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Plan de Pagos</h3>
                  <p className="text-sm text-gray-600">Elige los meses a diferir</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[3, 6, 9, 12].map((months) => (
                  <button
                    key={months}
                    onClick={() => setDeferralMonths(months)}
                    className={`py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                      deferralMonths === months
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {months}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                meses sin intereses
              </p>
            </div>

            {/* Desglose de Pago */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
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
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Desglose de Financiamiento */}
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-5 border border-primary-200 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <HiOutlineBanknotes className="w-5 h-5 text-primary-600" />
                  <span className="font-semibold text-gray-900">Tu plan de pago</span>
                </div>

                <div className="space-y-3">
                  {/* Pago Inicial */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">Pago inicial (30%):</span>
                      <div className="group relative">
                        <HiOutlineInformationCircle className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-10">
                          Pago que realizas hoy para apartar tus productos
                        </div>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-primary-600">
                      {formatPrice(initialPayment)}
                    </span>
                  </div>

                  {/* Total a diferir */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">Total a diferir:</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(deferredAmount)}
                    </span>
                  </div>

                  {/* Separador */}
                  <div className="border-t border-primary-200 pt-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-700">Pago mensual:</span>
                        <p className="text-xs text-gray-500">Durante {deferralMonths} meses</p>
                      </div>
                      <span className="text-xl font-bold text-primary-600">
                        {formatPrice(monthlyPayment)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <HiOutlineCreditCard className="w-5 h-5" />
                Proceder al Pago
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Pagarás {formatPrice(initialPayment)} hoy
              </p>
            </div>

            <Link
              to={ROUTES.PRODUCTS}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors text-sm"
            >
              <HiOutlineChevronLeft className="w-4 h-4" />
              Continuar Comprando
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
