/**
 * Identifica si dos líneas del carrito son la misma (mismo producto y misma variante).
 * Si hay productVariantId en ambos lados, solo ese par (productId + variantId) define la línea.
 * Si no hay variante persistida, se usa productId + size (comportamiento previo).
 *
 * @param {Object} item — línea en el carrito
 * @param {{ productId: string|number, size?: string|null, productVariantId?: string|number|null }} query
 * @returns {boolean}
 */
export function isSameCartLine(item, { productId, size, productVariantId }) {
  if (String(item.id) !== String(productId)) return false;

  const incomingPv =
    productVariantId != null && productVariantId !== ''
      ? Number(productVariantId)
      : null;
  const itemPv =
    item.productVariantId != null && item.productVariantId !== ''
      ? Number(item.productVariantId)
      : null;

  if (incomingPv != null && !Number.isNaN(incomingPv) && itemPv != null && !Number.isNaN(itemPv)) {
    return itemPv === incomingPv;
  }

  const normalizedSize = size || 'Estándar';
  return item.size === normalizedSize;
}
