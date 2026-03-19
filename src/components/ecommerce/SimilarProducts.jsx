import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useProducts, useSimilarProducts } from '../../hooks';
import ProductCard from './ProductCard';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';

const SimilarProducts = ({ currentProduct, limit = 10 }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const categoryId = currentProduct?.categoryId ?? null;
  const { products: apiSimilarProducts, loading: apiLoading } = useSimilarProducts(
    categoryId,
    limit,
    0,
    currentProduct?.id
  );

  const { products: allProducts, loading: catalogLoading } = useProducts({
    inStock: true,
  });

  const fallbackSimilarProducts = useMemo(() => {
    if (!currentProduct || !allProducts.length || categoryId) return [];
    const currentPrice = currentProduct.price || 0;
    const currentRating = currentProduct.rating || 0;
    const currentCategory = currentProduct.category || '';
    const priceRange = currentPrice * 0.5;
    const scoredProducts = allProducts
      .filter((p) => p.id !== currentProduct.id)
      .map((product) => {
        let score = 0;
        if (product.category === currentCategory) score += 10;
        const priceDiff = Math.abs((product.price || 0) - currentPrice);
        if (priceDiff <= priceRange) score += 5;
        const ratingDiff = Math.abs((product.rating || 0) - currentRating);
        if (ratingDiff <= 1) score += 3;
        if (product.discount && product.discount > 0) score += 2;
        return { product, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.product);
    return scoredProducts.length > 0
      ? scoredProducts
      : allProducts.filter((p) => p.id !== currentProduct.id).slice(0, limit);
  }, [allProducts, currentProduct, limit, categoryId]);

  const similarProducts = categoryId ? apiSimilarProducts : fallbackSimilarProducts;
  const loading = categoryId ? apiLoading : catalogLoading;

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 350;
    const newScrollLeft = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    setTimeout(updateScrollButtons, 300);
  };

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
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
  }, [similarProducts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Productos similares
        </h2>
        <p className="text-sm text-gray-600">
          Otros productos que te pueden interesar
        </p>
      </div>
      
      <div className="relative carousel-group">
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={updateScrollButtons}
        >
          {similarProducts.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-64 sm:w-72 md:w-80"
            >
              <ProductCard 
                product={product} 
                showAddToCart={false} 
              />
            </div>
          ))}
        </div>

        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 z-10 opacity-0 carousel-group-hover:opacity-100 hover:bg-primary-50"
            aria-label="Productos anteriores"
          >
            <HiOutlineChevronLeft className="w-6 h-6 text-primary-600" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 z-10 opacity-0 carousel-group-hover:opacity-100 hover:bg-primary-50"
            aria-label="Productos siguientes"
          >
            <HiOutlineChevronRight className="w-6 h-6 text-primary-600" />
          </button>
        )}

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
};

export default SimilarProducts;

