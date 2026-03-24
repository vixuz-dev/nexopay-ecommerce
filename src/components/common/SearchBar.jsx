import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineArrowRight } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { useSearchProducts } from '../../hooks/useSearchProducts';
import { getProductDetailUrl, getSearchUrl } from '../../utils/routes';

const formatPrice = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount ?? 0);
};

const SearchBar = ({ placeholder = "Buscar productos, marcas y más...", onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { products: searchResults, loading: searchLoading } = useSearchProducts(
    debouncedSearch.trim().length >= 2 ? debouncedSearch : ''
  );

  useEffect(() => {
    if (debouncedSearch.trim().length >= 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [debouncedSearch]);

  // Cerrar resultados al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        resultsRef.current &&
        !searchRef.current.contains(event.target) &&
        !resultsRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowResults(false);
      if (onSearch) {
        onSearch(searchTerm);
      } else {
        navigate(getSearchUrl(searchTerm));
      }
    }
  };

  const handleProductClick = (product) => {
    setShowResults(false);
    setSearchTerm('');
    const url = getProductDetailUrl(
      product.name,
      product.categoryId ?? null,
      product.subcategoryId ?? null
    );
    navigate(url);
  };

  const handleViewAll = () => {
    setShowResults(false);
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      navigate(getSearchUrl(searchTerm));
    }
  };

  return (
    <div className="relative w-full max-w-2xl" ref={searchRef}>
      <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <HiOutlineMagnifyingGlass className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (debouncedSearch.trim().length >= 2) {
                setShowResults(true);
              }
            }}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-700 placeholder-gray-400 transition-colors duration-200"
        />
      </div>
    </form>

      {/* Dropdown de resultados */}
      {showResults && searchLoading && (
        <div
          ref={resultsRef}
          className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-4"
        >
          <p className="text-gray-500 text-center text-sm">Buscando...</p>
        </div>
      )}

      {showResults && !searchLoading && searchResults.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto"
        >
          <div className="p-2">
            {searchResults.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {product.category && (
                      <span className="text-sm text-gray-500">{product.category}</span>
                    )}
                    <span className="text-sm font-semibold text-primary-600">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
                <HiOutlineArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0 ml-4" />
              </button>
            ))}
            
            {searchResults.length >= 8 && (
              <button
                onClick={handleViewAll}
                className="w-full text-center px-4 py-3 text-primary-600 font-semibold hover:bg-primary-50 rounded-lg transition-colors mt-2 border-t border-gray-200 pt-3"
              >
                Ver todos los resultados
              </button>
            )}
          </div>
        </div>
      )}

      {showResults && !searchLoading && searchResults.length === 0 && debouncedSearch.trim().length >= 2 && (
        <div
          ref={resultsRef}
          className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-4"
        >
          <p className="text-gray-600 text-center py-4">
            No se encontraron productos para "{debouncedSearch}"
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

