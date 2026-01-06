import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useProduct } from '../hooks';
import useCartStore from '../stores/cartStore';
import useUIStore from '../stores/uiStore';
import { ROUTES } from '../utils/routes';
import { 
  HiOutlineShoppingCart, 
  HiOutlineHeart, 
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineStar,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineCreditCard,
  HiOutlineXMark,
  HiOutlineCalendarDays,
  HiOutlineBuildingStorefront
} from 'react-icons/hi2';
import ProductPlaceholder from '../components/common/ProductPlaceholder';
import { SimilarProducts, SellerProducts } from '../components/ecommerce';

const getColorValue = (colorName) => {
  const colorMap = {
    'negro': '#000000',
    'black': '#000000',
    'blanco': '#FFFFFF',
    'white': '#FFFFFF',
    'azul': '#2563EB',
    'blue': '#2563EB',
    'rojo': '#DC2626',
    'red': '#DC2626',
    'verde': '#16A34A',
    'green': '#16A34A',
    'amarillo': '#EAB308',
    'yellow': '#EAB308',
    'rosa': '#EC4899',
    'pink': '#EC4899',
    'violeta': '#9333EA',
    'purple': '#9333EA',
    'morado': '#9333EA',
    'gris': '#6B7280',
    'gray': '#6B7280',
    'gris espacial': '#1F2937',
    'space gray': '#1F2937',
    'starlight': '#F5F5F7',
    'plateado': '#C0C0C0',
    'silver': '#C0C0C0',
    'dorado': '#FFD700',
    'gold': '#FFD700',
    'naranja': '#F97316',
    'orange': '#F97316',
    'turquesa': '#06B6D4',
    'turquoise': '#06B6D4',
    'beige': '#F5F5DC',
    'marron': '#8B4513',
    'brown': '#8B4513',
  };
  
  const normalizedName = colorName.toLowerCase().trim();
  return colorMap[normalizedName] || '#9CA3AF';
};

const ProductDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const openCartSidebar = useUIStore((state) => state.openCartSidebar);
  const productId = searchParams.get('id');
  const category = searchParams.get('category');
  const { product, loading, error } = useProduct(productId);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({
    color: null,
    size: null,
  });
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = React.useRef(null);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const calculateMonthlyPayment = (totalPrice) => {
    return totalPrice / 6;
  };

  const calculateInitialPayment = (totalPrice) => {
    return totalPrice * 0.30;
  };

  const handleAddToCart = () => {
    if (product && product.inStock) {
      const variantSize = selectedVariants.size || null;
      addItem(product, quantity, variantSize);
      openCartSidebar();
    }
  };

  const handleBuyNow = () => {
    if (product && product.inStock) {
      const variantSize = selectedVariants.size || null;
      addItem(product, quantity, variantSize);
      navigate(ROUTES.CHECKOUT);
    }
  };

  const handleVariantChange = (variantType, value) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantType]: value
    }));
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

  if (!productId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-1 sm:px-4 lg:px-8 py-12">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no especificado</h2>
            <p className="text-gray-600 mb-6">Por favor, selecciona un producto desde el catálogo</p>
            <Link
              to="/productos"
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
              to="/productos"
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

  const images = product.images 
    ? (Array.isArray(product.images) ? product.images : [product.images])
    : (product.image ? [product.image] : [null]);
  
  const variants = product.variants || {};
  const colors = variants.colors || [];
  const sizes = variants.sizes || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-1 sm:px-4 lg:px-8 py-8">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
            <li>
              <Link to="/" className="hover:text-primary-600 transition-colors">Inicio</Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/productos" className="hover:text-primary-600 transition-colors">Productos</Link>
            </li>
            <li>/</li>
            <li>
              <Link to={`/productos?categories=${encodeURIComponent(product.category)}`} className="hover:text-primary-600 transition-colors">
                {product.category}
              </Link>
            </li>
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
                      {images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all bg-white ${
                            selectedImage === index
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
                        </button>
                      ))}
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
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                          selectedImage === index
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
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={`lg:col-span-1 space-y-4 relative z-10 transition-opacity duration-300 ${isZooming ? 'lg:opacity-0 lg:pointer-events-none' : 'opacity-100'}`}>
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                <Link
                  to={`/productos?categories=${encodeURIComponent(product.category)}`}
                  className="text-primary-600 hover:text-primary-700 transition-colors"
                >
                  {product.category}
                </Link>
                <span>•</span>
                <span>Nuevo</span>
                <span>•</span>
                <span>+50 vendidos</span>
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
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
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
                  24 meses de {formatPrice(calculateMonthlyPayment(product.price))} <span className="text-xs">IVA incluido</span>
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-semibold text-primary-600">Llega gratis el miércoles</span> con tu carrito
                </p>
                <p className="text-xs text-primary-600 cursor-pointer hover:underline">
                  Suscríbete a NexoPay+ y obtén envío gratis
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-primary-600 mb-1">Stock disponible</p>
                <p className="text-xs text-gray-600">Almacenado y enviado por NexoPay</p>
                <p className="text-xs text-gray-600 mt-1">
                  Cantidad: {quantity} unidad{quantity > 1 ? 'es' : ''} (+5 disponibles)
                </p>
              </div>

              {product.inStock && (colors.length > 0 || sizes.length > 0) && (
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
                              onClick={() => handleVariantChange('color', colorName)}
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
                        Talla: {selectedVariants.size ? <span className="text-primary-600">{selectedVariants.size}</span> : ''}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map((size, index) => {
                          const isSizeObject = typeof size === 'object';
                          const sizeName = isSizeObject ? size.name : size;
                          const isAvailable = isSizeObject ? size.available !== false : true;
                          const isSelected = selectedVariants.size === sizeName;
                          
                          return (
                            <button
                              key={index}
                              onClick={() => isAvailable && handleVariantChange('size', sizeName)}
                              disabled={!isAvailable}
                              className={`px-3 py-1.5 rounded-lg border-2 transition-all font-medium text-xs ${
                                !isAvailable
                                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                                  : isSelected
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

              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Lo que tienes que saber de este producto</h3>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {Object.entries(product.specifications).slice(0, 6).map(([key, value]) => (
                      <li key={key} className="flex items-start gap-2">
                        <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className={`lg:col-span-1 transition-opacity duration-300 ${isZooming ? 'lg:opacity-0 lg:pointer-events-none' : 'opacity-100'}`}>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sticky top-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-2">
                    <HiOutlineCalendarDays className="w-4 h-4 inline mr-1 text-primary-600" />
                    <span className="font-semibold text-primary-600">Llega gratis el miércoles</span>
                  </p>
                  <p className="text-xs text-gray-600">Con tu carrito de compras</p>
                </div>

                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm font-semibold text-primary-600 mb-1">Stock disponible</p>
                  <p className="text-xs text-gray-600 mb-2">Almacenado y enviado por NexoPay</p>
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
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1.5 hover:bg-gray-100 transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">(+5 disponibles)</p>
                </div>

                {product.inStock && (
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

                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <HiOutlineBuildingStorefront className="w-4 h-4 text-gray-600" />
                    <p className="text-sm text-gray-700">
                      Vendido por <span className="font-semibold">NexoPay Store</span>
                    </p>
                  </div>
                  <p className="text-xs text-gray-600">+1000 ventas</p>
                </div>

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
            sellerId="FGBDCEHFA42612"
            onViewMoreProducts={() => {
              navigate(`/productos?seller=${encodeURIComponent('FGBDCEHFA42612')}`);
            }}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;

