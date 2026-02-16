import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ROUTES } from '../utils/routes';
import useCartStore from '../stores/cartStore';
import useToastStore from '../stores/toastStore';
import usePreOrderStore from '../stores/preOrderStore';
import { CHECKOUT_CONFIG, getShippingCost } from '../constants/checkoutConfig';
import { orderService } from '../api/services/orderService';
import { buildOrderPayload, doesPreOrderMatchCart } from '../utils/orderPayloadBuilder';
import {
  HiOutlineXMark,
  HiOutlineChevronLeft,
  HiOutlineShoppingBag,
  HiOutlineTrash,
  HiOutlineCreditCard,
  HiOutlineCalendarDays,
  HiOutlineBanknotes,
  HiOutlineInformationCircle,
  HiOutlineMapPin,
  HiOutlinePlus,
} from 'react-icons/hi2';
import ProductPlaceholder from '../components/common/ProductPlaceholder';
import PurchaseFlowBreadcrumb from '../components/common/PurchaseFlowBreadcrumb';
import AddAddressModal from '../components/common/AddAddressModal';
import { addressService } from '../api/services/addressService';

const formatAddressLine = (addr) => {
  const parts = [
    `${addr.street || ''} ${addr.external_number || ''}`.trim(),
    addr.internal_number ? `Int. ${addr.internal_number}` : null,
  ].filter(Boolean);
  return parts.join(', ') || '—';
};

