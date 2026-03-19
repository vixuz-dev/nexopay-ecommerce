import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
} from 'react-icons/hi2';
import { formatPriceMXN } from '../../utils/format';
import { ROUTES } from '../../utils/routes';
import { MercadoPagoCardForm } from './MercadoPagoCardForm';
import { MERCADO_PAGO_PUBLIC_KEY } from '../../constants/app';

export const CheckoutPaymentMethods = ({
  paymentMethod,
  onPaymentMethodChange,
  paymentMethods,
  visaLogo,
  masterLogo,
  oxxoLogo,
  oxxoPm,
  showCardForm,
  showOxxoMessage,
  cardData,
  onCardDataChange,
  saveCard,
  onSaveCardChange,
  acceptedTerms,
  onAcceptedTermsChange,
  isProcessing,
  onCheckout,
  initialPayment,
}) => {
  const cardFormRef = useRef(null);
  const useMercadoPagoForm = Boolean(MERCADO_PAGO_PUBLIC_KEY);

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0'),
  }));

  const years = Array.from({ length: 10 }, (_, i) => ({
    value: String(new Date().getFullYear() + i),
    label: String(new Date().getFullYear() + i),
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Método de Pago</h3>

      <div className="space-y-3 mb-6">
        <label
          className={`flex gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
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
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-600 focus:ring-primary-500"
          />
          <div className="flex-1 min-w-0">
            <span className="font-medium text-gray-900 block">Tarjeta de crédito o débito</span>
            <div className="flex gap-2 mt-2">
              {visaLogo && <img src={visaLogo} alt="" className="h-7 w-10 object-contain" />}
              {masterLogo && <img src={masterLogo} alt="" className="h-7 w-10 object-contain" />}
            </div>
          </div>
        </label>

        {/* OXXO - Oculto por ahora
        {oxxoPm && (
          <label
            className={`flex gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
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
              onChange={(e) => onPaymentMethodChange(e.target.value)}
              className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-600 focus:ring-primary-500"
            />
            <div className="flex-1 min-w-0">
              <span className="font-medium text-gray-900 block">Efectivo en OXXO</span>
              {oxxoLogo && (
                <img src={oxxoLogo} alt="" className="h-12 w-20 object-contain mt-2" />
              )}
            </div>
          </label>
        )}
        */}

        {paymentMethods.length === 0 && (
          <div className="p-4 text-center text-gray-500 text-sm">
            Cargando métodos de pago...
          </div>
        )}
      </div>

      {showCardForm && (
        <div className="space-y-4 mb-6 pt-4 border-t border-gray-200">
          {useMercadoPagoForm ? (
            <MercadoPagoCardForm
              ref={cardFormRef}
              cardholderName={cardData.cardHolder}
              onCardholderChange={(v) => onCardDataChange('cardHolder', v)}
              disabled={isProcessing}
            />
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de tarjeta
                </label>
                <input
                  type="text"
                  value={cardData.cardNumber}
                  onChange={(e) => onCardDataChange('cardNumber', e.target.value.replace(/\D/g, '').slice(0, 16))}
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
                  onChange={(e) => onCardDataChange('cardHolder', e.target.value.toUpperCase())}
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
                      onChange={(e) => onCardDataChange('expiryMonth', e.target.value)}
                      className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    >
                      <option value="">MM</option>
                      {months.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                    <select
                      value={cardData.expiryYear}
                      onChange={(e) => onCardDataChange('expiryYear', e.target.value)}
                      className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    >
                      <option value="">AA</option>
                      {years.map((y) => (
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
                    onChange={(e) => onCardDataChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="123"
                  />
                </div>
              </div>
            </>
          )}

          <label className="hidden flex items-start gap-3 p-4 bg-blue-50 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={saveCard}
              onChange={(e) => onSaveCardChange(e.target.checked)}
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

      {/* OXXO message - Oculto por ahora
      {showOxxoMessage && (
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
      */}

      <label className="flex items-start gap-3 mb-6 cursor-pointer">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => onAcceptedTermsChange(e.target.checked)}
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

      <button
        type="button"
        onClick={async () => {
          if (showCardForm && useMercadoPagoForm && cardFormRef.current) {
            const tokenResult = await cardFormRef.current.getToken();
            if (tokenResult) onCheckout(tokenResult);
          } else {
            onCheckout();
          }
        }}
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
            Pagar {formatPriceMXN(initialPayment)}
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
        <HiOutlineShieldCheck className="w-4 h-4" />
        <span>Pago seguro con encriptación SSL</span>
      </div>
    </div>
  );
};
