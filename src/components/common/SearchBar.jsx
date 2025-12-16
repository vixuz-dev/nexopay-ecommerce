import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineArrowRight } from 'react-icons/hi2';
import { useNavigate, Link } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';

// Productos simulados para mostrar en los resultados de búsqueda
const mockSearchProducts = [
  { id: 1, name: 'Smartphone Samsung Galaxy A54', price: 8999, category: 'Electrónica' },
  { id: 2, name: 'Laptop HP Pavilion 15', price: 12999, category: 'Computadoras' },
  { id: 3, name: 'Auriculares Sony WH-1000XM4', price: 5999, category: 'Audio' },
  { id: 4, name: 'Tablet iPad Air', price: 10999, category: 'Tablets' },
  { id: 5, name: 'Smart TV LG 55" 4K', price: 14999, category: 'Televisores' },
  { id: 6, name: 'Cámara Canon EOS Rebel', price: 15999, category: 'Fotografía' },
  { id: 7, name: 'Smartwatch Apple Watch Series 9', price: 7999, category: 'Smartwatches' },
  { id: 8, name: 'Consola PlayStation 5', price: 11999, category: 'Gaming' }
];

const formatPrice = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
};

const SearchBar = ({ placeholder = "Buscar productos, marcas y más...", onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Simular búsqueda de productos
  useEffect(() => {
    if (debouncedSearch.trim().length >= 2) {
      const filtered = mockSearchProducts.filter(product =>
        product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.category.toLowerCase().includes(debouncedSearch.toLowerCase())
      ).slice(0, 5); // Mostrar máximo 5 resultados
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
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
        navigate(`/productos?q=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  const handleProductClick = (product) => {
    setShowResults(false);
    setSearchTerm('');
    const params = new URLSearchParams({ id: product.id });
    if (product.category) {
      params.set('category', product.category);
    }
    navigate(`/producto?${params.toString()}`);
  };

  const handleViewAll = () => {
    setShowResults(false);
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      navigate(`/productos?q=${encodeURIComponent(searchTerm)}`);
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
              if (searchResults.length > 0) {
                setShowResults(true);
              }
            }}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-700 placeholder-gray-400 transition-colors duration-200"
        />
      </div>
    </form>

      {/* Dropdown de resultados */}
      {showResults && searchResults.length > 0 && (
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
                <div className="flex-1">
                  <p className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">{product.category}</span>
                    <span className="text-sm font-semibold text-primary-600">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
                <HiOutlineArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0 ml-4" />
              </button>
            ))}
            
            {searchResults.length >= 5 && (
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

      {showResults && searchResults.length === 0 && debouncedSearch.trim().length >= 2 && (
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

