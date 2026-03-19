import React, { useMemo, useRef, useState, useEffect } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';
import ProductCard from './ProductCard';
import { useProductsApi } from '../../hooks/useProductsApi';
import { mapApiProductToComponent } from '../../utils/productMapper';

const ProductCarousel = ({ limit = null, showOnlyDiscounted = false, products: productsProp }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { products: apiProducts, isLoading: apiLoading } = useProductsApi(
    productsProp ? null : {
      page: 1,
      totalItems: 20,
      categoryId: 0,
      subcategoryId: 0,
      productName: '',
    }
  );

  const products = useMemo(() => {
    if (Array.isArray(productsProp) && productsProp.length > 0) {
      return productsProp.map((p) => (p.id != null ? p : mapApiProductToComponent(p)));
    }
    const list = Array.isArray(apiProducts) ? apiProducts : [];
    return list.map(mapApiProductToComponent);
  }, [productsProp, apiProducts]);

  const loading = productsProp ? false : apiLoading;

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
  }, [products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">No hay productos disponibles</p>
      </div>
    );
  }

  let filteredProducts = products;
  
  if (showOnlyDiscounted) {
    filteredProducts = products.filter(product => product.discount && product.discount > 0);
  }
  
  const displayedProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;

  if (displayedProducts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={updateScrollButtons}
      >
        {displayedProducts.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-64 sm:w-72 md:w-80"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 hover:bg-primary-50"
          aria-label="Productos anteriores"
        >
          <HiOutlineChevronLeft className="w-6 h-6 text-primary-600" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 hover:bg-primary-50"
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
  );
};

export default ProductCarousel;

