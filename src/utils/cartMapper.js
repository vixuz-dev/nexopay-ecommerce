import { CHECKOUT_CONFIG } from '../constants/checkoutConfig';

/**
 * Maps API cart item to cartStore item format.
 * When the API sends `selectedProductVariantId` with a `productVariants` list, root fields may
 * describe a catalog default variant; pricing, stock, image and attributes are taken from the
 * matching variant entry.
 * @param {Object} apiItem - Cart item from get_cart API
 * @returns {Object} - Item for cartStore
 */
const getImageUrl = (img) => {
  if (typeof img === 'string') return img;
  if (img && img.url) return img.url;
  if (img && img.image) return typeof img.image === 'string' ? img.image : img.image?.url;
  return null;
};

/**
 * URL de imagen para una línea del carrito a partir del objeto producto/variante
 * (p. ej. lo que envía ProductDetail al añadir al carrito). Prioriza assets de la variante.
 * @param {Object|null|undefined} product
 * @returns {string|null}
 */
export const resolveCartLineImageFromProduct = (product) => {
  if (!product) return null;
  const fromVariantUrl = getImageUrl(product.variantImageUrl);
  if (fromVariantUrl) return fromVariantUrl;
  if (Array.isArray(product.images) && product.images.length > 0) {
    const u = getImageUrl(product.images[0]);
    if (u) return u;
  }
  if (Array.isArray(product.imagesVariant) && product.imagesVariant.length > 0) {
    const u = getImageUrl(product.imagesVariant[0]);
    if (u) return u;
  }
  return getImageUrl(product.image ?? product.imageUrl);
};

export const mapApiCartItemToStore = (apiItem) => {
  const id = apiItem.productId ?? apiItem.product_id ?? apiItem.id;
  const name = apiItem.productName ?? apiItem.product_name ?? apiItem.name ?? '';
  const quantity = Number(apiItem.quantity ?? apiItem.qty ?? 1) || 1;

  const selectedVariantId =
    apiItem.selectedProductVariantId ?? apiItem.selected_product_variant_id ?? null;
  const variantsList = Array.isArray(apiItem.productVariants) ? apiItem.productVariants : [];
  const selectedVariant =
    selectedVariantId != null
      ? variantsList.find((v) => Number(v.productVariantId) === Number(selectedVariantId))
      : null;

  const pricingSource = selectedVariant || apiItem;

  const unitPrice =
    Number(
      pricingSource.finalPrice ??
        pricingSource.price ??
        pricingSource.unitPrice ??
        apiItem.finalPrice ??
        0
    ) || 0;
  const total = unitPrice * quantity;

  const unitInitialPayment =
    pricingSource.initialPaymentCost != null && pricingSource.remainingBalance != null
      ? pricingSource.initialPaymentCost
      : unitPrice * CHECKOUT_CONFIG.INITIAL_PAYMENT_PERCENT;
  const unitDeferredAmount =
    pricingSource.remainingBalance != null
      ? pricingSource.remainingBalance
      : unitPrice - unitInitialPayment;

  const image = selectedVariant
    ? getImageUrl(
        selectedVariant.variantImageUrl ??
          (Array.isArray(selectedVariant.images) ? selectedVariant.images[0] : null) ??
          (Array.isArray(selectedVariant.imagesVariant) ? selectedVariant.imagesVariant[0] : null) ??
          apiItem.variantImageUrl ??
          apiItem.images?.[0]
      )
    : getImageUrl(apiItem.image ?? apiItem.imageUrl ?? apiItem.variantImageUrl ?? apiItem.images?.[0]);

  const size = apiItem.size ?? apiItem.variant ?? 'Estándar';

  const attributes =
    selectedVariant?.attributes?.length > 0
      ? selectedVariant.attributes
      : apiItem.attributes ?? [];

  const stock = selectedVariant?.stock ?? apiItem.stock ?? 999;

  const originalPriceFallback =
    pricingSource.initialPaymentCost != null && pricingSource.remainingBalance != null
      ? pricingSource.initialPaymentCost + pricingSource.remainingBalance
      : apiItem.initialPaymentCost != null && apiItem.remainingBalance != null
        ? apiItem.initialPaymentCost + apiItem.remainingBalance
        : null;

  const effectiveProductVariantId =
    selectedVariantId != null
      ? selectedVariantId
      : apiItem.productVariantId ?? apiItem.product_variant_id ?? null;

  return {
    id,
    name,
    image,
    price: unitPrice,
    originalPrice: pricingSource.originalPrice ?? originalPriceFallback,
    discount: apiItem.discount ?? null,
    category: apiItem.categoryName ?? apiItem.category ?? null,
    categoryId: apiItem.categoryId ?? apiItem.category_id ?? null,
    subcategoryId: apiItem.subcategoryId ?? apiItem.subcategory_id ?? null,
    size,
    stock,
    quantity,
    total,
    unitInitialPayment,
    unitDeferredAmount,
    productVariantId: effectiveProductVariantId,
    attributes,
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
