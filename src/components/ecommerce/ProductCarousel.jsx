import React, { useRef, useState, useEffect } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';
import ProductCard from './ProductCard';

const ProductCarousel = ({ limit = null, showOnlyDiscounted = false }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockProducts = [
    {
      id: 1,
      name: 'Smartphone Samsung Galaxy A54',
      price: 8999,
      originalPrice: 10999,
      discount: 18,
      image: null,
      category: 'Electrónica',
      rating: 4.5,
      inStock: true
    },
    {
      id: 2,
      name: 'Laptop HP Pavilion 15',
      price: 12999,
      originalPrice: 14999,
      discount: 13,
      image: null,
      category: 'Computadoras',
      rating: 4.7,
      inStock: true
    },
    {
      id: 3,
      name: 'Auriculares Sony WH-1000XM4',
      price: 5999,
      originalPrice: null,
      discount: null,
      image: null,
      category: 'Audio',
      rating: 4.8,
      inStock: true
    },
    {
      id: 4,
      name: 'Tablet iPad Air',
      price: 10999,
      originalPrice: 12999,
      discount: 15,
      image: null,
      category: 'Tablets',
      rating: 4.6,
      inStock: true
    },
    {
      id: 5,
      name: 'Smart TV LG 55" 4K',
      price: 14999,
      originalPrice: 17999,
      discount: 17,
      image: null,
      category: 'Televisores',
      rating: 4.4,
      inStock: true
    },
    {
      id: 6,
      name: 'Cámara Canon EOS Rebel',
      price: 15999,
      originalPrice: null,
      discount: null,
      image: null,
      category: 'Fotografía',
      rating: 4.9,
      inStock: false
    }
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setProducts(mockProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

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

