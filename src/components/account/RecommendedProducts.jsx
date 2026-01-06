import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useProducts } from '../../hooks';
import ProductCardHorizontal from '../ecommerce/ProductCardHorizontal';
import { HiOutlineChevronRight } from 'react-icons/hi2';

const RecommendedProducts = ({ limit = 6 }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const { products: allProducts, loading } = useProducts({
    inStock: true
  });

  const recommendedProducts = useMemo(() => {
    if (!allProducts.length) return [];
    
    const productsWithDiscount = allProducts.filter(p => p.discount && p.discount > 0);
    const topRated = allProducts.filter(p => p.rating >= 4);
    
    const scoredProducts = allProducts.map(product => {
      let score = 0;
      
      if (product.discount && product.discount > 0) {
        score += 10;
      }
      
      if (product.rating >= 4.5) {
        score += 8;
      } else if (product.rating >= 4) {
        score += 5;
      }
      
      if (product.price < 10000) {
        score += 3;
      }
      
      return { product, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.product);
    
    return scoredProducts;
  }, [allProducts, limit]);

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      updateScrollButtons();
      container.addEventListener('scroll', updateScrollButtons);
      return () => container.removeEventListener('scroll', updateScrollButtons);
    }
  }, [recommendedProducts]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = 400;
    const newScrollLeft = direction === 'right' 
      ? container.scrollLeft + scrollAmount
      : container.scrollLeft - scrollAmount;
    
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (recommendedProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Recomendados para ti</h2>
          <p className="text-sm text-gray-600">Productos que te pueden interesar</p>
        </div>
      </div>
      
      <div className="relative carousel-group">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={updateScrollButtons}
        >
          {recommendedProducts.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(40%-0.8rem)] md:w-[calc(35%-0.85rem)] lg:w-[calc(30%-0.9rem)]"
            >
              <ProductCardHorizontal product={product} />
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 z-10 opacity-0 carousel-group-hover:opacity-100 hover:bg-primary-50"
            aria-label="Productos siguientes"
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
  );
};

export default RecommendedProducts;

