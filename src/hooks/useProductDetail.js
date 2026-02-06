import { useState, useEffect } from 'react';
import { productService } from '../api/services/productService';
import { useCategories } from './useCategories';

/**
 * Custom hook to fetch product detail by product name
 * @param {string} productName - Name of the product
 * @param {number} categoryId - Category ID
 * @param {number} subcategoryId - Subcategory ID
 * @returns {object} - { product, loading, error }
 */
export const useProductDetail = (productName, categoryId, subcategoryId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!productName || !categoryId || !subcategoryId) {
          setError('Parámetros incompletos para cargar el producto');
          setLoading(false);
          return;
        }

        const products = await productService.getProducts({
          page: 1,
          totalItems: 20,
          categoryId: Number(categoryId),
          subcategoryId: Number(subcategoryId),
          productName: productName,
        });

        if (products && products.length > 0) {
          setProduct(products[0]);
        } else {
          setError('Producto no encontrado');
        }
      } catch (err) {
        setError(err.message || 'Error al cargar el producto');
        console.error('Error loading product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productName, categoryId, subcategoryId]);

  return { product, loading, error };
};

