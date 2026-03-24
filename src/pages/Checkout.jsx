import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ROUTES } from '../utils/routes';
import useCartStore from '../stores/cartStore';
import { useCartApi } from '../hooks/useCartApi';
import { useClearCart } from '../hooks/useClearCart';
import { useAuth } from '../context/AuthContext';
import useToastStore from '../stores/toastStore';
import usePreOrderStore from '../stores/preOrderStore';
import useUserStore from '../stores/userStore';
import { buildMercadoPagoPaymentPayload } from '../utils/mercadoPagoPayloadBuilder';
import { mercadoPagoService } from '../api/services/mercadoPagoService';
import { getShippingCost } from '../constants/checkoutConfig';
import useAddressesStore from '../stores/addressesStore';
import usePaymentMethodsStore from '../stores/paymentMethodsStore';
import PurchaseFlowBreadcrumb from '../components/common/PurchaseFlowBreadcrumb';
import {
  HiOutlineMapPin,
  HiOutlinePlus,
} from 'react-icons/hi2';
import AddAddressModal from '../components/common/AddAddressModal';
import {
  CheckoutOrderSummary,
  CheckoutPaymentSummary,
  CheckoutPaymentMethods,
  PaymentErrorModal,
} from '../components/checkout';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const showToast = useToastStore((s) => s.showToast);
  const preOrder = usePreOrderStore((s) => s.preOrder);
  const user = useUserStore((s) => s.user);
  const { fetchCart } = useCartApi({ syncToStore: true });
  const { clearCart } = useClearCart();
  const {
    items,
    getSubtotal,
    isEmpty,
    deferralMonths,
    getInitialPayment,
    getDeferredAmount,
    getPaymentSchedule,
  } = useCartStore();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const addresses = useAddressesStore((s) => s.addresses);
  const addressesLoading = useAddressesStore((s) => s.isLoading);
  const fetchAddresses = useAddressesStore((s) => s.fetchAddresses);
  const invalidateAddresses = useAddressesStore((s) => s.invalidateAddresses);
  const paymentMethods = usePaymentMethodsStore((s) => s.paymentMethods);
  const fetchPaymentMethods = usePaymentMethodsStore((s) => s.fetchPaymentMethods);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState({ isOpen: false, message: '' });

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  useEffect(() => {
    if (user) {
      console.log('[DEBUG] User info (userStore) - campos disponibles:', Object.keys(user));
      console.log('[DEBUG] User completo:', user);
    }
  }, [user]);

  useEffect(() => {
    if (preOrder) {
      console.log('[DEBUG] PreOrder en store:', preOrder);
    }
  }, [preOrder]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  useEffect(() => {
    const fromState = location.state?.selectedAddressId;
    if (addresses.length === 0) {
      setSelectedAddressId(null);
      return;
    }
    const exists = fromState && addresses.some((a) => a.client_address_id === fromState);
    setSelectedAddressId(exists ? fromState : (addresses.find((a) => a.is_principal === 1) || addresses[0]).client_address_id);
  }, [addresses, location.state?.selectedAddressId]);

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

  useEffect(() => {
    if (isEmpty()) {
      navigate(ROUTES.CART);
    }
  }, [isEmpty, navigate]);

  const subtotal = getSubtotal();
  const shipping = getShippingCost(subtotal);
  const total = subtotal + shipping;
  const initialPayment = getInitialPayment();
  const deferredAmount = getDeferredAmount();
  const paymentSchedule = getPaymentSchedule();

  const handleCardDataChange = (field, value) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const selectedAddress = addresses.find((a) => a.client_address_id === selectedAddressId);

  const handleCheckout = async (cardTokenResult) => {
    if (!acceptedTerms) {
      showToast('Por favor acepta los términos y condiciones', 'error');
      return;
    }

    if (!selectedAddress) {
      showToast('Selecciona una dirección de entrega', 'error');
      return;
    }

    if (!preOrder) {
      showToast('No hay orden creada. Regresa al carrito para proceder.', 'error');
      return;
    }

    const requiredAddressFields = ['name_received', 'phone_received', 'street', 'external_number', 'neighborhood', 'city', 'state', 'zip_code'];
    const missing = requiredAddressFields.filter((f) => !selectedAddress[f]?.trim());
    if (missing.length > 0) {
      showToast('Por favor completa todos los campos obligatorios de la dirección de entrega', 'error');
      return;
    }

    const useCardPayment = paymentMethod === 'card' && cardTokenResult;
    if (useCardPayment && !user?.client_id) {
      showToast('No se encontró la información del usuario. Inicia sesión nuevamente.', 'error');
      return;
    }

    if (useCardPayment && !user?.email) {
      showToast('No se encontró el correo del usuario. Actualiza tu perfil.', 'error');
      return;
    }

    const numericOrderId = preOrder?.order_id ?? preOrder?.orderId;
    const hasValidOrderId = numericOrderId != null && !Number.isNaN(Number(numericOrderId));
    if (useCardPayment && !hasValidOrderId) {
      showToast('No hay orden creada. Regresa al carrito para proceder.', 'error');
      return;
    }

    setIsProcessing(true);

    if (useCardPayment) {
      try {
        const token = typeof cardTokenResult === 'string' ? cardTokenResult : cardTokenResult.token;
        const paymentMethodId = typeof cardTokenResult === 'object' ? (cardTokenResult.payment_method_id ?? 'master') : 'master';
        const paymentTypeId = typeof cardTokenResult === 'object' ? (cardTokenResult.payment_type_id ?? 'credit_card') : 'credit_card';

        const payload = buildMercadoPagoPaymentPayload({
          clientId: user.client_id,
          isInitialPayment: true,
          orderId: numericOrderId,
          transactionAmount: preOrder.totalInitialPayment ?? initialPayment,
          token,
          paymentMethodId,
          paymentTypeId,
          payerEmail: user.email,
        });

        await mercadoPagoService.generatePayment(payload);
      } catch (err) {
        setPaymentError({
          isOpen: true,
          message: err?.message || 'Error al procesar el pago. Intenta de nuevo.',
        });
        setIsProcessing(false);
        return;
      }
    }

    const monthlyPayment = deferralMonths > 0 ? deferredAmount / deferralMonths : 0;
    const today = new Date();
    const paymentSchedule = Array.from({ length: deferralMonths }, (_, i) => ({
      number: i + 1,
      date: new Date(today.getFullYear(), today.getMonth() + i + 1, 1),
      amount: monthlyPayment,
      status: 'pending',
    }));

    const orderState = {
      items: [...items],
      subtotal,
      shipping,
      total,
      initialPayment,
      deferredAmount,
      monthlyPayment,
      deferralMonths,
      paymentSchedule,
      orderDate: new Date(),
      orderId: preOrder.orderId ?? preOrder.id,
      orderNumber: preOrder.orderNumber ?? preOrder.order_id ?? `NXP-${Date.now().toString().slice(-8)}`,
    };

    clearCart();

    navigate(ROUTES.ORDER_CONFIRMATION, {
      state: { order: orderState },
    });

    setIsProcessing(false);
  };

  if (isEmpty()) {
    return null;
  }

  const visaPm = paymentMethods.find((pm) => pm.id === 'visa' || pm.id === 'debvisa');
  const masterPm = paymentMethods.find((pm) => pm.id === 'master' || pm.id === 'debmaster');
  const oxxoPm = paymentMethods.find((pm) => pm.id === 'oxxo');
  const visaLogo = visaPm?.secure_thumbnail || visaPm?.thumbnail;
  const masterLogo = masterPm?.secure_thumbnail || masterPm?.thumbnail;
  const oxxoLogo = oxxoPm?.secure_thumbnail || oxxoPm?.thumbnail;
  const showCardForm = paymentMethod === 'card';
  const showOxxoMessage = paymentMethod === 'oxxo';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PurchaseFlowBreadcrumb currentStep="checkout" />

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Finalizar Compra
          </h1>
          <p className="text-gray-600">
            Revisa tu pedido y completa el pago inicial
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutOrderSummary
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              deferralMonths={deferralMonths}
              initialPayment={initialPayment}
              deferredAmount={deferredAmount}
              paymentSchedule={paymentSchedule}
            />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <CheckoutPaymentSummary initialPayment={initialPayment} />

            {!addressesLoading && addresses.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <HiOutlineMapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Dirección de entrega requerida</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Agrega una dirección para continuar con el pago.
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
                  {!showAllAddresses && selectedAddress && location.state?.selectedAddressId && (
                    <button
                      type="button"
                      onClick={() => setShowAllAddresses(true)}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      Cambiar
                    </button>
                  )}
                  {showAllAddresses && (
                    <button
                      type="button"
                      onClick={() => setIsAddAddressModalOpen(true)}
                      className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors flex-shrink-0"
                      aria-label="Agregar otra dirección"
                    >
                      <HiOutlinePlus className="w-5 h-5" />
                    </button>
                  )}
                </div>
                {showAllAddresses || !location.state?.selectedAddressId || !selectedAddress ? (
                  addresses.length > 1 ? (
                    <div className="space-y-2">
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
                            onChange={() => {
                              setSelectedAddressId(addr.client_address_id);
                              setShowAllAddresses(false);
                            }}
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
                      <p className="text-sm text-gray-700 mt-1">{selectedAddress.name_received}</p>
                      <p className="text-sm text-gray-600">
                        {selectedAddress.street} {selectedAddress.external_number}
                        {selectedAddress.internal_number ? ` Int. ${selectedAddress.internal_number}` : ''}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedAddress.neighborhood}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip_code}
                      </p>
                    </div>
                  )
                ) : (
                  <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                    <p className="font-semibold text-gray-900 text-sm">{selectedAddress.alias}</p>
                    <p className="text-sm text-gray-700 mt-1">{selectedAddress.name_received}</p>
                    <p className="text-sm text-gray-600">
                      {selectedAddress.street} {selectedAddress.external_number}
                      {selectedAddress.internal_number ? ` Int. ${selectedAddress.internal_number}` : ''}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedAddress.neighborhood}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip_code}
                    </p>
                  </div>
                )}
              </div>
            )}

            <CheckoutPaymentMethods
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              paymentMethods={paymentMethods}
              visaLogo={visaLogo}
              masterLogo={masterLogo}
              oxxoLogo={oxxoLogo}
              oxxoPm={oxxoPm}
              showCardForm={showCardForm}
              showOxxoMessage={showOxxoMessage}
              cardData={cardData}
              onCardDataChange={handleCardDataChange}
              saveCard={saveCard}
              onSaveCardChange={setSaveCard}
              acceptedTerms={acceptedTerms}
              onAcceptedTermsChange={setAcceptedTerms}
              isProcessing={isProcessing}
              onCheckout={handleCheckout}
              initialPayment={initialPayment}
            />
          </div>
        </div>
      </main>

      <AddAddressModal
        isOpen={isAddAddressModalOpen}
        onClose={() => setIsAddAddressModalOpen(false)}
        onSuccess={handleAddressSuccess}
      />

      <PaymentErrorModal
        isOpen={paymentError.isOpen}
        message={paymentError.message}
        onClose={() => setPaymentError({ isOpen: false, message: '' })}
      />

      <Footer />
    </div>
  );
};

export default Checkout;
