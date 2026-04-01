import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ 
  products = [], 
  loading = false, 
  limit = null, 
  showAddToCart = false,
  searchQuery = '',
  categoryName = null
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (products.length === 0) {
    // Build search description
    const searchParts = [];
    if (categoryName) {
      searchParts.push(`categoría "${categoryName}"`);
    }
    if (searchQuery) {
      searchParts.push(`búsqueda "${searchQuery}"`);
    }
    
    const searchDescription = searchParts.length > 0 
      ? ` con ${searchParts.join(' y ')}`
      : '';

    return (
      <div className="flex items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 140px)' }}>
        <div className="mx-auto max-w-lg text-center">
          <p className="text-gray-900 text-xl sm:text-2xl font-semibold mb-2">
            No se encontraron productos
          </p>

          <p className="text-gray-600 text-base mb-4 leading-relaxed">
            {searchDescription && (
              <>No hay productos disponibles{searchDescription}.</>
            )}
            {!searchDescription && (
              <>No hay productos disponibles en este momento.</>
            )}
          </p>

          <p className="text-gray-500 text-sm">
            Intenta con una búsqueda diferente o explora otras categorías.
          </p>
        </div>
      </div>
    );
  }

  const displayedProducts = limit ? products.slice(0, limit) : products;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayedProducts.map((product) => (
        <ProductCard key={product.id} product={product} showAddToCart={showAddToCart} />
      ))}
    </div>
  );
};

export default ProductGrid;
