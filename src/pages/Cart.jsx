import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ROUTES, getProductDetailUrl } from '../utils/routes';
import useCartStore from '../stores/cartStore';
import useToastStore from '../stores/toastStore';
import useUIStore from '../stores/uiStore';
import usePreOrderStore from '../stores/preOrderStore';
import { useCartApi } from '../hooks/useCartApi';
import { useRemoveFromCart } from '../hooks/useRemoveFromCart';
import { useUpdateCartQuantity } from '../hooks/useUpdateCartQuantity';
import { useClearCart } from '../hooks/useClearCart';
import useUserStore from '../stores/userStore';
import { CHECKOUT_CONFIG, getShippingCost } from '../constants/checkoutConfig';
import { orderService } from '../api/services/orderService';
import { buildOrderPayload } from '../utils/orderPayloadBuilder';
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
  HiOutlinePencilSquare,
  HiOutlinePlus,
} from 'react-icons/hi2';
import ProductPlaceholder from '../components/common/ProductPlaceholder';
import PurchaseFlowBreadcrumb from '../components/common/PurchaseFlowBreadcrumb';
import AddAddressModal from '../components/common/AddAddressModal';
import CartCreditGateModal from '../components/common/CartCreditGateModal';
import useAddressesStore from '../stores/addressesStore';
import useCreditLineStatusStore from '../stores/creditLineStatusStore';
import { getCartCreditAccessState } from '../utils/creditLinePurchaseAccess';
import { isSameCartLine } from '../utils/cartLineUtils';
import { isPrincipalAddress } from '../utils/addressForm';

const formatAddressLine = (addr) => {
  const parts = [
    `${addr.street || ''} ${addr.external_number || ''}`.trim(),
    addr.internal_number ? `Int. ${addr.internal_number}` : null,
  ].filter(Boolean);
  return parts.join(', ') || '—';
};

