import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import ProductGrid from '../components/ecommerce/ProductGrid';
import SidebarFilter from '../components/ecommerce/SidebarFilter';
import { useProducts, getCategories } from '../hooks';
import { useDebounce } from '../hooks/useDebounce';
import { HiOutlineFunnel, HiOutlineXMark } from 'react-icons/hi2';
import Dropdown from '../components/common/Dropdown';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const search = searchParams.get('q') || '';
  const categoriesParam = searchParams.get('categories') || '';
  const selectedCategories = categoriesParam ? categoriesParam.split(',') : [];
  const sortBy = searchParams.get('sort') || 'name-asc';
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')) : undefined;
  const onSale = searchParams.get('onSale') === 'true';
  const inStock = searchParams.get('inStock') !== 'false';
  const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')) : undefined;
  const minDiscount = searchParams.get('minDiscount') ? parseInt(searchParams.get('minDiscount')) : undefined;
  const maxDiscount = searchParams.get('maxDiscount') ? parseInt(searchParams.get('maxDiscount')) : undefined;
  const showOnlyNew = searchParams.get('new') === 'true';

  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 300);

  const categories = getCategories();

  const filters = useMemo(() => ({
    search: debouncedSearch,
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    sortBy,
    minPrice,
    maxPrice,
    onSale,
    inStock: inStock !== undefined ? inStock : undefined,
    minRating,
    minDiscount,
    maxDiscount,
    showOnlyNew
  }), [debouncedSearch, selectedCategories, sortBy, minPrice, maxPrice, onSale, inStock, minRating, minDiscount, maxDiscount, showOnlyNew]);

  const { products, loading } = useProducts(filters);

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
    if (e.target.value) {
      setSearchParams(prev => {
        prev.set('q', e.target.value);
        return prev;
      });
    } else {
      setSearchParams(prev => {
        prev.delete('q');
        return prev;
      });
    }
  };

  const handleCategoryChange = (category, isChecked) => {
    setSearchParams(prev => {
      const currentCategories = prev.get('categories') ? prev.get('categories').split(',') : [];
      let newCategories;
      
      if (isChecked) {
        newCategories = [...currentCategories, category];
      } else {
        newCategories = currentCategories.filter(cat => cat !== category);
      }
      
      if (newCategories.length > 0) {
        prev.set('categories', newCategories.join(','));
      } else {
        prev.delete('categories');
      }
      return prev;
    });
  };

  const handleSortChange = (sort) => {
    setSearchParams(prev => {
      prev.set('sort', sort);
      return prev;
    });
  };

  const handlePriceFilter = (type, value) => {
    setSearchParams(prev => {
      const paramName = type === 'min' ? 'minPrice' : 'maxPrice';
      if (value && value !== '') {
        prev.set(paramName, value);
      } else {
        prev.delete(paramName);
      }
      return prev;
    });
  };

  const handleToggleFilter = (filterName, value) => {
    setSearchParams(prev => {
      if (value) {
        prev.set(filterName, 'true');
      } else {
        prev.delete(filterName);
      }
      return prev;
    });
  };

  const clearFilters = () => {
    setLocalSearch('');
    setSearchParams({});
  };

  const sortOptions = [
    { value: 'name-asc', label: 'Nombre (A-Z)' },
    { value: 'name-desc', label: 'Nombre (Z-A)' },
    { value: 'price-asc', label: 'Precio: Menor a Mayor' },
    { value: 'price-desc', label: 'Precio: Mayor a Menor' },
    { value: 'rating-desc', label: 'Mejor Valorados' }
  ];

  const categoryOptions = [
    { value: '', label: 'Todas las categorías' },
    ...categories.map(cat => ({ value: cat, label: cat }))
  ];

  const hasActiveFilters = selectedCategories.length > 0 || minPrice || maxPrice || onSale || search || minRating || minDiscount || maxDiscount || showOnlyNew;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Toggle Button */}
        <div className="mb-6 lg:hidden">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <HiOutlineFunnel className="w-5 h-5" />
            Filtros
          </button>
        </div>

        {/* Mobile Filters Overlay */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)}>
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <HiOutlineXMark className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
                <SidebarFilter
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onCategoryChange={handleCategoryChange}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onPriceChange={handlePriceFilter}
                  showOnlyInStock={inStock}
                  onInStockChange={(checked) => handleToggleFilter('inStock', checked)}
                  showOnlyOnSale={onSale}
                  onOnSaleChange={(checked) => handleToggleFilter('onSale', checked)}
                  minRating={minRating}
                  onRatingChange={(rating) => {
                    setSearchParams(prev => {
                      if (rating) {
                        prev.set('minRating', rating);
                      } else {
                        prev.delete('minRating');
                      }
                      return prev;
                    });
                  }}
                  minDiscount={minDiscount}
                  maxDiscount={maxDiscount}
                  onDiscountChange={(type, value) => {
                    setSearchParams(prev => {
                      const paramName = type === 'min' ? 'minDiscount' : 'maxDiscount';
                      if (value && value !== '') {
                        prev.set(paramName, value);
                      } else {
                        prev.delete(paramName);
                      }
                      return prev;
                    });
                  }}
                  showOnlyNew={showOnlyNew}
                  onNewChange={(checked) => handleToggleFilter('new', checked)}
                  onClearFilters={() => {
                    clearFilters();
                    setShowMobileFilters(false);
                  }}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content: Sidebar + Products Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    Limpiar
                  </button>
                )}
              </div>
              <SidebarFilter
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onPriceChange={handlePriceFilter}
                showOnlyInStock={inStock}
                onInStockChange={(checked) => handleToggleFilter('inStock', checked)}
                showOnlyOnSale={onSale}
                onOnSaleChange={(checked) => handleToggleFilter('onSale', checked)}
                minRating={minRating}
                onRatingChange={(rating) => {
                  setSearchParams(prev => {
                    if (rating) {
                      prev.set('minRating', rating);
                    } else {
                      prev.delete('minRating');
                    }
                    return prev;
                  });
                }}
                minDiscount={minDiscount}
                maxDiscount={maxDiscount}
                onDiscountChange={(type, value) => {
                  setSearchParams(prev => {
                    const paramName = type === 'min' ? 'minDiscount' : 'maxDiscount';
                    if (value && value !== '') {
                      prev.set(paramName, value);
                    } else {
                      prev.delete(paramName);
                    }
                    return prev;
                  });
                }}
                showOnlyNew={showOnlyNew}
                onNewChange={(checked) => handleToggleFilter('new', checked)}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          {/* Products Section */}
          <div className="flex-1">
            {/* Results Count */}
            {!loading && (
              <div className="mb-4 text-sm text-gray-600">
                {products.length === 0 ? (
                  <span>No se encontraron productos</span>
                ) : (
                  <span>
                    {products.length} {products.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                  </span>
                )}
              </div>
            )}

            {/* Products Grid */}
            <ProductGrid products={products} loading={loading} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;

