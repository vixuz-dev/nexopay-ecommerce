import React, { useState, useImperativeHandle, forwardRef } from 'react';
import {
  CardNumber,
  ExpirationDate,
  SecurityCode,
  createCardToken,
} from '@mercadopago/sdk-react';

export const MercadoPagoCardForm = forwardRef(({
  cardholderName,
  onCardholderChange,
  disabled,
  onError,
}, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = async () => {
    if (!cardholderName?.trim()) {
      const msg = 'Ingresa el nombre como aparece en la tarjeta';
      setError(msg);
      onError?.(msg);
      return null;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await createCardToken({
        cardholderName: cardholderName.trim(),
      });
      if (result?.id) {
        return {
          token: result.id,
          payment_method_id: result.payment_method_id ?? result.paymentMethodId,
          payment_type_id: result.payment_type_id ?? result.paymentTypeId ?? 'credit_card',
        };
      }
      const msg = 'No se pudo generar el token. Verifica los datos de la tarjeta.';
      setError(msg);
      onError?.(msg);
      return null;
    } catch (err) {
      const msg = err?.message || 'Error al procesar la tarjeta. Intenta de nuevo.';
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
    <form id="mp-card-form" onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número de tarjeta
        </label>
        <div className="mp-secure-field w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
          <CardNumber placeholder="1234 5678 9012 3456" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre en la tarjeta
        </label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => onCardholderChange(e.target.value.toUpperCase())}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="JUAN PÉREZ"
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vencimiento
          </label>
          <div className="mp-secure-field w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
            <ExpirationDate placeholder="MM/AA" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVV
          </label>
          <div className="mp-secure-field w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
            <SecurityCode placeholder="123" />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {isLoading && (
        <p className="text-sm text-gray-600">Procesando...</p>
      )}
    </form>
  );
});

MercadoPagoCardForm.displayName = 'MercadoPagoCardForm';
