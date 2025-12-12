import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineArrowRight } from 'react-icons/hi2';
import CategoryCard from './CategoryCard';

const CategoryCarousel = ({ categories = [], showViewAll = true, viewAllPath = '/categorias' }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    const newScrollLeft = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    updateScrollButtons();
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
  }, [categories]);

  if (categories.length === 0) return null;

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Busca por categorías
            </h2>
            <p className="text-base text-gray-600">
              Explora nuestras categorías de productos
            </p>
          </div>
          {showViewAll && (
            <Link
              to={viewAllPath}
              className="hidden md:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 whitespace-nowrap"
            >
              Ver todas
              <HiOutlineArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>

        <div className="relative group">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={updateScrollButtons}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex-shrink-0 w-32 sm:w-36 md:w-40"
              >
                <CategoryCard category={category} />
              </div>
            ))}
          </div>

          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 z-10 opacity-0 group-hover:opacity-100"
              aria-label="Categorías anteriores"
            >
              <HiOutlineChevronLeft className="w-6 h-6 text-primary-600" />
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 z-10 opacity-0 group-hover:opacity-100"
              aria-label="Categorías siguientes"
            >
              <HiOutlineChevronRight className="w-6 h-6 text-primary-600" />
            </button>
          )}
        </div>

        {showViewAll && (
          <div className="mt-6 text-center md:hidden">
            <Link
              to={viewAllPath}
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200"
            >
              Ver todas las categorías
              <HiOutlineArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default CategoryCarousel;

