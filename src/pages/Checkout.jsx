import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ROUTES } from '../utils/routes';
import useCartStore from '../stores/cartStore';
import useToastStore from '../stores/toastStore';
import { orderService } from '../api/services/orderService';
import {
  HiOutlineChevronLeft,
  HiOutlineCreditCard,
  HiOutlineLockClosed,
  HiOutlineCalendarDays,
  HiOutlineBanknotes,
  HiOutlineBuildingStorefront,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
} from 'react-icons/hi2';

const Checkout = () => {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const { 
    items, 
    getSubtotal, 
    isEmpty,
    deferralMonths,
    getInitialPayment,
    getDeferredAmount,
    getMonthlyPayment,
    getPaymentSchedule,
    clearCart,
  } = useCartStore();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  const [deliveryAddress, setDeliveryAddress] = useState({
    nameReceived: '',
    phoneReceived: '',
    deliveryStreet: '',
    deliveryExternalNumber: '',
    deliveryInternalNumber: '',
    deliveryNeighborhood: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryZipCode: '',
    deliveryReferences: '',
  });

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (isEmpty()) {
      navigate(ROUTES.CART);
    }
  }, [isEmpty, navigate]);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const subtotal = getSubtotal();
  const shipping = subtotal > 5000 ? 0 : 200;
  const total = subtotal + shipping;
  const initialPayment = getInitialPayment();
  const deferredAmount = getDeferredAmount();
  const monthlyPayment = getMonthlyPayment();
  const paymentSchedule = getPaymentSchedule();

  const handleCardDataChange = (field, value) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const handleDeliveryAddressChange = (field, value) => {
    setDeliveryAddress(prev => ({ ...prev, [field]: value }));
  };

  const processPayment = async () => {
    // Placeholder: implementar cuando exista endpoint de procesamiento de pago
  };

  const handleCheckout = async () => {
    if (!acceptedTerms) {
      alert('Por favor acepta los términos y condiciones');
      return;
    }

    const requiredAddressFields = ['nameReceived', 'phoneReceived', 'deliveryStreet', 'deliveryExternalNumber', 'deliveryNeighborhood', 'deliveryCity', 'deliveryState', 'deliveryZipCode'];
    const missing = requiredAddressFields.filter((f) => !deliveryAddress[f]?.trim());
    if (missing.length > 0) {
      alert('Por favor completa todos los campos obligatorios de la dirección de entrega');
      return;
    }

    setIsProcessing(true);

    try {
      await processPayment();

      const subtotal = getSubtotal();
      const shippingCost = subtotal > 5000 ? 0 : 200;
      const orderTotal = Math.round(subtotal + shippingCost);
      const totalProductQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

      const orderPayload = {
        totalProductQuantity,
        total: orderTotal,
        deliveryAddress: {
          nameReceived: deliveryAddress.nameReceived.trim(),
          phoneReceived: deliveryAddress.phoneReceived.trim(),
          deliveryStreet: deliveryAddress.deliveryStreet.trim(),
          deliveryExternalNumber: deliveryAddress.deliveryExternalNumber.trim(),
          deliveryInternalNumber: deliveryAddress.deliveryInternalNumber?.trim() ?? '',
          deliveryNeighborhood: deliveryAddress.deliveryNeighborhood.trim(),
          deliveryCity: deliveryAddress.deliveryCity.trim(),
          deliveryState: deliveryAddress.deliveryState.trim(),
          deliveryZipCode: deliveryAddress.deliveryZipCode.trim(),
          deliveryReferences: deliveryAddress.deliveryReferences?.trim() ?? '',
        },
        detailOrder: items.map((item) => ({
          productId: item.id,
          productVariantId: 7, //item.productVariantId ?? item.id,
          productName: item.name,
          quantity: item.quantity,
          numberPayments: deferralMonths,
          attributes: [{ name: 'size', value: item.size || 'Estándar' }],
        })),
      };

      const response = await orderService.createOrder(orderPayload);

      if (response.success === true) {
        showToast(response.statusMessage || 'Pedido creado correctamente', 'success', 4000);
        clearCart();
        navigate(ROUTES.ORDER_CONFIRMATION);
      } else {
        showToast(response.statusMessage || 'No se pudo crear el pedido', 'error', 5000);
      }
    } catch (error) {
      showToast(error?.message || 'No se pudo completar la orden. Intenta de nuevo.', 'error', 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isEmpty()) {
    return null;
  }

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0'),
  }));

  const years = Array.from({ length: 10 }, (_, i) => ({
    value: String(new Date().getFullYear() + i),
    label: String(new Date().getFullYear() + i),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to={ROUTES.CART}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors text-sm"
          >
            <HiOutlineChevronLeft className="w-4 h-4" />
            Volver al carrito
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Finalizar Compra
          </h1>
          <p className="text-gray-600">
            Revisa tu pedido y completa el pago inicial
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda - Dirección, Resumen y Calendario */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dirección de entrega */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-gray-900">Dirección de entrega</h2>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de quien recibe *</label>
                    <input
                      type="text"
                      value={deliveryAddress.nameReceived}
                      onChange={(e) => handleDeliveryAddressChange('nameReceived', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Luis Espinoza"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                    <input
                      type="tel"
                      value={deliveryAddress.phoneReceived}
                      onChange={(e) => handleDeliveryAddressChange('phoneReceived', e.target.value.replace(/\D/g, '').slice(0, 15))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="3511680101"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calle *</label>
                  <input
                    type="text"
                    value={deliveryAddress.deliveryStreet}
                    onChange={(e) => handleDeliveryAddressChange('deliveryStreet', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Prueba"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número exterior *</label>
                    <input
                      type="text"
                      value={deliveryAddress.deliveryExternalNumber}
                      onChange={(e) => handleDeliveryAddressChange('deliveryExternalNumber', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número interior</label>
                    <input
                      type="text"
                      value={deliveryAddress.deliveryInternalNumber}
                      onChange={(e) => handleDeliveryAddressChange('deliveryInternalNumber', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder=""
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Colonia *</label>
                  <input
                    type="text"
                    value={deliveryAddress.deliveryNeighborhood}
                    onChange={(e) => handleDeliveryAddressChange('deliveryNeighborhood', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Vecindario"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                    <input
                      type="text"
                      value={deliveryAddress.deliveryCity}
                      onChange={(e) => handleDeliveryAddressChange('deliveryCity', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Zapopan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                    <input
                      type="text"
                      value={deliveryAddress.deliveryState}
                      onChange={(e) => handleDeliveryAddressChange('deliveryState', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Jalisco"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">C.P. *</label>
                    <input
                      type="text"
                      value={deliveryAddress.deliveryZipCode}
                      onChange={(e) => handleDeliveryAddressChange('deliveryZipCode', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="45019"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Referencias</label>
                  <input
                    type="text"
                    value={deliveryAddress.deliveryReferences}
                    onChange={(e) => handleDeliveryAddressChange('deliveryReferences', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Entre calle X y Y"
                  />
                </div>
              </div>
            </div>

            {/* Resumen del Pedido (Solo lectura) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-gray-900">Resumen del Pedido</h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="px-6 py-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          Imagen
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.size} · Cantidad: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatPrice(item.total)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-3">
                  <span>Envío</span>
                  <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Calendario de Pagos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <HiOutlineCalendarDays className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Calendario de Pagos</h2>
                    <p className="text-sm text-gray-600">Tu plan a {deferralMonths} meses sin intereses</p>
                  </div>
                </div>
              </div>
              
              {/* Pago Inicial Destacado */}
              <div className="px-6 py-5 bg-primary-50 border-b-2 border-primary-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Pago Inicial (30%)</p>
                      <p className="text-sm text-gray-600">Hoy, {formatDate(new Date())}</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(initialPayment)}
                  </span>
                </div>
              </div>

              {/* Lista de Pagos Mensuales */}
              <div className="px-6 py-4">
                <p className="text-sm font-medium text-gray-700 mb-4">
                  Pagos mensuales restantes ({formatPrice(deferredAmount)} en {deferralMonths} meses):
                </p>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {paymentSchedule.map((payment) => (
                    <div
                      key={payment.number}
                      className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
                          {payment.number}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Pago {payment.number}</p>
                          <p className="text-sm text-gray-600">{formatDate(payment.date)}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(payment.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen del Total */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total de pagos mensuales:</span>
                  <span className="font-semibold text-gray-900">{formatPrice(deferredAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Método de Pago */}
          <div className="lg:col-span-1 space-y-6">
            {/* Monto a Pagar Hoy */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <HiOutlineBanknotes className="w-6 h-6" />
                <span className="font-medium">Pago de hoy</span>
              </div>
              <div className="text-4xl font-bold mb-2">
                {formatPrice(initialPayment)}
              </div>
              <p className="text-primary-100 text-sm">
                30% del total para apartar tus productos
              </p>
            </div>

            {/* Método de Pago */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Método de Pago</h3>
              
              <div className="space-y-3 mb-6">
                {/* Tarjeta */}
                <label 
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'card' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                  />
                  <HiOutlineCreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-primary-600' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">Tarjeta de Débito/Crédito</span>
                    <p className="text-xs text-gray-500">Visa, Mastercard, American Express</p>
                  </div>
                </label>

                {/* Oxxo Pay */}
                <label 
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'oxxo' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="oxxo"
                    checked={paymentMethod === 'oxxo'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                  />
                  <HiOutlineBuildingStorefront className={`w-6 h-6 ${paymentMethod === 'oxxo' ? 'text-primary-600' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">Efectivo en OXXO</span>
                    <p className="text-xs text-gray-500">Paga con efectivo en cualquier OXXO</p>
                  </div>
                </label>
              </div>

              {/* Formulario de Tarjeta */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 mb-6 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de tarjeta
                    </label>
                    <input
                      type="text"
                      value={cardData.cardNumber}
                      onChange={(e) => handleCardDataChange('cardNumber', e.target.value.replace(/\D/g, '').slice(0, 16))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre en la tarjeta
                    </label>
                    <input
                      type="text"
                      value={cardData.cardHolder}
                      onChange={(e) => handleCardDataChange('cardHolder', e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="JUAN PÉREZ"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vencimiento
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={cardData.expiryMonth}
                          onChange={(e) => handleCardDataChange('expiryMonth', e.target.value)}
                          className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                        >
                          <option value="">MM</option>
                          {months.map(m => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                          ))}
                        </select>
                        <select
                          value={cardData.expiryYear}
                          onChange={(e) => handleCardDataChange('expiryYear', e.target.value)}
                          className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                        >
                          <option value="">AA</option>
                          {years.map(y => (
                            <option key={y.value} value={y.value}>{y.label.slice(-2)}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cardData.cvv}
                        onChange={(e) => handleCardDataChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  {/* Guardar tarjeta para pagos recurrentes */}
                  <label className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="w-5 h-5 text-primary-600 focus:ring-primary-500 rounded mt-0.5"
                    />
                    <div>
                      <span className="font-medium text-gray-900 text-sm">
                        Guardar tarjeta para pagos automáticos
                      </span>
                      <p className="text-xs text-gray-600 mt-1">
                        Tus pagos mensuales se cargarán automáticamente a esta tarjeta
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Mensaje de OXXO */}
              {paymentMethod === 'oxxo' && (
                <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-3">
                    <HiOutlineDocumentText className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-900">
                        Recibirás una ficha de pago
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        Presenta el código de barras en cualquier OXXO para realizar tu pago inicial. 
                        Tienes 3 días para completar el pago.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Términos y Condiciones */}
              <label className="flex items-start gap-3 mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-5 h-5 text-primary-600 focus:ring-primary-500 rounded mt-0.5"
                />
                <span className="text-sm text-gray-600">
                  Acepto los{' '}
                  <Link to={ROUTES.TERMS} className="text-primary-600 hover:underline">
                    términos y condiciones
                  </Link>{' '}
                  y el{' '}
                  <Link to={ROUTES.PRIVACY} className="text-primary-600 hover:underline">
                    aviso de privacidad
                  </Link>
                </span>
              </label>

              {/* Botón de Pago */}
              <button
                onClick={handleCheckout}
                disabled={!acceptedTerms || isProcessing}
                className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  acceptedTerms && !isProcessing
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <HiOutlineLockClosed className="w-5 h-5" />
                    Pagar {formatPrice(initialPayment)}
                  </>
                )}
              </button>

              {/* Seguridad */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                <HiOutlineShieldCheck className="w-4 h-4" />
                <span>Pago seguro con encriptación SSL</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
