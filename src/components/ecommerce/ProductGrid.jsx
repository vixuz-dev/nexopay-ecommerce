import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products = [], loading = false, limit = null, showAddToCart = false }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">No hay productos disponibles</p>
      </div>
    );
  }

  const displayedProducts = limit ? products.slice(0, limit) : products;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
      {displayedProducts.map((product) => (
        <ProductCard key={product.id} product={product} showAddToCart={showAddToCart} />
      ))}
    </div>
  );
};

export default ProductGrid;

