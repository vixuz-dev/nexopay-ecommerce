/**
 * Builds the payload for Mercado Pago generate payment API
 * Supports initial payment (checkout) and installment payments (abonos)
 *
 * @param {Object} params
 * @param {number} params.clientId - Client ID from user store
 * @param {boolean} params.isInitialPayment - true for initial purchase, false for installments
 * @param {number|null} params.orderId - Numeric order ID from create_order (only for initial payment)
 * @param {number} params.transactionAmount - Amount to charge (initial payment only, or installment amount)
 * @param {string} params.token - Card token from Mercado Pago SDK
 * @param {string} params.paymentMethodId - Payment method id (e.g. "master", "visa")
 * @param {string} params.paymentTypeId - Payment type (e.g. "credit_card")
 * @param {string} params.payerEmail - Payer email from user store
 * @returns {Object} - Payload for mp-generate-payment
 */
export const buildMercadoPagoPaymentPayload = ({
  clientId,
  isInitialPayment,
  orderId,
  transactionAmount,
  token,
  paymentMethodId,
  paymentTypeId,
  payerEmail,
}) => {
  const payload = {
    client_id: Number(clientId),
    is_initial_payment: Boolean(isInitialPayment),
    transaction_amount: Number(transactionAmount),
    token,
    id: paymentMethodId || 'master',
    payment_type_id: paymentTypeId || 'credit_card',
    payer: {
      email: payerEmail || '',
    },
  };

  if (isInitialPayment) {
    const numOrderId = orderId != null ? Number(orderId) : NaN;
    if (!Number.isNaN(numOrderId)) {
      payload.order_id = numOrderId;
    }
  }

  return payload;
};
