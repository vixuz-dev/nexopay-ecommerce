import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import ProductGrid from '../components/ecommerce/ProductGrid';
import SidebarFilter from '../components/ecommerce/SidebarFilter';
import { useProductsApi } from '../hooks/useProductsApi';
import { useCategories } from '../hooks/useCategories';
import { useDebounce } from '../hooks/useDebounce';
import { mapApiProductToComponent } from '../utils/productMapper';
import { HiOutlineFunnel, HiOutlineXMark } from 'react-icons/hi2';
import Dropdown from '../components/common/Dropdown';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const search = searchParams.get('q') || '';
  const categoryIdParam = searchParams.get('categoryId');
  const subcategoryIdParam = searchParams.get('subcategoryId');
  const sortBy = searchParams.get('sort') || 'name-asc';
  const page = parseInt(searchParams.get('page')) || 1;
  const totalItems = parseInt(searchParams.get('totalItems')) || 20;

  const { categories: apiCategories, isLoading: categoriesLoading } = useCategories();

  const categoryId = categoryIdParam ? parseInt(categoryIdParam) : 0;
  const subcategoryId = subcategoryIdParam ? parseInt(subcategoryIdParam) : 0;
  const availabilityParam = searchParams.get('availability') || '';

  const selectedCategories = useMemo(() => {
    if (!apiCategories || categoryId === 0) return [];
    const categoriesArray = Array.isArray(apiCategories) ? apiCategories : [];
    const category = categoriesArray.find(cat => {
      const id = cat.id || cat.category_id || cat.categoryId;
      return id === categoryId;
    });
    return category ? [category.name || category.category_name || category.title || category.categoryName || ''] : [];
  }, [apiCategories, categoryId]);

  const apiParams = useMemo(() => ({
    page,
    totalItems,
    categoryId: categoryId || 0,
    subcategoryId: subcategoryId || 0,
    productName: search || '',
  }), [page, totalItems, categoryId, subcategoryId, search]);

  const { products: apiProducts, isLoading: productsLoading, isError, error } = useProductsApi(apiParams);

  const products = useMemo(() => {
    if (!apiProducts || apiProducts.length === 0) return [];
    return apiProducts.map(mapApiProductToComponent);
  }, [apiProducts]);

  const maxProductPrice = useMemo(() => {
    if (!products || products.length === 0) return 0;
    return Math.max(...products.map(p => p.price || 0));
  }, [products]);

  const loading = productsLoading || categoriesLoading;

  const categories = useMemo(() => {
    if (!apiCategories) return [];
    const categoriesArray = Array.isArray(apiCategories) ? apiCategories : [];
    return categoriesArray.map(cat => {
      return cat.name || cat.category_name || cat.title || cat.categoryName || '';
    }).filter(Boolean);
  }, [apiCategories]);

  const categoriesMap = useMemo(() => {
    if (!apiCategories) return new Map();
    const categoriesArray = Array.isArray(apiCategories) ? apiCategories : [];
    const map = new Map();
    categoriesArray.forEach(cat => {
      const name = cat.name || cat.category_name || cat.title || cat.categoryName || '';
      const id = cat.id || cat.category_id || cat.categoryId;
      if (name && id) {
        map.set(name, id);
      }
    });
    return map;
  }, [apiCategories]);

  const handleSearchChange = (e) => {
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

  const handleCategoryChange = (categoryName, isChecked) => {
    setSearchParams(prev => {
      if (isChecked) {
        // Si se selecciona una categoría, reemplazar la anterior (solo permitir 1)
        const categoryId = categoriesMap.get(categoryName);
        if (categoryId) {
          prev.set('categoryId', categoryId);
          // Remover subcategoryId cuando se cambia de categoría
          prev.delete('subcategoryId');
        }
      } else {
        // Si se deselecciona, remover categoryId de la URL
        prev.delete('categoryId');
        // También remover subcategoryId
        prev.delete('subcategoryId');
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

  const handleAvailabilityChange = (option, isChecked) => {
    setSearchParams(prev => {
      const current = prev.get('availability');

      if (isChecked) {
        // Solo una opción permitida: reemplazar valor actual
        prev.set('availability', option);
      } else if (current === option) {
        // Si se deselecciona la opción activa, eliminar el query param
        prev.delete('availability');
      }

      return prev;
    });
  };

  const clearFilters = () => {
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

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    !!search ||
    !!availabilityParam;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
  
      <div
        className="flex flex-1 overflow-hidden"
        style={{ height: 'calc(100vh - 4rem)' }}
      >
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0 bg-white border-r border-gray-200">
          <div className="h-full overflow-y-auto">
            <div className="p-6">
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
                minPrice={undefined}
                maxPrice={undefined}
                maxProductPrice={maxProductPrice}
                onPriceChange={handlePriceFilter}
                showOnlyInStock={availabilityParam === 'inStock'}
                onInStockChange={(checked) => handleAvailabilityChange('inStock', checked)}
                showOnlyOnSale={availabilityParam === 'onSale'}
                onOnSaleChange={(checked) => handleAvailabilityChange('onSale', checked)}
                minRating={undefined}
                onRatingChange={() => {}}
                minDiscount={undefined}
                maxDiscount={undefined}
                onDiscountChange={() => {}}
                showOnlyNew={availabilityParam === 'new'}
                onNewChange={(checked) => handleAvailabilityChange('new', checked)}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </div>
        </aside>
  
        {/* Main Content Area - Solo este hace scroll */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div
              className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
              onClick={() => setShowMobileFilters(false)}
            >
              <div
                className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
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
                    minPrice={undefined}
                    maxPrice={undefined}
                    maxProductPrice={maxProductPrice}
                    onPriceChange={handlePriceFilter}
                    showOnlyInStock={availabilityParam === 'inStock'}
                    onInStockChange={(checked) => handleAvailabilityChange('inStock', checked)}
                    showOnlyOnSale={availabilityParam === 'onSale'}
                    onOnSaleChange={(checked) => handleAvailabilityChange('onSale', checked)}
                    minRating={undefined}
                    onRatingChange={() => {}}
                    minDiscount={undefined}
                    maxDiscount={undefined}
                    onDiscountChange={() => {}}
                    showOnlyNew={availabilityParam === 'new'}
                    onNewChange={(checked) => handleAvailabilityChange('new', checked)}
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
  
          {/* Products Section */}
          <div>
            {!loading && products.length > 0 && (
              <div className="mb-4 text-sm text-gray-600">
                <span>
                  {products.length} {products.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                </span>
              </div>
            )}
  
            {isError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  {error?.message || 'Error al cargar los productos. Por favor, intenta nuevamente.'}
                </p>
              </div>
            )}
  
            <ProductGrid
              products={products}
              loading={loading}
              searchQuery={search}
              categoryName={selectedCategories[0] || null}
            />
          </div>
        </div>
      </main>
    </div>
  
    <Footer />
  </div>
  
  );
};

export default Products;
