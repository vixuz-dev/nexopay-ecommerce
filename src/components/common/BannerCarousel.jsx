import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';

const BannerCarousel = ({ 
  banners = [], 
  autoPlayInterval = 5000,
  showArrows = true,
  showDots = true 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    if (banners.length === 0 || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, banners.length, autoPlayInterval]);

  if (banners.length === 0) return null;

  return (
    <section 
      className="relative w-full py-0 sm:py-6 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="sm:container sm:mx-auto sm:px-4">
        <div className="relative w-full overflow-hidden sm:rounded-xl aspect-[16/6] sm:aspect-[16/5]">
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banners.map((banner, index) => (
              <div
                key={index}
                className="min-w-full relative h-full"
              >
                <img
                  src={banner.image}
                  alt={banner.alt || `Banner ${index + 1}`}
                  className="w-full h-full object-cover sm:rounded-xl"
                />
                {banner.link && (
                  <a
                    href={banner.link}
                    className="absolute inset-0"
                    aria-label={banner.alt || `Ir a ${banner.link}`}
                  />
                )}
              </div>
            ))}
          </div>

          {showArrows && banners.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-[50%] -translate-y-1/2 bg-white/90 hover:bg-white rounded-full px-4 py-2 shadow-lg transition-all duration-300 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100"
                aria-label="Banner anterior"
              >
                <HiOutlineChevronLeft className="w-6 h-6 text-primary-600" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-[50%] -translate-y-1/2 bg-white/90 hover:bg-white rounded-full px-4 py-2 shadow-lg transition-all duration-300 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100"
                aria-label="Banner siguiente"
              >
                <HiOutlineChevronRight className="w-6 h-6 text-primary-600" />
              </button>
            </>
          )}

          {showDots && banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Ir al banner ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BannerCarousel;