const Cart = () => {
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [creditGateVariant, setCreditGateVariant] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = !!useUserStore((s) => s.user);
  const showButton = useCreditLineStatusStore((s) => s.showButton);
  const requestStatus = useCreditLineStatusStore((s) => s.requestStatus);
  const isCreditStatusLoaded = useCreditLineStatusStore((s) => s.isStatusLoaded);
  const fetchCreditLineStatus = useCreditLineStatusStore((s) => s.fetchCreditLineStatus);
  const { fetchCart, loading: cartLoading } = useCartApi({ syncToStore: true });
  const showToast = useToastStore((s) => s.showToast);
  const showGlobalLoader = useUIStore((s) => s.showGlobalLoader);
  const hideGlobalLoader = useUIStore((s) => s.hideGlobalLoader);
  const addresses = useAddressesStore((s) => s.addresses);
  const addressesLoading = useAddressesStore((s) => s.isLoading);
  const fetchAddresses = useAddressesStore((s) => s.fetchAddresses);
  const invalidateAddresses = useAddressesStore((s) => s.invalidateAddresses);
  const setPreOrder = usePreOrderStore((s) => s.setPreOrder);
  const { removeFromCart } = useRemoveFromCart();
  const { updateQuantityInCart } = useUpdateCartQuantity();
  const { clearCart } = useClearCart();
  const { 
    items, 
    getSubtotal,
    deferralMonths,
    setDeferralMonths,
    getInitialPayment,
    getDeferredAmount,
    getDeferredInstallmentPlan,
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
  const hasOutOfStockItems = items.some((item) => item.stock != null && item.stock <= 0);
  const initialPayment = getInitialPayment();
  const deferredAmount = getDeferredAmount();
  const installmentPlan = getDeferredInstallmentPlan();

  const cartCreditAccess = useMemo(() => {
    if (!isAuthenticated) {
      return { kind: 'allowed' };
    }
    return getCartCreditAccessState({
      showButton,
      requestStatus,
      isStatusLoaded: isCreditStatusLoaded,
    });
  }, [isAuthenticated, showButton, requestStatus, isCreditStatusLoaded]);

  const isCartCreditStatusLoading = isAuthenticated && cartCreditAccess.kind === 'loading';

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        await fetchCreditLineStatus();
      } catch {
        // El estado persistido o un reintento posterior define si se puede comprar
      }
    })();
  }, [isAuthenticated, fetchCreditLineStatus]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchAddresses({ force: true });
  }, [isAuthenticated, fetchAddresses]);

  useEffect(() => {
    if (addresses.length === 0) {
      setSelectedAddressId(null);
      return;
    }
    setSelectedAddressId((prev) => {
      const exists = prev && addresses.some((a) => a.client_address_id === prev);
      if (exists) return prev;
      const principal = addresses.find((a) => a.is_principal === 1) || addresses[0];
      return principal?.client_address_id ?? null;
    });
  }, [addresses]);

  const handleAddressSuccess = async () => {
    invalidateAddresses();
    const list = await fetchAddresses();
    setSelectedAddressId((prev) => {
      const exists = prev && list.some((a) => a.client_address_id === prev);
      if (exists) return prev;
      const principal = list.find((a) => a.is_principal === 1) || list[0];
      return principal?.client_address_id ?? null;
    });
  };

  const selectedAddress = addresses.find((a) => a.client_address_id === selectedAddressId);

  const handleQuantityChange = (itemId, size, newQuantity, productVariantId) => {
    if (newQuantity < 1) {
      removeFromCart(itemId, size, productVariantId);
      return;
    }
    const item = items.find((i) =>
      isSameCartLine(i, { productId: itemId, size, productVariantId })
    );
    const maxQty = item?.stock ?? 999;
    updateQuantityInCart(itemId, size, Math.min(newQuantity, maxQty), productVariantId);
  };

  const handleRemoveItem = (itemId, size, productVariantId) => {
    removeFromCart(itemId, size, productVariantId);
  };

  const closeAddressModal = () => {
    setIsAddAddressModalOpen(false);
    setEditingAddress(null);
  };

  const openEditAddressModal = (addr) => {
    if (!addr || isPrincipalAddress(addr)) return;
    setEditingAddress(addr);
    setIsAddAddressModalOpen(true);
  };

  const openAddAddressModalIfCreditAllows = () => {
    setEditingAddress(null);
    if (!isAuthenticated) {
      setIsAddAddressModalOpen(true);
      return;
    }
    if (isCartCreditStatusLoading) {
      showToast('Verificando tu línea de crédito…', 'info');
      return;
    }
    if (cartCreditAccess.kind !== 'allowed') {
      setCreditGateVariant(cartCreditAccess.kind);
      return;
    }
    setIsAddAddressModalOpen(true);
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (hasOutOfStockItems) {
      showToast('Remueve los productos sin existencias para continuar', 'error');
      return;
    }
    if (isAuthenticated) {
      if (isCartCreditStatusLoading) {
        showToast('Verificando tu línea de crédito…', 'info');
        return;
      }
      if (cartCreditAccess.kind !== 'allowed') {
        setCreditGateVariant(cartCreditAccess.kind);
        return;
      }
    }
    if (addresses.length === 0) {
      openAddAddressModalIfCreditAllows();
      return;
    }

    if (!selectedAddress) {
      showToast('Selecciona una dirección de entrega', 'error');
      return;
    }

    setIsProcessing(true);
    showGlobalLoader();

    try {
      const payload = buildOrderPayload({
        items,
        totalAmount: subtotal,
        deferralMonths,
        deliveryAddress: selectedAddress,
      });

      const response = await orderService.createOrder(payload);

      const orderData = response.order ?? response;
      const numericOrderId = response.order_id ?? response.id ?? orderData.order_id ?? orderData.id ?? (typeof response.orderId === 'number' ? response.orderId : null);
      const orderIdDisplay = response.orderId ?? response.order_id ?? response.id ?? orderData.orderId ?? orderData.order_id ?? orderData.id;

      setPreOrder({
        orderId: orderIdDisplay,
        order_id: numericOrderId,
        orderNumber: orderIdDisplay,
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
      hideGlobalLoader();
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

  if (cartLoading && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PurchaseFlowBreadcrumb currentStep="cart" />
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
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
            {hasOutOfStockItems && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                <HiOutlineInformationCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-xs text-red-600">
                  Uno o más de tus productos ya no están disponibles, remuévelos para continuar.
                </p>
              </div>
            )}
            {items.map((item) => {
              const paymentInfo = getItemPaymentInfo(item);
              const isOutOfStock = item.stock != null && item.stock <= 0;
              
              return (
                <div
                  key={`${item.id}-${item.productVariantId ?? 'nv'}-${item.size}`}
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden ${isOutOfStock ? 'opacity-75' : ''}`}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <Link
                      to={getProductDetailUrl(item.name, item.categoryId, item.subcategoryId)}
                      className={`w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 block ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
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

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <Link
                            to={getProductDetailUrl(item.name, item.categoryId, item.subcategoryId)}
                            className={`text-lg font-semibold hover:text-primary-600 transition-colors ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}
                          >
                            {item.name}
                          </Link>
                          <p className={`text-sm mt-1 ${isOutOfStock ? 'text-gray-400' : 'text-gray-600'}`}>{item.category}</p>
                          {item.attributes && item.attributes.length > 0 && (
                            <p className="text-sm text-gray-400 mt-1">
                              {item.attributes.map((a) => `${a.name}: ${a.value}`).join(' · ')}
                            </p>
                          )}
                        </div>
                        {!isOutOfStock && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveItem(item.id, item.size, item.productVariantId);
                            }}
                            className="text-gray-400 hover:text-red-600 transition-colors p-2"
                            aria-label="Remover producto"
                          >
                            <HiOutlineXMark className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      {isOutOfStock ? (
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs font-medium text-red-500">No disponible</span>
                          <span className="text-gray-300">·</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id, item.size, item.productVariantId)}
                            className="text-xs font-medium text-primary-600 hover:text-primary-700 underline underline-offset-2 transition-colors"
                          >
                            Remover del carrito
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-2">
                                Cantidad
                              </label>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1, item.productVariantId)}
                                  disabled={item.quantity <= 1}
                                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                >
                                  -
                                </button>
                                <span className="w-12 text-center font-medium text-gray-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1, item.productVariantId)}
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
                        </>
                      )}
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
                      onClick={openAddAddressModalIfCreditAllows}
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
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {selectedAddress && !isPrincipalAddress(selectedAddress) && (
                      <button
                        type="button"
                        onClick={() => openEditAddressModal(selectedAddress)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                        aria-label="Editar dirección seleccionada"
                      >
                        <HiOutlinePencilSquare className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={openAddAddressModalIfCreditAllows}
                      className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors"
                      aria-label="Agregar otra dirección"
                    >
                      <HiOutlinePlus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {addresses.length > 1 ? (
                  <div className="space-y-2 mb-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.client_address_id}
                        className={`flex items-stretch gap-2 p-3 rounded-lg border-2 transition-colors ${
                          selectedAddressId === addr.client_address_id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <label className="flex flex-1 min-w-0 items-start gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="deliveryAddress"
                            checked={selectedAddressId === addr.client_address_id}
                            onChange={() => setSelectedAddressId(addr.client_address_id)}
                            className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500 shrink-0"
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
                        {!isPrincipalAddress(addr) && (
                          <button
                            type="button"
                            onClick={() => openEditAddressModal(addr)}
                            className="self-start shrink-0 p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                            aria-label={`Editar dirección ${addr.alias || ''}`}
                          >
                            <HiOutlinePencilSquare className="w-5 h-5" />
                          </button>
                        )}
                      </div>
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
                    {installmentPlan.hasUnequalLastPayment && installmentPlan.totalMonths > 1 ? (
                      <p className="text-sm text-gray-700 leading-snug">
                        {installmentPlan.equalInstallmentMonths}{' '}
                        {installmentPlan.equalInstallmentMonths === 1 ? 'mensualidad' : 'mensualidades'} de{' '}
                        {formatPrice(installmentPlan.baseInstallment)} y un último pago de{' '}
                        {formatPrice(installmentPlan.lastInstallment)}.
                      </p>
                    ) : (
                      <div className="flex justify-between items-center gap-2">
                        <div>
                          <span className="text-sm text-gray-700">Pago mensual:</span>
                          <p className="text-xs text-gray-500">
                            Durante {deferralMonths} {deferralMonths === 1 ? 'mes' : 'meses'}
                          </p>
                        </div>
                        <span className="text-xl font-bold text-primary-600 shrink-0 text-right">
                          {formatPrice(installmentPlan.baseInstallment)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={
                  addressesLoading ||
                  isProcessing ||
                  hasOutOfStockItems ||
                  isCartCreditStatusLoading
                }
                className="w-full min-h-[3.25rem] py-3 px-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-600 disabled:hover:shadow-md"
              >
                {isProcessing ? (
                  <>
                    <div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"
                      aria-hidden
                    />
                    <span>Creando orden...</span>
                  </>
                ) : addressesLoading || isCartCreditStatusLoading ? (
                  <>
                    <div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"
                      aria-hidden
                    />
                    <span>{isCartCreditStatusLoading ? 'Verificando crédito…' : 'Cargando...'}</span>
                  </>
                ) : addresses.length === 0 ? (
                  <>
                    <HiOutlineMapPin className="w-6 h-6 shrink-0" aria-hidden />
                    <span className="text-left sm:text-center leading-snug">
                      Agregar dirección para continuar
                    </span>
                  </>
                ) : (
                  <>
                    <HiOutlineCreditCard className="w-5 h-5 shrink-0" aria-hidden />
                    <span>Proceder al pago</span>
                  </>
                )}
              </button>

              {/* <p className="text-xs text-gray-500 text-center mt-3">
                Pagarás {formatPrice(initialPayment)} hoy
              </p> */}
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
        editAddress={editingAddress}
        onClose={closeAddressModal}
        onSuccess={handleAddressSuccess}
      />

      <CartCreditGateModal
        isOpen={creditGateVariant != null}
        variant={creditGateVariant}
        onClose={() => setCreditGateVariant(null)}
      />

      <Footer />
    </div>
  );
};

export default Cart;
