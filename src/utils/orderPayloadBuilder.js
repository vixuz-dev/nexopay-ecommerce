/**
 * Builds the payload for create_order API
 * @param {Object} params
 * @param {Array} params.items - Cart items
 * @param {number} params.totalAmount - Total purchase (subtotal + shipping)
 * @param {number} params.deferralMonths
 * @param {Object} params.deliveryAddress - Address from get_addresses (snake_case)
 * @returns {Object} - Payload for create_order
 */
export const buildOrderPayload = ({ items, totalAmount, deferralMonths, deliveryAddress }) => {
  const totalProductQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const deliveryAddressPayload = deliveryAddress
    ? {
        nameReceived: deliveryAddress.name_received || deliveryAddress.nameReceived || '',
        phoneReceived: String(deliveryAddress.phone_received || deliveryAddress.phoneReceived || deliveryAddress.phone || ''),
        deliveryStreet: deliveryAddress.street || deliveryAddress.deliveryStreet || '',
        deliveryExternalNumber: String(deliveryAddress.external_number || deliveryAddress.externalNumber || deliveryAddress.deliveryExternalNumber || ''),
        deliveryInternalNumber: String(deliveryAddress.internal_number ?? deliveryAddress.internalNumber ?? deliveryAddress.deliveryInternalNumber ?? ''),
        deliveryNeighborhood: deliveryAddress.neighborhood || deliveryAddress.deliveryNeighborhood || '',
        deliveryCity: deliveryAddress.city || deliveryAddress.deliveryCity || '',
        deliveryState: deliveryAddress.state || deliveryAddress.deliveryState || '',
        deliveryZipCode: String(deliveryAddress.zip_code || deliveryAddress.zipCode || deliveryAddress.deliveryZipCode || ''),
        deliveryReferences: String(deliveryAddress.address_references ?? deliveryAddress.addressReferences ?? deliveryAddress.deliveryReferences ?? ''),
      }
    : null;

  const detailOrder = items.map((item) => {
    const attributes = Array.isArray(item.attributes) && item.attributes.length > 0
      ? item.attributes
      : (item.size && item.size !== 'Estándar' ? [{ name: 'talla', value: item.size }] : []);

    const productVariantId = item.productVariantId != null ? Number(item.productVariantId) : null;

    return {
      productId: Number(item.id),
      productVariantId,
      productName: item.name,
      quantity: Number(item.quantity),
      numberPayments: deferralMonths,
      attributes,
    };
  });

  return {
    totalProductQuantity,
    total: Math.round(totalAmount),
    deliveryAddress: deliveryAddressPayload,
    detailOrder,
  };
};

/**
 * Checks if an existing preOrder matches the current cart (same products, same quantities)
 * @param {Object|null} preOrder - Stored pre-order with payload
 * @param {Array} items - Current cart items
 * @returns {boolean}
 */
export const doesPreOrderMatchCart = (preOrder, items) => {
  if (!preOrder?.payload?.detailOrder) return false;

  const { totalProductQuantity, detailOrder } = preOrder.payload;
  const currentTotal = items.reduce((sum, item) => sum + item.quantity, 0);

  if (totalProductQuantity !== currentTotal) return false;
  if (detailOrder.length !== items.length) return false;

  const toKey = (item) => {
    const pid = Number(item.productId ?? item.id);
    const vid = item.productVariantId != null ? Number(item.productVariantId) : pid;
    return `${pid}-${vid}-${Number(item.quantity)}`;
  };

  const storedKeys = detailOrder.map(toKey).sort();
  const cartKeys = items.map((item) => toKey({
    productId: item.id,
    productVariantId: item.productVariantId,
    quantity: item.quantity,
  })).sort();

  return storedKeys.every((k, i) => k === cartKeys[i]);
};
