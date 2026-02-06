import { getColorValue } from './colorUtils';

/**
 * Maps API product detail response to component-expected format for ProductDetail page
 * @param {Object} apiProduct - Product from API
 * @returns {Object} - Mapped product for ProductDetail component
 */
export const mapApiProductDetailToComponent = (apiProduct) => {
  if (!apiProduct) return null;

  const allImages = [];
  
  // Handle variantImageUrl: can be string or object with image property
  if (apiProduct.variantImageUrl) {
    const variantImg = typeof apiProduct.variantImageUrl === 'string' 
      ? apiProduct.variantImageUrl 
      : apiProduct.variantImageUrl.image;
    if (variantImg && !allImages.includes(variantImg)) {
      allImages.push(variantImg);
    }
  }
  
  // Handle images: can be array of strings or array of objects with url
  if (apiProduct.images && Array.isArray(apiProduct.images)) {
    apiProduct.images.forEach(img => {
      const imgUrl = typeof img === 'string' ? img : img.url;
      if (imgUrl && !allImages.includes(imgUrl)) {
        allImages.push(imgUrl);
      }
    });
  }

  // Handle imagesVariant: can be array of strings or array of objects with url
  if (apiProduct.imagesVariant && Array.isArray(apiProduct.imagesVariant)) {
    apiProduct.imagesVariant.forEach(img => {
      const imgUrl = typeof img === 'string' ? img : img.url;
      if (imgUrl && !allImages.includes(imgUrl)) {
        allImages.push(imgUrl);
      }
    });
  }

  const mainImage = allImages.length > 0 ? allImages[0] : null;

  const originalPrice = apiProduct.initialPaymentCost && apiProduct.remainingBalance
    ? apiProduct.initialPaymentCost + apiProduct.remainingBalance
    : null;

  const finalPrice = apiProduct.finalPrice || 0;

  const discount = originalPrice && finalPrice && originalPrice > finalPrice
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : null;

  const colors = [];
  const sizes = [];
  const allAttributesMap = {};

  if (apiProduct.allAttributes && Array.isArray(apiProduct.allAttributes)) {
    apiProduct.allAttributes.forEach(attrName => {
      allAttributesMap[attrName] = [];
    });
  }

  if (apiProduct.attributes && Array.isArray(apiProduct.attributes)) {
    apiProduct.attributes.forEach(attr => {
      if (attr.name && attr.value) {
        if (attr.name.toLowerCase() === 'color' || attr.name.toLowerCase() === 'colores') {
          const colorHex = getColorValue(attr.value);
          colors.push({ name: attr.value, value: colorHex });
        } else if (attr.name.toLowerCase() === 'talla' || attr.name.toLowerCase() === 'almacenamiento' || attr.name.toLowerCase() === 'size') {
          sizes.push(attr.value);
        }
        if (allAttributesMap[attr.name]) {
          if (!allAttributesMap[attr.name].includes(attr.value)) {
            allAttributesMap[attr.name].push(attr.value);
          }
        }
      }
    });
  }

  if (apiProduct.productVariants && Array.isArray(apiProduct.productVariants)) {
    apiProduct.productVariants.forEach(variant => {
      if (variant.attributes && Array.isArray(variant.attributes)) {
        variant.attributes.forEach(attr => {
          if (attr.name && attr.value) {
            if (attr.name.toLowerCase() === 'color' || attr.name.toLowerCase() === 'colores') {
              const colorExists = colors.some(c => c.name === attr.value);
              if (!colorExists) {
                const colorHex = getColorValue(attr.value);
                colors.push({ name: attr.value, value: colorHex });
              }
            } else if (attr.name.toLowerCase() === 'talla' || attr.name.toLowerCase() === 'almacenamiento' || attr.name.toLowerCase() === 'size') {
              if (!sizes.includes(attr.value)) {
                sizes.push(attr.value);
              }
            }
            if (allAttributesMap[attr.name]) {
              if (!allAttributesMap[attr.name].includes(attr.value)) {
                allAttributesMap[attr.name].push(attr.value);
              }
            }
          }
        });
      }
    });
  }

  return {
    id: apiProduct.productId,
    name: apiProduct.productName,
    price: finalPrice,
    originalPrice: originalPrice,
    discount: discount,
    image: mainImage,
    images: allImages,
    category: apiProduct.categoryName,
    categoryId: apiProduct.categoryId,
    subcategoryId: apiProduct.subcategoryId,
    subcategoryName: apiProduct.subcategoryName,
    description: apiProduct.productDescription,
    inStock: apiProduct.stock > 0,
    stock: apiProduct.stock,
    rating: null,
    affiliate: apiProduct.affiliate,
    affiliateId: apiProduct.affiliateId,
    attributes: apiProduct.attributes || [],
    allAttributes: apiProduct.allAttributes || [],
    allAttributesMap: allAttributesMap,
    productVariantId: apiProduct.productVariantId,
    productCondition: apiProduct.productCondition,
    initialPaymentCost: apiProduct.initialPaymentCost || 0,
    remainingBalance: apiProduct.remainingBalance || 0,
    variantImageUrl: apiProduct.variantImageUrl,
    imagesVariant: apiProduct.imagesVariant || [],
    isSimpleProduct: apiProduct.isSimpleProduct,
    productVariants: apiProduct.productVariants || [],
    variants: {
      colors: colors,
      sizes: sizes,
    },
  };
};

