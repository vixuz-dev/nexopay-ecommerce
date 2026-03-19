import React, { useRef, useState, useEffect } from 'react';
import { useAffiliateProducts } from '../../hooks/useAffiliateProducts';
import { useAffiliateSalesSummary } from '../../hooks/useAffiliateSalesSummary';
import ProductCardHorizontal from './ProductCardHorizontal';
import SellerInfo from './SellerInfo';
import { HiOutlineChevronRight } from 'react-icons/hi2';

const SellerProducts = ({ currentProduct, sellerId = 'NexoPay' }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const affiliateId = currentProduct?.affiliateId ?? currentProduct?.affiliate_id ?? null;
  const categoryId = currentProduct?.categoryId ?? currentProduct?.category_id ?? null;

  const { products: sellerProducts, loading } = useAffiliateProducts(
    affiliateId,
    categoryId,
    'category',
    5,
    0,
    currentProduct?.id
  );

  const { data: salesSummary } = useAffiliateSalesSummary(affiliateId);
  const totalSales = salesSummary?.totalSales ?? 0;
  const productCount = sellerProducts.length;

  if (!affiliateId) {
    return null;
  }

  const scroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 400;
    const newScrollLeft = container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    setTimeout(updateScrollButtons, 300);
  };

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    updateScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      const handleResize = () => updateScrollButtons();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [sellerProducts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (sellerProducts.length === 0) {
    return null;
  }

  return (
    <section className="mb-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Productos del vendedor
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="relative carousel-group">
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onScroll={updateScrollButtons}
            >
              {sellerProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-[calc(50%-0.5rem)] min-w-[280px]"
                >
                  <ProductCardHorizontal product={product} />
                </div>
              ))}
            </div>

            {canScrollRight && (
              <button
                onClick={scroll}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 z-10 opacity-0 carousel-group-hover:opacity-100 hover:bg-primary-50"
                aria-label="Ver más productos"
              >
                <HiOutlineChevronRight className="w-5 h-5 text-primary-600" />
              </button>
            )}

            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>

        </div>

        <div className="lg:col-span-1">
          <SellerInfo
            sellerId={salesSummary?.affiliateName || sellerId}
            productCount={productCount}
            totalSales={totalSales}
            level={salesSummary?.level}
            timeWithUsDays={salesSummary?.timeWithUsDays}
            goodService={salesSummary?.goodService}
          />
        </div>
      </div>
    </section>
  );
};

export default SellerProducts;