const Cart = () => {
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.showToast);
  const preOrder = usePreOrderStore((s) => s.preOrder);
  const setPreOrder = usePreOrderStore((s) => s.setPreOrder);
  const { 
    items, 
    removeItem, 
    updateQuantity, 
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
  const shipping = getShippingCost(subtotal);
  const total = subtotal + shipping;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const initialPayment = getInitialPayment();
  const deferredAmount = getDeferredAmount();
  const monthlyPayment = getMonthlyPayment();

  const fetchAddresses = async () => {
    setAddressesLoading(true);
    try {
      const data = await addressService.getAddresses();
      const list = Array.isArray(data) ? data : [];
      setAddresses(list);
      setSelectedAddressId((prev) => {
        if (list.length === 0) return null;
        const exists = list.some((a) => a.client_address_id === prev);
        if (exists) return prev;
        const principal = list.find((a) => a.is_principal === 1) || list[0];
        return principal.client_address_id;
      });
    } catch (err) {
      setAddresses([]);
    } finally {
      setAddressesLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const selectedAddress = addresses.find((a) => a.client_address_id === selectedAddressId);

  const handleQuantityChange = (itemId, size, newQuantity) => {
    const item = items.find(i => i.id === itemId && i.size === size);
    const maxQty = item?.stock ?? 999;
    updateQuantity(itemId, Math.min(newQuantity, maxQty), size);
  };

  const handleRemoveItem = (itemId, size) => {
    removeItem(itemId, size);
  };

  const handleCheckout = async () => {
    if (isEmpty()) return;
    if (addresses.length === 0) {
      setIsAddAddressModalOpen(true);
      return;
    }

    if (!selectedAddress) {
      showToast('Selecciona una dirección de entrega', 'error');
      return;
    }

    if (preOrder && doesPreOrderMatchCart(preOrder, items)) {
      navigate(ROUTES.CHECKOUT, { state: { selectedAddressId } });
      return;
    }

    setIsProcessing(true);

    try {
      const payload = buildOrderPayload({
        items,
        totalDeferredAmount: deferredAmount,
        deferralMonths,
        deliveryAddress: selectedAddress,
      });

      const response = await orderService.createOrder(payload);

      setPreOrder({
        orderId: response.orderId,
        orderNumber: response.orderId,
        creditAmount: response.creditAmount,
        total: response.total,
        totalInitialPayment: response.totalInitialPayment,
        payload,
        createdAt: new Date().toISOString(),
      });

      navigate(ROUTES.CHECKOUT, { state: { selectedAddressId } });
    } catch (err) {
      showToast(err?.message || 'Error al crear la orden. Intenta de nuevo.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const getItemPaymentInfo = (item) => {
    const unitInit = item.unitInitialPayment ?? (item.price ?? 0) * CHECKOUT_CONFIG.INITIAL_PAYMENT_PERCENT;
    const unitDeferred = item.unitDeferredAmount ?? (item.price ?? 0) * (1 - CHECKOUT_CONFIG.INITIAL_PAYMENT_PERCENT);
    const initial = unitInit * item.quantity;
    const deferred = unitDeferred * item.quantity;
    const monthly = deferralMonths > 0 ? deferred / deferralMonths : 0;
    return { initial, deferred, monthly };
  };

  if (isEmpty()) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PurchaseFlowBreadcrumb currentStep="cart" />
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
        <PurchaseFlowBreadcrumb currentStep="cart" />
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Carrito de Compras
          </h1>
          <p className="text-gray-600">
            {items.length} {items.length === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Lista de Productos */}
          <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-8">
            {items.map((item) => {
              const paymentInfo = getItemPaymentInfo(item);
              
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
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveItem(item.id, item.size);
                          }}
                          className="text-gray-400 hover:text-red-600 transition-colors p-2"
                          aria-label="Remover producto"
                        >
                          <HiOutlineXMark className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2">
                            Cantidad
                          </label>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            >
                              -
                            </button>
                            <span className="w-12 text-center font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                              disabled={item.quantity >= (item.stock ?? 999)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            >
                              +
                            </button>
                          </div>
                          {(item.stock != null && item.stock < 999) && (
                            <p className="text-xs text-gray-500 mt-1">
                              Máximo: {item.stock} disponible{item.stock !== 1 ? 's' : ''}
                            </p>
                          )}
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
                            <span>Total a diferir:</span>
                            <span className="font-semibold text-primary-600">{formatPrice(paymentInfo.deferred)}</span>
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
            {!addressesLoading && addresses.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <HiOutlineMapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">No tienes direcciones de entrega</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Debes agregar al menos una dirección antes de continuar con el pago.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAddAddressModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm"
                    >
                      <HiOutlinePlus className="w-5 h-5" />
                      Agregar dirección
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!addressesLoading && addresses.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <HiOutlineMapPin className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Dirección de entrega</h3>
                      <p className="text-xs text-gray-600">Aquí se enviarán tus productos</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddAddressModalOpen(true)}
                    className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors flex-shrink-0"
                    aria-label="Agregar otra dirección"
                  >
                    <HiOutlinePlus className="w-5 h-5" />
                  </button>
                </div>
                {addresses.length > 1 ? (
                  <div className="space-y-2 mb-4">
                    {addresses.map((addr) => (
                      <label
                        key={addr.client_address_id}
                        className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          selectedAddressId === addr.client_address_id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryAddress"
                          checked={selectedAddressId === addr.client_address_id}
                          onChange={() => setSelectedAddressId(addr.client_address_id)}
                          className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">{addr.alias}</p>
                          <p className="text-xs text-gray-600">
                            {addr.name_received} · {addr.street} {addr.external_number}
                            {addr.internal_number ? ` Int. ${addr.internal_number}` : ''}
                          </p>
                          <p className="text-xs text-gray-500">
                            {addr.neighborhood}, {addr.city}, {addr.state} {addr.zip_code}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : selectedAddress && (
                  <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                    <p className="font-semibold text-gray-900 text-sm">{selectedAddress.alias}</p>
                    <p className="text-sm text-gray-700 mt-1">
                      {selectedAddress.name_received}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatAddressLine(selectedAddress)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedAddress.neighborhood}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip_code}
                    </p>
                    {selectedAddress.address_references && (
                      <p className="text-xs text-gray-500 mt-2">{selectedAddress.address_references}</p>
                    )}
                  </div>
                )}
              </div>
            )}

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
                {CHECKOUT_CONFIG.DEFERRAL_MONTHS_OPTIONS.map((months) => (
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
            </div>

            {/* Desglose de Pago */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({totalQuantity} {totalQuantity === 1 ? 'producto' : 'productos'}):</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
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
                      <span className="text-sm text-gray-700">Pago inicial:</span>
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
                disabled={addressesLoading || isProcessing}
                className="w-full py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creando orden...
                  </>
                ) : (
                  <>
                    <HiOutlineCreditCard className="w-5 h-5" />
                    {addressesLoading
                      ? 'Cargando...'
                      : addresses.length === 0
                        ? 'Agregar dirección para continuar'
                        : 'Proceder al Pago'}
                  </>
                )}
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

      <AddAddressModal
        isOpen={isAddAddressModalOpen}
        onClose={() => setIsAddAddressModalOpen(false)}
        onSuccess={fetchAddresses}
      />

      <Footer />
    </div>
  );
};

export default Cart;
