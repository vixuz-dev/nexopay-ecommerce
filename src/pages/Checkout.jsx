import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ROUTES } from '../utils/routes';
import useCartStore from '../stores/cartStore';
import {
  HiOutlineXMark,
  HiOutlineChevronLeft,
  HiOutlineCreditCard,
  HiOutlineLockClosed,
} from 'react-icons/hi2';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, updateSize, getSubtotal, clearCart, isEmpty } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [expiryMonth, setExpiryMonth] = useState('05');
  const [expiryYear, setExpiryYear] = useState('2024');

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (isEmpty()) {
      navigate(ROUTES.CART);
    }
  }, [isEmpty, navigate]);

  const [paymentData, setPaymentData] = useState({
    nameOnCard: 'Juan Pérez',
    cardNumber: '2153',
    cvv: '156',
  });

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

  const handleRemoveItem = (itemId, size) => {
    removeItem(itemId, size);
  };

  const handleQuantityChange = (itemId, size, newQuantity) => {
    updateQuantity(itemId, newQuantity, size);
  };

  const handleSizeChange = (itemId, oldSize, newSize) => {
    updateSize(itemId, oldSize, newSize);
  };

  if (isEmpty()) {
    return null; // El useEffect redirigirá
  }

  const handlePaymentDataChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckout = () => {
    // TODO: Implementar lógica de checkout
    console.log('Procesando pago...', { paymentMethod, paymentData, total, items });
    // Aquí se procesaría el pago y luego limpiar el carrito
    // clearCart();
    // navigate(ROUTES.MY_ORDERS);
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return month.toString().padStart(2, '0');
  });

  const years = Array.from({ length: 10 }, (_, i) => {
    return (new Date().getFullYear() + i).toString();
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Columna Izquierda - Carrito de Compras */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

            {/* Tabla de Productos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Producto</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tamaño</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cantidad</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Precio Total</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr key={`${item.id}-${item.size}`} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <span className="text-xs text-gray-400">Imagen</span>
                              )}
                            </div>
                            <span className="font-medium text-gray-900">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={item.size}
                            onChange={(e) => handleSizeChange(item.id, item.size, e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                          >
                            <option value="Estándar">Estándar</option>
                            <option value="Pequeño">Pequeño</option>
                            <option value="Mediano">Mediano</option>
                            <option value="Grande">Grande</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              -
                            </button>
                            <span className="w-12 text-center font-medium text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">{formatPrice(item.total)}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleRemoveItem(item.id, item.size)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            aria-label="Eliminar producto"
                          >
                            <HiOutlineXMark className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Resumen del Pedido */}
              <div className="border-t border-gray-200 px-6 py-6 bg-gray-50">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
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
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Continuar Comprando */}
            <Link
              to={ROUTES.PRODUCTS}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mt-6"
            >
              <HiOutlineChevronLeft className="w-5 h-5" />
              <span>Continuar Comprando</span>
            </Link>
          </div>

          {/* Columna Derecha - Información de Pago */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Información de Pago</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              {/* Método de Pago */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">Método de Pago</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-primary-500 rounded-lg cursor-pointer bg-primary-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      checked={paymentMethod === 'credit-card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                    />
                    <HiOutlineCreditCard className="w-6 h-6 text-primary-600" />
                    <span className="font-medium text-gray-900">Tarjeta de Crédito</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="w-6 h-6 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">PayPal</span>
                    </div>
                    <span className="font-medium text-gray-900">PayPal</span>
                  </label>
                </div>
              </div>

              {paymentMethod === 'credit-card' && (
                <>
                  {/* Nombre en la Tarjeta */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre en la Tarjeta:
                    </label>
                    <input
                      type="text"
                      value={paymentData.nameOnCard}
                      onChange={(e) => handlePaymentDataChange('nameOnCard', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Juan Pérez"
                    />
                  </div>

                  {/* Número de Tarjeta */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Número de Tarjeta:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) => handlePaymentDataChange('cardNumber', e.target.value.replace(/\D/g, '').slice(-4))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-12"
                        placeholder="**** **** **** 2153"
                        maxLength="4"
                      />
                      <HiOutlineCreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Fecha de Expiración y CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Fecha de Expiración:
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={expiryMonth}
                          onChange={(e) => setExpiryMonth(e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          {months.map(month => (
                            <option key={month} value={month}>{month}</option>
                          ))}
                        </select>
                        <select
                          value={expiryYear}
                          onChange={(e) => setExpiryYear(e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CVV:
                      </label>
                      <input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) => handlePaymentDataChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="156"
                        maxLength="3"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Botón de Checkout */}
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <HiOutlineLockClosed className="w-5 h-5" />
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;

