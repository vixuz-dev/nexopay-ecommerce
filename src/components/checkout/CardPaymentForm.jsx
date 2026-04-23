/* eslint-disable react/prop-types -- props documentados con JSDoc */
import { useState, useImperativeHandle, forwardRef } from 'react';
import { mercadoPagoService } from '../../api/services/mercadoPagoService';
import { formatCardExpiryInput, parseCardExpiry } from '../../utils/format';

/**
 * Formulario de tarjeta (inputs propios). El token se genera en backend (`CREATE_CARD_TOKEN`).
 *
 * @param {{
 *   cardData: {
 *     cardNumber: string,
 *     cardHolder: string,
 *     expiry: string,
 *     cvv: string,
 *   },
 *   onCardDataChange: (field: string, value: string) => void,
 *   disabled?: boolean,
 *   onError?: (message: string) => void,
 * }} props
 */
export const CardPaymentForm = forwardRef(({
  cardData,
  onCardDataChange,
  disabled,
  onError,
}, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = async () => {
    const digits = cardData.cardNumber.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) {
      const msg = 'Ingresa un número de tarjeta válido';
      setError(msg);
      onError?.(msg);
      return null;
    }
    if (!cardData.cardHolder?.trim()) {
      const msg = 'Ingresa el nombre como aparece en la tarjeta';
      setError(msg);
      onError?.(msg);
      return null;
    }
    const parsedExpiry = parseCardExpiry(cardData.expiry);
    if (!parsedExpiry.ok) {
      setError(parsedExpiry.message);
      onError?.(parsedExpiry.message);
      return null;
    }
    const cvv = cardData.cvv.replace(/\D/g, '');
    if (cvv.length < 3 || cvv.length > 4) {
      const msg = 'Ingresa el código de seguridad (CVV)';
      setError(msg);
      onError?.(msg);
      return null;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { token } = await mercadoPagoService.createCardToken({
        cardNumber: digits,
        expirationMonth: parsedExpiry.expirationMonth,
        expirationYear: parsedExpiry.expirationYear,
        securityCode: cvv,
        cardholderName: cardData.cardHolder.trim(),
      });
      return {
        token,
        payment_method_id: 'master',
        payment_type_id: 'credit_card',
      };
    } catch (err) {
      const msg = err?.message || 'Error al tokenizar la tarjeta. Intenta de nuevo.';
      setError(msg);
      onError?.(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({ getToken }));

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form id="card-payment-form" onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número de tarjeta
        </label>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          value={cardData.cardNumber}
          onChange={(e) => onCardDataChange('cardNumber', e.target.value.replace(/\D/g, '').slice(0, 19))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="1234 5678 9012 3456"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre en la tarjeta
        </label>
        <input
          type="text"
          autoComplete="cc-name"
          value={cardData.cardHolder}
          onChange={(e) => onCardDataChange('cardHolder', e.target.value.toUpperCase())}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="JUAN PÉREZ"
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vencimiento (MM/AA)
          </label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="cc-exp"
            value={cardData.expiry}
            onChange={(e) => onCardDataChange('expiry', formatCardExpiryInput(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="MM/AA"
            maxLength={5}
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVV
          </label>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="cc-csc"
            value={cardData.cvv}
            onChange={(e) => onCardDataChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="123"
            disabled={disabled}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {isLoading && (
        <div className="flex justify-center py-2" aria-busy="true" aria-label="Procesando">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        </div>
      )}
    </form>
  );
});

CardPaymentForm.displayName = 'CardPaymentForm';
