/**
 * Checkout and payment configuration.
 * Centralizes percentages, shipping, and financing options for easy adjustment.
 */
export const CHECKOUT_CONFIG = {
  INITIAL_PAYMENT_PERCENT: 0.30,
  DEFERRED_PAYMENT_PERCENT: 0.70, // Informational: deferred = total - initial
  DEFAULT_DEFERRAL_MONTHS: 6,
  DEFERRAL_MONTHS_OPTIONS: [3, 6, 9, 12],
  SHIPPING_COST: 200,
  FREE_SHIPPING_THRESHOLD: 5000,
  PRODUCT_CARD_MONTHLY_INSTALLMENTS: 6,
  PRODUCT_DETAIL_MONTHLY_INSTALLMENTS: 12,
};

export const getShippingCost = (subtotal) => {
  const { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } = CHECKOUT_CONFIG;
  if (FREE_SHIPPING_THRESHOLD != null && subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return SHIPPING_COST;
};
