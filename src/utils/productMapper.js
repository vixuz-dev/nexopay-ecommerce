/**
 * Maps API product response to component-expected format
 * @param {Object} apiProduct - Product from API
 * @returns {Object} - Mapped product for components
 */
export const mapApiProductToComponent = (apiProduct) => {
  // Handle images: can be array of strings or array of objects with url
  const getImageUrl = (image) => {
    if (typeof image === 'string') return image;
    if (image && image.url) return image.url;
    return null;
  };

  const firstImage = apiProduct.images && apiProduct.images.length > 0 
    ? getImageUrl(apiProduct.images[0])
    : null;

  const mainImage = firstImage || 
    (apiProduct.variantImageUrl && typeof apiProduct.variantImageUrl === 'string'
      ? apiProduct.variantImageUrl
      : apiProduct.variantImageUrl && apiProduct.variantImageUrl.image
      ? apiProduct.variantImageUrl.image
      : null);

  const originalPrice = apiProduct.initialPaymentCost && apiProduct.remainingBalance
    ? apiProduct.initialPaymentCost + apiProduct.remainingBalance
    : null;

  const finalPrice = apiProduct.finalPrice || apiProduct.remainingBalance || 0;

  const discount = originalPrice && finalPrice && originalPrice > finalPrice
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : null;

  return {
    id: apiProduct.productId,
    name: apiProduct.productName,
    price: finalPrice,
    originalPrice: originalPrice,
    discount: discount,
    image: mainImage,
    images: apiProduct.images ? apiProduct.images.map(img => {
      if (typeof img === 'string') return img;
      return img.url || null;
    }).filter(Boolean) : [],
    category: apiProduct.categoryName,
    categoryId: apiProduct.categoryId ?? apiProduct.category_id ?? null,
    subcategoryId: apiProduct.subcategoryId ?? apiProduct.subcategory_id ?? null,
    subcategoryName: apiProduct.subcategoryName,
    description: apiProduct.productDescription,
    inStock: apiProduct.stock > 0,
    stock: apiProduct.stock,
    rating: null,
    affiliate: apiProduct.affiliate,
    affiliateId: apiProduct.affiliateId,
    attributes: apiProduct.attributes || [],
    allAttributes: apiProduct.allAttributes || [],
    productVariantId: apiProduct.productVariantId,
    productCondition: apiProduct.productCondition,
    initialPaymentCost: apiProduct.initialPaymentCost,
    remainingBalance: apiProduct.remainingBalance,
    variantImageUrl: apiProduct.variantImageUrl,
    imagesVariant: apiProduct.imagesVariant || [],
    isSimpleProduct: apiProduct.isSimpleProduct,
    productVariants: apiProduct.productVariants || [],
  };
};

/**
 * Maps similar products API response to component-expected format
 * API returns: productId, productVariantId, discountPercentage, imageUrl, category, name, currentPrice, originalPrice, monthlyPaymentOption
 * @param {Object} apiProduct - Product from get_similar_products API
 * @returns {Object} - Mapped product for ProductCard
 */
export const mapSimilarProductToComponent = (apiProduct) => {
  const id = apiProduct.productId ?? apiProduct.id;
  const name = apiProduct.name ?? apiProduct.productName;
  const price = apiProduct.currentPrice ?? apiProduct.price ?? apiProduct.finalPrice ?? 0;
  const originalPrice = apiProduct.originalPrice ?? null;
  const discount = apiProduct.discountPercentage ?? apiProduct.discount ?? null;
  const image = apiProduct.imageUrl ?? apiProduct.image ?? apiProduct.variantImageUrl ?? null;

  return {
    id,
    name,
    price,
    originalPrice,
    discount: discount != null ? Number(discount) : null,
    image,
    images: image ? [image] : [],
    category: apiProduct.category ?? apiProduct.categoryName ?? null,
    categoryId: apiProduct.categoryId ?? apiProduct.category_id ?? null,
    subcategoryId: apiProduct.subcategoryId ?? apiProduct.subcategory_id ?? null,
    productVariantId: apiProduct.productVariantId ?? apiProduct.product_variant_id ?? null,
    attributes: apiProduct.attributes || [],
    monthlyPaymentOption: apiProduct.monthlyPaymentOption ?? null,
    inStock: true,
  };
};

