import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useProductDetail } from '../hooks/useProductDetail';
import { useAddToCart } from '../hooks/useAddToCart';
import { mapApiProductDetailToComponent } from '../utils/productDetailMapper';
import useUIStore from '../stores/uiStore';
import { ROUTES, getProductsByCategoryUrl } from '../utils/routes';
import { 
  HiOutlineShoppingCart, 
  HiOutlineHeart, 
  HiOutlineArrowLeft,
  HiOutlineArrowLeftCircle,
  HiOutlineArrowRightCircle,
  HiOutlineCheckCircle,
  HiOutlineStar,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineCreditCard,
  HiOutlineXMark,
  HiOutlineBuildingStorefront
} from 'react-icons/hi2';
import ProductPlaceholder from '../components/common/ProductPlaceholder';
import { SimilarProducts, SellerProducts } from '../components/ecommerce';
import { CHECKOUT_CONFIG } from '../constants/checkoutConfig';
import { getColorValue } from '../utils/colorUtils';
import { formatProductCardPrice } from '../utils/format';

const MAX_VISIBLE_THUMBNAILS = 4;

const ProductDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useAddToCart();
  const openCartSidebar = useUIStore((state) => state.openCartSidebar);
  
  const productName = searchParams.get('name') || searchParams.get('productName');
  const categoryId = searchParams.get('categoryId');
  const subcategoryId = searchParams.get('subcategoryId');
  
  const { product: apiProduct, loading, error } = useProductDetail(productName, categoryId, subcategoryId);
  
  const product = useMemo(() => {
    if (!apiProduct) return null;
    return mapApiProductDetailToComponent(apiProduct);
  }, [apiProduct]);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({
    color: null,
    size: null,
  });
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const imageRef = React.useRef(null);
  /** Evita reinicializar la variante seleccionada al mismo productId (p. ej. refetch de SWR). */
  const initializedVariantForProductIdRef = React.useRef(null);

  const extractImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === 'string') return img;
    return img.url || img.image || null;
  };

  const buildImagesList = (source) => {
    const list = [];
    if (!source) return list;

    const mainImage = extractImageUrl(source.variantImageUrl);
    if (mainImage && !list.includes(mainImage)) {
      list.push(mainImage);
    }

    if (Array.isArray(source.images)) {
      source.images.forEach((img) => {
        const imgUrl = extractImageUrl(img);
        if (imgUrl && !list.includes(imgUrl)) {
          list.push(imgUrl);
        }
      });
    }

    if (Array.isArray(source.imagesVariant)) {
      source.imagesVariant.forEach((img) => {
        const imgUrl = extractImageUrl(img);
        if (imgUrl && !list.includes(imgUrl)) {
          list.push(imgUrl);
        }
      });
    }

    return list;
  };

  const getAllProductVariants = (p = product) => {
    if (!p) return [];

    const baseVariant = {
      productVariantId: p.productVariantId,
      productCondition: p.productCondition,
      stock: p.stock,
      initialPaymentCost: p.initialPaymentCost,
      remainingBalance: p.remainingBalance,
      finalPrice: p.price,
      variantImageUrl: p.variantImageUrl,
      attributes: Array.isArray(p.attributes) ? p.attributes : [],
      images: Array.isArray(p.images) ? p.images : [],
      imagesVariant: Array.isArray(p.imagesVariant) ? p.imagesVariant : [],
    };

    const extraVariants = Array.isArray(p.productVariants) ? p.productVariants : [];
    const seen = new Set();

    return [baseVariant, ...extraVariants].filter((variant) => {
      const id = variant?.productVariantId;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };

  useEffect(() => {
    if (!product?.id) return;
    if (initializedVariantForProductIdRef.current === product.id) return;

    initializedVariantForProductIdRef.current = product.id;

    const allVariants = getAllProductVariants(product);
    const first = allVariants[0];
    if (!first?.productVariantId) return;

    setSelectedVariantId(first.productVariantId);

    const next = { color: null, size: null };
    (first.attributes || []).forEach((attr) => {
      if (!attr?.name || attr.value == null) return;
      const n = attr.name.toLowerCase();
      if (n === 'color' || n === 'colores') {
        next.color = attr.value;
      } else if (n === 'talla' || n === 'almacenamiento' || n === 'size') {
        next.size = attr.value;
      }
    });
    setSelectedVariants(next);
    setSelectedImage(0);
    setModalImageIndex(0);
  }, [product?.id]);

  const getCurrentProductData = () => {
    const allVariants = getAllProductVariants();
    if (selectedVariantId && allVariants.length > 0) {
      const variant = allVariants.find(v => v.productVariantId === selectedVariantId);
      if (variant) {
        return {
          ...product,
          price: variant.finalPrice || variant.price || product.price,
          initialPaymentCost: variant.initialPaymentCost || product.initialPaymentCost,
          remainingBalance: variant.remainingBalance || product.remainingBalance,
          stock: variant.stock ?? product.stock,
          inStock: (variant.stock ?? 0) > 0,
          variantImageUrl: variant.variantImageUrl || product.variantImageUrl,
          productVariantId: variant.productVariantId,
        };
      }
    }
    return product;
  };

  const currentProduct = getCurrentProductData();

  const buildAttributes = () => {
    if (currentProduct?.productVariantId) {
      const variant = getAllProductVariants().find(
        (v) => v.productVariantId === currentProduct.productVariantId
      );
      if (variant?.attributes && Array.isArray(variant.attributes) && variant.attributes.length > 0) {
        return variant.attributes;
      }
    }
    if (product?.attributes && Array.isArray(product.attributes) && product.attributes.length > 0) {
      return product.attributes;
    }
    const attrs = [];
    if (selectedVariants.color) attrs.push({ name: 'Color', value: selectedVariants.color });
    if (selectedVariants.size) attrs.push({ name: 'Almacenamiento', value: selectedVariants.size });
    return attrs;
  };

  const handleAddToCart = () => {
    if (!product || !currentProduct?.inStock) return;
    const variantSize = selectedVariants.size || null;
    const attrs = buildAttributes();
    addToCart(currentProduct, quantity, variantSize, {
      productVariantId: currentProduct?.productVariantId,
      attributes: attrs,
    });
    openCartSidebar();
  };

  const handleBuyNow = () => {
    if (!product || !currentProduct?.inStock) return;
    const variantSize = selectedVariants.size || null;
    const attrs = buildAttributes();
    addToCart(currentProduct, quantity, variantSize, {
      productVariantId: currentProduct?.productVariantId,
      attributes: attrs,
    });
    navigate(ROUTES.CART);
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  useEffect(() => {
    if (!isImageModalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsImageModalOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isImageModalOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-1 sm:px-4 lg:px-8 py-12">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!productName) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-1 sm:px-4 lg:px-8 py-12">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no especificado</h2>
            <p className="text-gray-600 mb-6">Por favor, selecciona un producto desde el catálogo</p>
            <Link
              to={ROUTES.PRODUCTS}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <HiOutlineArrowLeft className="w-5 h-5" />
              Volver al catálogo
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-1 sm:px-4 lg:px-8 py-12">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
            <p className="text-gray-600 mb-6">{error || 'El producto que buscas no existe'}</p>
            <Link
              to={ROUTES.PRODUCTS}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <HiOutlineArrowLeft className="w-5 h-5" />
              Volver al catálogo
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const baseImages = buildImagesList(product);
  const selectedVariant = selectedVariantId
    ? getAllProductVariants().find((v) => v.productVariantId === selectedVariantId)
    : null;
  const variantImages = buildImagesList(selectedVariant);
  const images = variantImages.length > 0
    ? variantImages
    : (baseImages.length > 0 ? baseImages : (product.image ? [product.image] : [null]));
  
  const variants = product.variants || {};
  const colors = variants.colors || [];
  const sizes = variants.sizes || [];

  const handleVariantSelection = (variantType, value) => {
    const nextSelected = {
      ...selectedVariants,
      [variantType]: value,
    };
    setSelectedVariants(nextSelected);

    const allVariants = getAllProductVariants();
    if (allVariants.length === 0) return;

    const colorAttrName = product.allAttributes?.find(
      (a) => a.toLowerCase() === 'color' || a.toLowerCase() === 'colores'
    );
    const sizeAttrName = product.allAttributes?.find(
      (a) =>
        a.toLowerCase() === 'talla' ||
        a.toLowerCase() === 'almacenamiento' ||
        a.toLowerCase() === 'size'
    );

    let matchingVariant = allVariants.find((variant) => {
      if (!variant.attributes || !Array.isArray(variant.attributes)) return false;
      const variantAttrs = {};
      variant.attributes.forEach((attr) => {
        variantAttrs[attr.name] = attr.value;
      });

      if (colorAttrName && nextSelected.color != null) {
        if (variantAttrs[colorAttrName] !== nextSelected.color) return false;
      }
      if (sizeAttrName && nextSelected.size != null && nextSelected.size !== '') {
        if (variantAttrs[sizeAttrName] !== nextSelected.size) return false;
      }
      return true;
    });

    if (!matchingVariant && variantType === 'color' && colorAttrName) {
      matchingVariant = allVariants.find((v) =>
        v.attributes?.some((a) => a.name === colorAttrName && a.value === value)
      );
    }
    if (!matchingVariant && variantType === 'size' && sizeAttrName) {
      matchingVariant = allVariants.find((v) =>
        v.attributes?.some((a) => a.name === sizeAttrName && a.value === value)
      );
    }

    if (matchingVariant) {
      setSelectedVariantId(matchingVariant.productVariantId);
      setSelectedImage(0);
      setModalImageIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-1 sm:px-4 lg:px-8 py-8">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
            <li>
              <Link to={ROUTES.HOME} className="hover:text-primary-600 transition-colors">Inicio</Link>
            </li>
            <li>/</li>
            <li>
              <Link to={ROUTES.PRODUCTS} className="hover:text-primary-600 transition-colors">Productos</Link>
            </li>
            <li>/</li>
            {product.categoryId && (
              <li>
                <Link to={getProductsByCategoryUrl(product.categoryId)} className="hover:text-primary-600 transition-colors">
                  {product.category}
                </Link>
              </li>
            )}
            <li>/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4 lg:p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-6 space-y-4">
                <div className="flex gap-4 items-start">
                  {images.length > 1 && (
                    <div className="hidden md:flex flex-col gap-3 flex-shrink-0">
                      {(images.length > MAX_VISIBLE_THUMBNAILS ? images.slice(0, MAX_VISIBLE_THUMBNAILS) : images).map((img, index) => {
                        const isFourthWithMore = images.length > MAX_VISIBLE_THUMBNAILS && index === MAX_VISIBLE_THUMBNAILS - 1;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              if (isFourthWithMore) {
                                setModalImageIndex(MAX_VISIBLE_THUMBNAILS);
                                setIsImageModalOpen(true);
                              } else {
                                setSelectedImage(index);
                              }
                            }}
                            className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all bg-white ${
                              !isFourthWithMore && selectedImage === index
                                ? 'border-primary-600 ring-2 ring-primary-200 shadow-md'
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            {img && !img.includes('via.placeholder.com') ? (
                              <img 
                                src={img} 
                                alt={`${product.name} ${index + 1}`} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <ProductPlaceholder name={product.name} className="w-full h-full" />
                            )}
                            {isFourthWithMore && (
                              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-semibold text-sm rounded-lg">
                                +{images.length - MAX_VISIBLE_THUMBNAILS}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex-1 relative z-0">
                    <div 
                      className="relative aspect-square max-w-2xl overflow-hidden bg-white rounded-lg cursor-zoom-in lg:cursor-crosshair"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                    >
                      {images[selectedImage] && images[selectedImage] && !images[selectedImage].includes('via.placeholder.com') ? (
                        <>
                          <img
                            ref={imageRef}
                            src={images[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                          {isZooming && (
                            <div 
                              className="hidden lg:block absolute border-2 border-white shadow-lg pointer-events-none z-10"
                              style={{
                                width: '120px',
                                height: '120px',
                                left: `${zoomPosition.x}%`,
                                top: `${zoomPosition.y}%`,
                                transform: 'translate(-50%, -50%)',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(32, 142, 170, 0.1)',
                                boxShadow: '0 0 0 2px rgba(32, 142, 170, 0.3), 0 0 20px rgba(0, 0, 0, 0.2)'
                              }}
                            />
                          )}
                        </>
                      ) : (
                        <ProductPlaceholder name={product.name} className="w-full h-full" />
                      )}
                    </div>
                    {isZooming && images[selectedImage] && !images[selectedImage].includes('via.placeholder.com') && (
                      <div 
                        className="hidden lg:block absolute left-full top-0 ml-6 w-[500px] h-[500px] bg-white border border-gray-200 rounded-lg shadow-2xl z-20 pointer-events-none overflow-hidden"
                        style={{
                          backgroundImage: `url(${images[selectedImage]})`,
                          backgroundSize: '200%',
                          backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                    )}
                  </div>
                </div>

                {images.length > 1 && (
                  <div 
                    className="md:hidden flex gap-3 overflow-x-auto pb-2 scrollbar-hide" 
                    style={{ 
                      scrollbarWidth: 'none', 
                      msOverflowStyle: 'none'
                    }}
                  >
                    {(images.length > MAX_VISIBLE_THUMBNAILS ? images.slice(0, MAX_VISIBLE_THUMBNAILS) : images).map((img, index) => {
                      const isFourthWithMore = images.length > MAX_VISIBLE_THUMBNAILS && index === MAX_VISIBLE_THUMBNAILS - 1;
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            if (isFourthWithMore) {
                              setModalImageIndex(MAX_VISIBLE_THUMBNAILS);
                              setIsImageModalOpen(true);
                            } else {
                              setSelectedImage(index);
                            }
                          }}
                          className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                            !isFourthWithMore && selectedImage === index
                              ? 'border-primary-600 ring-2 ring-primary-200 shadow-md'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {img && !img.includes('via.placeholder.com') ? (
                            <img 
                              src={img} 
                              alt={`${product.name} ${index + 1}`} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <ProductPlaceholder name={product.name} className="w-full h-full" />
                          )}
                          {isFourthWithMore && (
                            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-semibold text-sm rounded-lg">
                              +{images.length - MAX_VISIBLE_THUMBNAILS}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className={`lg:col-span-1 space-y-4 relative z-10 transition-opacity duration-300 ${isZooming ? 'lg:opacity-0 lg:pointer-events-none' : 'opacity-100'}`}>
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                {product.categoryId && (
                  <Link
                    to={getProductsByCategoryUrl(product.categoryId)}
                    className="text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {product.category}
                  </Link>
                )}
                <span>•</span>
                <span className="capitalize">{product.productCondition || 'Nuevo'}</span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <HiOutlineStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.rating})</span>
                  <span className="text-sm text-primary-600 underline cursor-pointer">11 opiniones</span>
                </div>
              )}

              <div className="mb-4">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatProductCardPrice(currentProduct.price)}
                  </span>
                  {currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.price && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        {formatProductCardPrice(currentProduct.originalPrice)}
                      </span>
                      {product.discount && (
                        <span className="text-sm font-semibold text-primary-600">
                          {product.discount}% OFF
                        </span>
                      )}
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Llévatelo con
                  {currentProduct.initialPaymentCost > 0 ? (
                    <>{' '}<span className="font-semibold text-primary-600">un pago inicial de {formatProductCardPrice(currentProduct.initialPaymentCost)}</span>{' '}</>
                  ) : (
                    <> pago inicial </>
                  )}
                  y el resto pagalo hasta a{' '}
                  {CHECKOUT_CONFIG.PRODUCT_DETAIL_MONTHLY_INSTALLMENTS} mensualidades.{' '}
                  <span className="text-xs">IVA incluido</span>
                </p>
              </div>

              {/* <div className="mb-4">
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-semibold text-primary-600">Llega gratis el miércoles</span> con tu carrito
                </p>
                <p className="text-xs text-primary-600 cursor-pointer hover:underline">
                  Suscríbete a NexoPay+ y obtén envío gratis
                </p>
              </div> */}

              <div className="mb-4">
                {currentProduct.inStock ? (
                  <>
                    <p className="text-sm font-semibold mb-1 text-primary-600">Stock disponible</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Cantidad: {quantity} unidad{quantity > 1 ? 'es' : ''} ({currentProduct.stock} disponibles)
                    </p>
                  </>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <p className="text-sm font-semibold text-red-600">
                      {(colors.length > 0 || sizes.length > 0)
                        ? 'No disponible'
                        : 'Este producto no está disponible'}
                    </p>
                  </div>
                )}
              </div>

              {(colors.length > 0 || sizes.length > 0) && (
                <div className="space-y-3 mb-4">
                  {colors.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Color: {selectedVariants.color ? <span className="text-primary-600">{selectedVariants.color}</span> : ''}
                      </label>
                      <div className="flex flex-wrap gap-2 items-center">
                        {colors.map((color, index) => {
                          const isColorObject = typeof color === 'object';
                          const colorName = isColorObject ? color.name : color;
                          const colorValue = isColorObject 
                            ? (color.value || getColorValue(colorName))
                            : getColorValue(colorName);
                          const isSelected = selectedVariants.color === colorName;
                          
                          return (
                            <button
                              key={index}
                              onClick={() => handleVariantSelection('color', colorName)}
                              className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                                isSelected
                                  ? 'border-primary-600 ring-1 ring-primary-200 ring-offset-1'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                              style={{ backgroundColor: colorValue }}
                              title={colorName}
                              aria-label={`Color ${colorName}`}
                            >
                              {colorValue === '#FFFFFF' || colorValue === '#F5F5F7' || colorValue === '#F5F5DC' ? (
                                <div className="absolute inset-0 rounded-full border border-gray-300" />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {sizes.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {product.allAttributes && product.allAttributes.find(a => a.toLowerCase() === 'almacenamiento') ? 'Almacenamiento' : 'Talla'}: {selectedVariants.size ? <span className="text-primary-600">{selectedVariants.size}</span> : ''}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map((size, index) => {
                          const sizeName = typeof size === 'object' ? size.name : size;
                          const isSelected = selectedVariants.size === sizeName;
                          
                          return (
                            <button
                              key={index}
                              onClick={() => handleVariantSelection('size', sizeName)}
                              className={`px-3 py-1.5 rounded-lg border-2 transition-all font-medium text-xs ${
                                isSelected
                                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                                  : 'border-gray-300 hover:border-gray-400 text-gray-700'
                              }`}
                            >
                              {sizeName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {product.description && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Descripción del producto</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>

            <div className={`lg:col-span-1 transition-opacity duration-300 ${isZooming ? 'lg:opacity-0 lg:pointer-events-none' : 'opacity-100'}`}>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sticky top-4">
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className={`text-sm font-semibold mb-1 ${currentProduct.inStock ? 'text-primary-600' : 'text-red-600'}`}>
                    {currentProduct.inStock ? 'Stock disponible' : 'Sin stock'}
                  </p>
                  {(currentProduct.stock ?? 0) > 0 && (
                    <>
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-semibold text-gray-700">Cantidad:</label>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-3 py-1.5 hover:bg-gray-100 transition-colors text-sm"
                            disabled={quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-4 py-1.5 border-x border-gray-300 font-medium text-sm">{quantity}</span>
                          <button
                            onClick={() => setQuantity(Math.min(currentProduct.stock, quantity + 1))}
                            className="px-3 py-1.5 hover:bg-gray-100 transition-colors text-sm"
                            disabled={quantity >= currentProduct.stock}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">({currentProduct.stock} disponibles)</p>
                    </>
                  )}
                </div>

                {currentProduct.inStock && (
                  <div className="space-y-3 mb-4">
                    <button
                      onClick={handleBuyNow}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm"
                    >
                      <HiOutlineCreditCard className="w-4 h-4" />
                      Comprar ahora
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
                    >
                      <HiOutlineShoppingCart className="w-4 h-4" />
                      Agregar al carrito
                    </button>
                  </div>
                )}

                {product.affiliate && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <HiOutlineBuildingStorefront className="w-4 h-4 text-gray-600" />
                      <p className="text-sm text-gray-700">
                        Vendido por <span className="font-semibold">{product.affiliate}</span>
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <HiOutlineShieldCheck className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Devolución gratis</p>
                      <p className="text-xs text-gray-600">Tienes 30 días desde que lo recibes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <HiOutlineShieldCheck className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Compra Protegida</p>
                      <p className="text-xs text-gray-600">Recibe el producto que esperabas o te devolvemos tu dinero</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <SimilarProducts currentProduct={product} limit={10} />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <SellerProducts
            currentProduct={product}
            sellerId={product?.affiliateId ? String(product.affiliateId) : 'NexoPay'}
          />
        </div>
      </main>

      {isImageModalOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Galería de imágenes del producto"
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsImageModalOpen(false)}
              className="absolute -top-12 right-0 p-2 text-white hover:bg-white/20 rounded-full transition-colors z-10"
              aria-label="Cerrar"
            >
              <HiOutlineXMark className="w-8 h-8" />
            </button>

            {modalImageIndex > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalImageIndex((i) => Math.max(0, i - 1));
                }}
                className="absolute left-0 md:-left-14 p-2 text-white hover:bg-white/20 rounded-full transition-colors z-10"
                aria-label="Imagen anterior"
              >
                <HiOutlineArrowLeftCircle className="w-10 h-10" />
              </button>
            )}

            <div className="flex-1 flex justify-center items-center overflow-hidden">
              {images[modalImageIndex] && !images[modalImageIndex].includes('via.placeholder.com') ? (
                <img
                  src={images[modalImageIndex]}
                  alt={`${product.name} - imagen ${modalImageIndex + 1}`}
                  className="max-w-full max-h-[85vh] object-contain"
                />
              ) : (
                <div className="w-full max-w-md aspect-square bg-gray-800 flex items-center justify-center rounded-lg">
                  <ProductPlaceholder name={product.name} className="w-full h-full opacity-80" />
                </div>
              )}
            </div>

            {modalImageIndex < images.length - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalImageIndex((i) => Math.min(images.length - 1, i + 1));
                }}
                className="absolute right-0 md:-right-14 p-2 text-white hover:bg-white/20 rounded-full transition-colors z-10"
                aria-label="Siguiente imagen"
              >
                <HiOutlineArrowRightCircle className="w-10 h-10" />
              </button>
            )}

            <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/90 text-sm">
              {modalImageIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;

