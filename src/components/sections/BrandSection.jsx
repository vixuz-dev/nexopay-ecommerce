import React, { useRef, useState, useEffect } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';
import BrandCard from '../common/BrandCard';

const BrandSection = ({ brands = [], autoScroll = true, scrollInterval = 3000 }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 250;
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
      
      if (autoScroll && brands.length > 0) {
        intervalRef.current = setInterval(() => {
          if (!isPaused && container) {
            const maxScroll = container.scrollWidth - container.clientWidth;
            if (container.scrollLeft >= maxScroll - 10) {
              container.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
              scroll('right');
            }
          }
        }, scrollInterval);
      }

      return () => {
        window.removeEventListener('resize', handleResize);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [brands, autoScroll, scrollInterval, isPaused]);

  if (brands.length === 0) return null;

  return (
    <section 
      className="bg-gradient-to-b from-white to-gray-50 py-16 lg:py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Marcas destacadas
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Las mejores marcas en un solo lugar
          </p>
        </div>
        
        <div className="relative group">
          <div
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={updateScrollButtons}
          >
            {brands.map((brand, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-40 sm:w-44 md:w-48"
              >
                <BrandCard brand={brand} />
              </div>
            ))}
          </div>

          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 hover:bg-primary-50"
              aria-label="Marcas anteriores"
            >
              <HiOutlineChevronLeft className="w-6 h-6 text-primary-600" />
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 hover:bg-primary-50"
              aria-label="Marcas siguientes"
            >
              <HiOutlineChevronRight className="w-6 h-6 text-primary-600" />
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default BrandSection;

