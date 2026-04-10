import { useState, useEffect } from 'react';
import { HiOutlineXMark, HiOutlineCreditCard } from 'react-icons/hi2';
import { CheckoutPaymentMethods, PaymentErrorModal } from '../checkout';
import usePaymentMethodsStore from '../../stores/paymentMethodsStore';
import useUserStore from '../../stores/userStore';
import useToastStore from '../../stores/toastStore';
import { buildMercadoPagoPaymentPayload } from '../../utils/mercadoPagoPayloadBuilder';
import { mercadoPagoService } from '../../api/services/mercadoPagoService';

const PaymentModal = ({ isOpen, onClose, amount, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState({ isOpen: false, message: '' });
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });

  const user = useUserStore((s) => s.user);
  const showToast = useToastStore((s) => s.showToast);
  const paymentMethods = usePaymentMethodsStore((s) => s.paymentMethods);
  const fetchPaymentMethods = usePaymentMethodsStore((s) => s.fetchPaymentMethods);

  useEffect(() => {
    if (isOpen) {
      fetchPaymentMethods().catch(() => {});
    }
  }, [isOpen, fetchPaymentMethods]);

  useEffect(() => {
    if (!isOpen) {
      setAcceptedTerms(false);
      setSaveCard(false);
      setPaymentError({ isOpen: false, message: '' });
    }
  }, [isOpen]);

  const visaPm = paymentMethods.find((pm) => pm.id === 'visa' || pm.id === 'debvisa');
  const masterPm = paymentMethods.find((pm) => pm.id === 'master' || pm.id === 'debmaster');
  const visaLogo = visaPm?.secure_thumbnail || visaPm?.thumbnail;
  const masterLogo = masterPm?.secure_thumbnail || masterPm?.thumbnail;

  const handleCardDataChange = (field, value) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckout = async (cardTokenResult) => {
    if (!acceptedTerms) {
      showToast('Por favor acepta los términos y condiciones', 'error');
      return;
    }

    if (!user?.client_id) {
      showToast('No se encontró la información del usuario. Inicia sesión nuevamente.', 'error');
      return;
    }

    if (!user?.email) {
      showToast('No se encontró el correo del usuario. Actualiza tu perfil.', 'error');
      return;
    }

    const numericAmount = Number(amount) || 0;
    if (numericAmount <= 0) {
      showToast('El monto a pagar no es válido', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const token = typeof cardTokenResult === 'string' ? cardTokenResult : cardTokenResult.token;
      const paymentMethodId = typeof cardTokenResult === 'object' ? (cardTokenResult.payment_method_id ?? 'master') : 'master';
      const paymentTypeId = typeof cardTokenResult === 'object' ? (cardTokenResult.payment_type_id ?? 'credit_card') : 'credit_card';

      const payload = buildMercadoPagoPaymentPayload({
        clientId: user.client_id,
        isInitialPayment: false,
        orderId: null,
        transactionAmount: numericAmount,
        token,
        paymentMethodId,
        paymentTypeId,
        payerEmail: user.email,
      });

      await mercadoPagoService.generatePayment(payload);
      showToast('Pago realizado correctamente', 'success');
      onSuccess?.();
      onClose();
    } catch (err) {
      setPaymentError({
        isOpen: true,
        message: err?.message || 'Error al procesar el pago. Intenta de nuevo.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-lg w-full my-8 max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-shrink-0 bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <HiOutlineCreditCard className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Pagar cuotas pendientes</h2>
                <p className="text-sm text-gray-600">Total a pagar: {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(amount)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={isProcessing}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              aria-label="Cerrar"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <CheckoutPaymentMethods
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              paymentMethods={paymentMethods}
              visaLogo={visaLogo}
              masterLogo={masterLogo}
              oxxoLogo={null}
              oxxoPm={null}
              showCardForm={paymentMethod === 'card'}
              showOxxoMessage={false}
              cardData={cardData}
              onCardDataChange={handleCardDataChange}
              saveCard={saveCard}
              onSaveCardChange={setSaveCard}
              acceptedTerms={acceptedTerms}
              onAcceptedTermsChange={setAcceptedTerms}
              isProcessing={isProcessing}
              onCheckout={handleCheckout}
              initialPayment={amount}
            />
          </div>
        </div>
      </div>

      <PaymentErrorModal
        isOpen={paymentError.isOpen}
        message={paymentError.message}
        onClose={() => setPaymentError({ isOpen: false, message: '' })}
      />
    </>
  );
};

export default PaymentModal;
