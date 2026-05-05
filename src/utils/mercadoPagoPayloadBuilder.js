/**
 * Fecha de entrega por defecto para el body de pago inicial (mp_generate_payment).
 * @param {number} addDays
 * @returns {string} Formato YYYY-MM-DD HH:mm:ss
 */
export const buildDefaultDeliveryDateString = (addDays = 14) => {
  const d = new Date();
  d.setDate(d.getDate() + addDays);
  d.setHours(10, 0, 0, 0);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};

/**
 * Body completo para pago inicial de checkout (is_initial_payment: true).
 * Debe cumplir transaction_amount === totalInitialPayment.
 *
 * @param {Object} params
 * @param {number} params.clientId
 * @param {string} params.token
 * @param {string} [params.paymentMethodId] - p. ej. debvisa, debmaster (desde get-payment-methods-mp)
 * @param {string} [params.paymentTypeId] - p. ej. debit_card
 * @param {string} [params.payerEmail]
 * @param {number} params.transactionAmount
 * @param {number} params.totalInitialPayment
 * @param {Object} params.orderPayload - Resultado de buildOrderPayload
 * @param {string} [params.deliveryDate]
 * @returns {Object} Payload para MERCADO_PAGO.GENERATE_PAYMENT
 */
export const buildInitialCheckoutMpPaymentPayload = ({
  clientId,
  token,
  paymentMethodId,
  paymentTypeId,
  payerEmail,
  transactionAmount,
  totalInitialPayment,
  orderPayload,
  deliveryDate,
}) => {
  const tx = Number(transactionAmount);
  const totalInit = Number(totalInitialPayment);
  return {
    client_id: Number(clientId),
    token,
    id: paymentMethodId || 'debvisa',
    payment_type_id: paymentTypeId || 'debit_card',
    is_initial_payment: true,
    transaction_amount: tx,
    total: orderPayload.total,
    totalProductQuantity: orderPayload.totalProductQuantity,
    totalInitialPayment: totalInit,
    deliveryDate: deliveryDate ?? buildDefaultDeliveryDateString(),
    deliveryAddress: orderPayload.deliveryAddress,
    detailOrder: orderPayload.detailOrder,
    payer: {
      email: payerEmail || '',
    },
  };
};

/**
 * Abonos / pago mensual (is_initial_payment: false)
 *
 * @param {Object} params
 * @param {number} params.clientId - Client ID from user store
 * @param {number} params.transactionAmount - Installment amount
 * @param {string} params.token - Card token
 * @param {string} params.paymentMethodId - e.g. "debvisa", "debmaster"
 * @param {string} params.paymentTypeId - e.g. "debit_card"
 * @param {string} params.payerEmail - Payer email from user store
 * @returns {Object} - Payload for mp-generate-payment
 */
export const buildMercadoPagoPaymentPayload = ({
  clientId,
  transactionAmount,
  token,
  paymentMethodId,
  paymentTypeId,
  payerEmail,
}) => {
  return {
    client_id: Number(clientId),
    is_initial_payment: false,
    transaction_amount: Number(transactionAmount),
    token,
    id: paymentMethodId || 'debvisa',
    payment_type_id: paymentTypeId || 'debit_card',
    payer: {
      email: payerEmail || '',
    },
  };
};
