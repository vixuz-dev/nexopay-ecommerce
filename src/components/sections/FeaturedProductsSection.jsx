import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineArrowRight } from 'react-icons/hi2';
import productsImage from '../../assets/images/products-electronicos.png';

const FeaturedProductsSection = () => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const items = [
    {
      id: 1,
      title: 'Electrónica',
      description: 'Los mejores productos tecnológicos',
      image: productsImage,
      path: '/categorias/electronica',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700'
    },
    {
      id: 2,
      title: 'Gaming',
      description: 'Equipos para gamers',
      image: productsImage,
      path: '/categorias/gaming',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      id: 3,
      title: 'Audio',
      description: 'Auriculares y altavoces',
      image: productsImage,
      path: '/categorias/audio',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700'
    },
    {
      id: 4,
      title: 'Smartphones',
      description: 'Los últimos modelos',
      image: productsImage,
      path: '/categorias/smartphones',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      id: 5,
      title: 'Ofertas',
      description: 'Hasta 60% de descuento',
      image: productsImage,
      path: '/ofertas',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      id: 6,
      title: 'Tablets',
      description: 'Dispositivos portátiles',
      image: productsImage,
      path: '/categorias/tablets',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    }
  ];

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
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
  }, []);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Productos destacados
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl">
            Explora nuestras categorías y productos más populares
          </p>
        </div>

        <div className="relative group">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={updateScrollButtons}
          >
            {items.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="flex-shrink-0 w-72 md:w-80"
              >
                <div className={`group/item relative overflow-hidden rounded-xl ${item.bgColor} h-[350px] transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}>
                  <div className="absolute inset-0 opacity-10 group-hover/item:opacity-15 transition-opacity duration-300">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="relative z-10 flex flex-col justify-between h-full p-5 md:p-6">
                    <div>
                      <h3 className={`text-xl md:text-2xl font-bold ${item.textColor} mb-2`}>
                        {item.title}
                      </h3>
                      <p className={`text-sm md:text-base ${item.textColor} opacity-80`}>
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-2 group-hover/item:gap-3 transition-all duration-300">
                      <span className={`text-sm font-semibold ${item.textColor}`}>
                        Ver más
                      </span>
                      <HiOutlineArrowRight className={`w-5 h-5 ${item.textColor} group-hover/item:translate-x-1 transition-transform duration-300`} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 hover:bg-primary-50"
              aria-label="Anterior"
            >
              <HiOutlineChevronLeft className="w-6 h-6 text-primary-600" />
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 hover:bg-primary-50"
              aria-label="Siguiente"
            >
              <HiOutlineChevronRight className="w-6 h-6 text-primary-600" />
            </button>
          )}
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;

