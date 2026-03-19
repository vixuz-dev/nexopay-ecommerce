import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ROUTES } from '../utils/routes';
import { getProductsByCategoryUrl } from '../utils/routes';
import ProductCarousel from '../components/ecommerce/ProductCarousel';
import BannerCarousel from '../components/common/BannerCarousel';
import CategoryCarousel from '../components/common/CategoryCarousel';
import BrandSection from '../components/sections/BrandSection';
import FeaturedProductsSection from '../components/sections/FeaturedProductsSection';
import CreditInfoBanner from '../components/common/CreditInfoBanner';
import { useCategories } from '../hooks/useCategories';
import { useHomeData } from '../hooks/useHomeData';
import { mapApiProductToComponent } from '../utils/productMapper';
import bannerGorilla from '../assets/images/banners/BannerInformativoGorilla.png';
import bannerSerena from '../assets/images/banners/BannerInformativoSerena.png';

const mockBanners = [
  {
    image: bannerGorilla,
    alt: 'Banner informativo Gorilla',
    link: ROUTES.PRODUCTS
  },
  {
    image: bannerSerena,
    alt: 'Banner informativo Serena',
    link: ROUTES.PRODUCTS
  }
];

const Home = () => {
  const { categories, isLoading: categoriesLoading } = useCategories();
  const {
    newProducts,
    brands,
    newTitle,
    brandsTitle,
    isLoading: homeLoading,
    error: homeError,
  } = useHomeData();

  const newProductsMapped = useMemo(() => {
    const list = Array.isArray(newProducts) ? newProducts : [];
    return list.map(mapApiProductToComponent);
  }, [newProducts]);

  const brandsForSection = useMemo(() => {
    const list = Array.isArray(brands) ? brands : [];
    return list.map((b) => ({ name: b.name ?? b, logo: b.logo ?? null }));
  }, [brands]);

  const categoriesForCarousel = useMemo(() => {
    if (!categories) {
      return [];
    }

    const categoriesArray = Array.isArray(categories) ? categories : [];

    if (categoriesArray.length === 0) {
      return [];
    }

    return categoriesArray.map((category) => {
      const label = category.name || category.category_name || category.title || category.categoryName || 'Sin nombre';
      const categoryId = category.id || category.category_id || category.categoryId;
      
      return {
        id: categoryId,
        name: label,
        label: label,
        path: getProductsByCategoryUrl(categoryId),
      };
    });
  }, [categories]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <CreditInfoBanner />
        <BannerCarousel banners={mockBanners} />
        
        {!categoriesLoading && categoriesForCarousel.length > 0 && (
          <CategoryCarousel categories={categoriesForCarousel} viewAllPath={ROUTES.PRODUCTS} />
        )}
        
        <section className="bg-white py-16 lg:py-24">
          <div className="container mx-auto px-6">
            <div className="mb-12 flex items-center justify-between">
              <div className="text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {newTitle}
                </h2>
                <p className="text-base text-gray-600 max-w-2xl">
                  Descubre nuestra selección de productos disponibles con pago a plazos
                </p>
              </div>
              <Link
                to={ROUTES.PRODUCTS}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 whitespace-nowrap ml-4"
              >
                Ver todos
                <HiOutlineArrowRight className="w-5 h-5" />
              </Link>
            </div>
            {homeLoading && newProductsMapped.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
              </div>
            ) : homeError && newProductsMapped.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">{homeError}</p>
              </div>
            ) : (
              <ProductCarousel products={newProductsMapped} limit={4} />
            )}
          </div>
        </section>

        {brandsForSection.length > 0 && (
          <BrandSection brands={brandsForSection} />
        )}
        
        <FeaturedProductsSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;

