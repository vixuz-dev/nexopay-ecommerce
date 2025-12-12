import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlinePhone, HiOutlineUser, HiOutlineShoppingBag, HiOutlineCreditCard, HiOutlineEnvelope, HiOutlineMapPin, HiOutlineShieldCheck, HiOutlineLockClosed, HiOutlineEye, HiOutlineHome } from 'react-icons/hi2';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import ProductCarousel from '../components/ecommerce/ProductCarousel';
import BannerCarousel from '../components/common/BannerCarousel';
import CategoryCarousel from '../components/common/CategoryCarousel';
import BrandSection from '../components/sections/BrandSection';
import FeaturedProductsSection from '../components/sections/FeaturedProductsSection';
import CreditInfoBanner from '../components/common/CreditInfoBanner';
import bannerGorilla from '../assets/images/banners/BannerInformativoGorilla.png';
import bannerSerena from '../assets/images/banners/BannerInformativoSerena.png';

const mockBanners = [
  {
    image: bannerGorilla,
    alt: 'Banner informativo Gorilla',
    link: '/ofertas'
  },
  {
    image: bannerSerena,
    alt: 'Banner informativo Serena',
    link: '/categorias'
  }
];

const mockCategories = [
  {
    id: 1,
    name: 'Smartphones',
    icon: HiOutlinePhone,
    path: '/categorias/smartphones',
    color: 'primary'
  },
  {
    id: 2,
    name: 'Laptops',
    icon: HiOutlineHome,
    path: '/categorias/laptops',
    color: 'blue'
  },
  {
    id: 3,
    name: 'TV & Audio',
    icon: HiOutlineEnvelope,
    path: '/categorias/tv-audio',
    color: 'purple'
  },
  {
    id: 4,
    name: 'Cámaras',
    icon: HiOutlineEye,
    path: '/categorias/camaras',
    color: 'teal'
  },
  {
    id: 5,
    name: 'Audio',
    icon: HiOutlineLockClosed,
    path: '/categorias/audio',
    color: 'pink'
  },
  {
    id: 6,
    name: 'Tablets',
    icon: HiOutlinePhone,
    path: '/categorias/tablets',
    color: 'orange'
  },
  {
    id: 7,
    name: 'Auriculares',
    icon: HiOutlinePhone,
    path: '/categorias/auriculares',
    color: 'indigo'
  },
  {
    id: 8,
    name: 'Smartwatches',
    icon: HiOutlineUser,
    path: '/categorias/smartwatches',
    color: 'green'
  },
  {
    id: 9,
    name: 'Gaming',
    icon: HiOutlineShieldCheck,
    path: '/categorias/gaming',
    color: 'red'
  },
  {
    id: 10,
    name: 'Herramientas',
    icon: HiOutlineShoppingBag,
    path: '/categorias/herramientas',
    color: 'highlight'
  },
  {
    id: 11,
    name: 'Accesorios',
    icon: HiOutlineCreditCard,
    path: '/categorias/accesorios',
    color: 'purple'
  }
];

const mockBrands = [
  { name: 'Samsung', logo: null },
  { name: 'Apple', logo: null },
  { name: 'LG', logo: null },
  { name: 'Sony', logo: null },
  { name: 'HP', logo: null },
  { name: 'Canon', logo: null },
  { name: 'Nike', logo: null },
  { name: 'Adidas', logo: null }
];

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <CreditInfoBanner />
        <BannerCarousel banners={mockBanners} />
        
        <CategoryCarousel categories={mockCategories} />
        
        <section className="bg-white py-16 lg:py-24">
          <div className="container mx-auto px-6">
            <div className="mb-12 flex items-center justify-between">
              <div className="text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Lo más nuevo
                </h2>
                <p className="text-base text-gray-600 max-w-2xl">
                  Descubre nuestra selección de productos disponibles con pago a plazos
                </p>
              </div>
              <Link
                to="/productos"
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 whitespace-nowrap ml-4"
              >
                Ver todos
                <HiOutlineArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <ProductCarousel limit={4} />
          </div>
        </section>

        <section className="bg-white py-16 lg:py-24">
          <div className="container mx-auto px-6">
            <div className="mb-12 flex items-center justify-between">
              <div className="text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Ofertas especiales
                </h2>
                <p className="text-base text-gray-600 max-w-2xl">
                  Aprovecha los mejores descuentos en productos seleccionados
                </p>
              </div>
              <Link
                to="/ofertas"
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 whitespace-nowrap ml-4"
              >
                Ver todas
                <HiOutlineArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <ProductCarousel limit={4} showOnlyDiscounted={true} />
          </div>
        </section>

        <BrandSection brands={mockBrands} />
        
        <FeaturedProductsSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;

