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
  HiOutlineXMark
} from 'react-icons/hi2';
import ProductPlaceholder from '../components/common/ProductPlaceholder';
import ProductGrid from '../components/ecommerce/ProductGrid';

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

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const calculateMonthlyPayment = (totalPrice) => {
    return totalPrice / 6;
  };

  const handleAddToCart = () => {
    if (product && product.inStock) {
      addItem(product, quantity);
      openCartSidebar(); // Abrir el sidebar del carrito
    }
  };

  const handleBuyNow = () => {
    if (product && product.inStock) {
      addItem(product, quantity);
      navigate(ROUTES.CHECKOUT);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

  const images = product.image ? [product.image] : [null];
  const relatedProducts = []; // TODO: Implementar productos relacionados

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden border border-gray-200">
              {images[selectedImage] && !images[selectedImage].includes('via.placeholder.com') ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ProductPlaceholder name={product.name} className="w-full h-full" />
              )}
              {product.discount && (
                <div className="absolute top-4 left-4 bg-highlight-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  -{product.discount}%
                </div>
              )}
            </div>

            {/* Thumbnail Gallery (si hay múltiples imágenes) */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {img ? (
                      <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <ProductPlaceholder name={product.name} className="w-full h-full" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <Link
                to={`/productos?categories=${encodeURIComponent(product.category)}`}
                className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors"
              >
                {product.category}
              </Link>
            </div>

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <HiOutlineStar
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.rating})</span>
              </div>
            )}

            {/* Price */}
            <div className="py-4 border-y border-gray-200">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-lg text-primary-600 font-semibold">
                Desde {formatPrice(calculateMonthlyPayment(product.price))} mensual
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <HiOutlineCheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-medium">Disponible</span>
                </>
              ) : (
                <>
                  <HiOutlineXMark className="w-5 h-5 text-red-600" />
                  <span className="text-red-600 font-medium">Agotado</span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Cantidad:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x border-gray-300 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {product.inStock && (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
                >
                  <HiOutlineShoppingCart className="w-5 h-5" />
                  Agregar al carrito
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
                >
                  <HiOutlineCreditCard className="w-5 h-5" />
                  Comprar ahora
                </button>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <HiOutlineTruck className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Envío gratis</p>
                  <p className="text-xs text-gray-600">En compras mayores a $5,000</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <HiOutlineShieldCheck className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Garantía</p>
                  <p className="text-xs text-gray-600">1 año de garantía</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <HiOutlineCreditCard className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Pago a plazos</p>
                  <p className="text-xs text-gray-600">Hasta 4 quincenas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Descripción</h2>
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'No hay descripción disponible para este producto.'}
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Info */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
              <h3 className="font-bold text-gray-900 mb-4">Pago a plazos</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio total:</span>
                  <span className="font-semibold text-gray-900">{formatPrice(product.price * quantity)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pago mensual:</span>
                  <span className="font-semibold text-primary-600">
                    {formatPrice(calculateMonthlyPayment(product.price * quantity))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Número de pagos:</span>
                  <span className="font-semibold text-gray-900">6 meses</span>
                </div>
              </div>
              <Link
                to="/solicitar-credito"
                className="mt-4 block text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-semibold"
              >
                Solicitar crédito
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos relacionados</h2>
            <ProductGrid products={relatedProducts} showAddToCart={true} />
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;

