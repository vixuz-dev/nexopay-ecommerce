import { CHECKOUT_CONFIG } from '../constants/checkoutConfig';

/**
 * Maps API cart item to cartStore item format
 * @param {Object} apiItem - Cart item from get_cart API
 * @returns {Object} - Item for cartStore
 */
const getImageUrl = (img) => {
  if (typeof img === 'string') return img;
  if (img && img.url) return img.url;
  if (img && img.image) return typeof img.image === 'string' ? img.image : img.image?.url;
  return null;
};

export const mapApiCartItemToStore = (apiItem) => {
  const id = apiItem.productId ?? apiItem.product_id ?? apiItem.id;
  const name = apiItem.productName ?? apiItem.product_name ?? apiItem.name ?? '';
  const quantity = Number(apiItem.quantity ?? apiItem.qty ?? 1) || 1;
  const unitPrice = Number(apiItem.price ?? apiItem.unitPrice ?? apiItem.finalPrice ?? apiItem.remainingBalance ?? 0) || 0;
  const total = unitPrice * quantity;

  const unitInitialPayment = apiItem.initialPaymentCost != null && apiItem.remainingBalance != null
    ? apiItem.initialPaymentCost
    : unitPrice * CHECKOUT_CONFIG.INITIAL_PAYMENT_PERCENT;
  const unitDeferredAmount = apiItem.remainingBalance != null
    ? apiItem.remainingBalance
    : unitPrice - unitInitialPayment;

  const image = getImageUrl(apiItem.image ?? apiItem.imageUrl ?? apiItem.variantImageUrl ?? apiItem.images?.[0]);
  const size = apiItem.size ?? apiItem.variant ?? 'Estándar';

  return {
    id,
    name,
    image,
    price: unitPrice,
    originalPrice: apiItem.originalPrice ?? (apiItem.initialPaymentCost != null && apiItem.remainingBalance != null ? apiItem.initialPaymentCost + apiItem.remainingBalance : null),
    discount: apiItem.discount ?? null,
    category: apiItem.categoryName ?? apiItem.category ?? null,
    categoryId: apiItem.categoryId ?? apiItem.category_id ?? null,
    subcategoryId: apiItem.subcategoryId ?? apiItem.subcategory_id ?? null,
    size,
    stock: apiItem.stock ?? 999,
    quantity,
    total,
    unitInitialPayment,
    unitDeferredAmount,
    productVariantId: apiItem.productVariantId ?? apiItem.product_variant_id ?? null,
    attributes: apiItem.attributes ?? [],
  };
};

/**
 * Maps API cart response to cartStore items array
 * API returns { statusCode, succes, statusMessage, body } where body is the array of cart items
 * @param {Array|Object} apiCart - Response from get_cart (body: array of items)
 * @returns {Array} - Items for cartStore
 */
export const mapApiCartToStoreItems = (apiCart) => {
  if (!apiCart) return [];

  const rawItems = Array.isArray(apiCart)
    ? apiCart
    : apiCart.items ?? apiCart.products ?? apiCart.cartItems ?? apiCart.cart_items ?? [];
  const itemsArray = Array.isArray(rawItems) ? rawItems : [];

  return itemsArray.map(mapApiCartItemToStore).filter((item) => item.id != null && item.name);
};
