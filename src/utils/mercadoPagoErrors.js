/**
 * Mensajes de error de Mercado Pago para status_detail.
 * Cuando el response tiene status: "rejected", buscar status_detail aquí para mostrar el mensaje al usuario.
 */

const STATUS_TO_USER_MESSAGE = {
  cc_rejected_insufficient_amount: 'Fondos insuficientes en la tarjeta. Intenta con otro método de pago.',
  cc_rejected_other_reason: 'La tarjeta fue rechazada. Verifica los datos o intenta con otra tarjeta.',
  cc_rejected_bad_filled_card_number: 'Número de tarjeta incorrecto o incompleto. Verifica e intenta de nuevo.',
  cc_rejected_bad_filled_date: 'Fecha de vencimiento incorrecta. Verifica e intenta de nuevo.',
  cc_rejected_bad_filled_security_code: 'Código de seguridad (CVV) incorrecto. Verifica e intenta de nuevo.',
  cc_rejected_bad_filled_other: 'Revisa los datos ingresados e intenta de nuevo.',
  cc_rejected_card_disabled: 'La tarjeta está bloqueada o no permite pagos en línea.',
  cc_rejected_max_attempts: 'Demasiados intentos fallidos. Intenta más tarde.',
  cc_rejected_invalid_installments: 'La tarjeta no soporta el plan de pagos seleccionado.',
  cc_rejected_duplicated_payment: 'Transacción duplicada detectada.',
  cc_rejected_call_for_authorize: 'Contacta a tu banco para autorizar el pago.',
  cc_rejected_high_risk: 'La tarjeta fue rechazada. Verifica los datos o intenta con otra tarjeta.',
  cc_rejected_blacklist: 'No se pudo procesar el pago.',
};

/**
 * Obtiene el mensaje amigable para el usuario según el status_detail del response.
 * @param {string} statusDetail - status_detail del response (ej: "cc_rejected_insufficient_amount").
 * @returns {string} Mensaje amigable para mostrar al usuario.
 */
export const getMercadoPagoErrorMessage = (statusDetail) => {
  if (!statusDetail || typeof statusDetail !== 'string') {
    return 'El pago fue rechazado. Intenta con otro método de pago.';
  }
  return (
    STATUS_TO_USER_MESSAGE[statusDetail.trim()] ??
    'El pago fue rechazado. Intenta con otro método de pago.'
  );
};
