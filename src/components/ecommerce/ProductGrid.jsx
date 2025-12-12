import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

// Datos de ejemplo - esto se reemplazará con una llamada a la API
const mockProducts = [
  {
    id: 1,
    name: 'Smartphone Samsung Galaxy A54',
    price: 8999,
    originalPrice: 10999,
    discount: 18,
    image: null,
    category: 'Electrónica',
    rating: 4.5,
    inStock: true
  },
  {
    id: 2,
    name: 'Laptop HP Pavilion 15',
    price: 12999,
    originalPrice: 14999,
    discount: 13,
    image: null,
    category: 'Computadoras',
    rating: 4.7,
    inStock: true
  },
  {
    id: 3,
    name: 'Auriculares Sony WH-1000XM4',
    price: 5999,
    originalPrice: null,
    discount: null,
    image: null,
    category: 'Audio',
    rating: 4.8,
    inStock: true
  },
  {
    id: 4,
    name: 'Tablet iPad Air',
    price: 10999,
    originalPrice: 12999,
    discount: 15,
    image: null,
    category: 'Tablets',
    rating: 4.6,
    inStock: true
  },
  {
    id: 5,
    name: 'Smart TV LG 55" 4K',
    price: 14999,
    originalPrice: 17999,
    discount: 17,
    image: null,
    category: 'Televisores',
    rating: 4.4,
    inStock: true
  },
  {
    id: 6,
    name: 'Cámara Canon EOS Rebel',
    price: 15999,
    originalPrice: null,
    discount: null,
    image: null,
    category: 'Fotografía',
    rating: 4.9,
    inStock: false
  }
];

const ProductGrid = ({ limit = null }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simular carga de productos
    const loadProducts = async () => {
      try {
        setLoading(true);
        // Aquí iría la llamada real a la API
        // const response = await fetch('/api/products');
        // const data = await response.json();
        
        // Por ahora usamos datos mock
        await new Promise(resolve => setTimeout(resolve, 500));
        setProducts(mockProducts);
      } catch (err) {
        setError('Error al cargar los productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 text-lg">{error}</p>
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
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;

