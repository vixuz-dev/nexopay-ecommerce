import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineArrowRight } from 'react-icons/hi2';
import { useCategories } from '../../hooks/useCategories';
import { getProductsByCategoryUrl, ROUTES } from '../../utils/routes';
import { ASSETS } from '../../constants/app';

const FEATURED_CATEGORIES_CONFIG = [
  { name: 'Electrónica', slug: 'electronic', aliases: ['electronica', 'electronic'], description: 'Los mejores productos tecnológicos', fallbackBg: 'bg-teal-600' },
  { name: 'Hogar', slug: 'hogar', aliases: ['hogar', 'hogar y cocina', 'hogar y jardin'], description: 'Todo para tu hogar', fallbackBg: 'bg-amber-600' },
  { name: 'Moda', slug: 'moda', aliases: ['moda', 'ropa', 'moda y accesorios'], description: 'Las últimas tendencias', fallbackBg: 'bg-pink-600' },
  { name: 'Belleza', slug: 'belleza', aliases: ['belleza', 'cuidado personal', 'salud y belleza'], description: 'Cuida tu imagen', fallbackBg: 'bg-rose-600' },
];

const normalizeCategoryName = (str) =>
  String(str ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const getImageUrl = (slug) => `${ASSETS.FEATURED_IMAGES_BASE}/${slug}-products.webp`;

const FeaturedProductsSection = ({
  sectionTitle = 'Productos destacados',
  sectionDescription = 'Explora nuestras categorías y productos más populares',
}) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const { categories } = useCategories();

  const items = useMemo(() => {
    const categoriesList = Array.isArray(categories) ? categories : [];
    const normalizedCategories = categoriesList.map((c) => ({
      ...c,
      normalizedName: normalizeCategoryName(c.name ?? c.category_name ?? c.title ?? c.categoryName ?? ''),
    }));

    const findCategoryMatch = (config) => {
      const searchTerms = [config.name, ...(config.aliases || [])].map(normalizeCategoryName);
      for (const term of searchTerms) {
        const exact = normalizedCategories.find((c) => c.normalizedName === term);
        if (exact) return exact;
        const partial = normalizedCategories.find((c) =>
          c.normalizedName.includes(term) || term.includes(c.normalizedName)
        );
        if (partial) return partial;
      }
      return null;
    };

    return FEATURED_CATEGORIES_CONFIG.map((config) => {
      const matched = findCategoryMatch(config);
      const categoryId = matched?.id ?? matched?.category_id ?? matched?.categoryId;

      return {
        id: config.slug,
        title: config.name,
        description: config.description,
        backgroundImage: getImageUrl(config.slug),
        fallbackBg: config.fallbackBg,
        seeMoreRedirect: categoryId != null ? getProductsByCategoryUrl(categoryId) : ROUTES.PRODUCTS,
      };
    });
  }, [categories]);

  const handleImageError = (slug) => {
    setImageErrors((prev) => ({ ...prev, [slug]: true }));
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 450;
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
  }, [items.length]);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex items-center justify-between">
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {sectionTitle}
            </h2>
            <p className="text-base text-gray-600 max-w-2xl">
              {sectionDescription}
            </p>
          </div>
          <Link
            to={ROUTES.PRODUCTS}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 whitespace-nowrap ml-4"
          >
            Ver más
            <HiOutlineArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="relative group">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={updateScrollButtons}
          >
            {items.map((item) => {
              const imageFailed = imageErrors[item.id];
              return (
                <Link
                  key={item.id}
                  to={item.seeMoreRedirect}
                  className="flex-shrink-0 w-80 sm:w-96 md:w-[420px] lg:w-[460px]"
                >
                  <div className={`group/item relative overflow-hidden rounded-xl h-[400px] md:h-[440px] transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${imageFailed ? item.fallbackBg : 'bg-neutral-200'}`}>
                    {!imageFailed && (
                      <img
                        src={item.backgroundImage}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={() => handleImageError(item.id)}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/30 group-hover/item:bg-black/20 transition-colors duration-300" />
                    <div className="relative z-10 flex flex-col justify-between h-full p-5 md:p-6">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-md">
                          {item.title}
                        </h3>
                        <p className="text-sm md:text-base text-white/90 drop-shadow">
                          {item.description}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-2 group-hover/item:gap-3 transition-all duration-300">
                        <span className="text-sm font-semibold text-white drop-shadow">
                          Ver más
                        </span>
                        <HiOutlineArrowRight className="w-5 h-5 text-white group-hover/item:translate-x-1 transition-transform duration-300 drop-shadow" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
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
