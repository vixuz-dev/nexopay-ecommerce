import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useCategories } from '../hooks/useCategories';
import { ROUTES, getProductsByCategoryUrl } from '../utils/routes';
import { HiOutlineArrowLeft, HiOutlineSquares2X2, HiOutlineChevronRight, HiOutlineTag } from 'react-icons/hi2';

const CategoryCard = ({ category }) => {
  const categoryId = category.id || category.category_id || category.categoryId;
  const categoryName = category.name || category.category_name || category.categoryName || category.title || 'Sin nombre';

  return (
    <Link
      to={getProductsByCategoryUrl(categoryId)}
      className="group flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 p-8 min-h-[160px] hover:border-primary-300 hover:shadow-lg transition-all duration-200"
    >
      <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
        <HiOutlineTag className="w-6 h-6 text-primary-600" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 text-center group-hover:text-primary-700 transition-colors leading-tight">
        {categoryName}
      </h3>
      <span className="mt-2 flex items-center gap-1 text-xs text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        Ver productos
        <HiOutlineChevronRight className="w-3 h-3" />
      </span>
    </Link>
  );
};

const Categories = () => {
  const { categories, isLoading } = useCategories();

  const sortedCategories = useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];
    return [...categories].sort((a, b) => {
      const nameA = a.name || a.category_name || a.title || '';
      const nameB = b.name || b.category_name || b.title || '';
      return nameA.localeCompare(nameB, 'es');
    });
  }, [categories]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              <HiOutlineArrowLeft className="w-4 h-4" />
              Inicio
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <HiOutlineSquares2X2 className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Todas las categorías
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {isLoading
                  ? 'Cargando categorías...'
                  : `${sortedCategories.length} categoría${sortedCategories.length !== 1 ? 's' : ''} disponible${sortedCategories.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-8 min-h-[160px] animate-pulse flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-gray-200 mb-4" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : sortedCategories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {sortedCategories.map((category, idx) => {
                const catId = category.id || category.category_id || category.categoryId;
                return <CategoryCard key={catId || idx} category={category} />;
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <HiOutlineSquares2X2 className="w-16 h-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                No hay categorías disponibles
              </h2>
              <p className="text-gray-400 mb-6">
                Intenta de nuevo más tarde
              </p>
              <Link
                to={ROUTES.HOME}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
