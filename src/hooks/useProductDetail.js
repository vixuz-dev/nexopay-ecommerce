import { useState, useEffect } from 'react';
import { productsService } from '../api/services/productsService';

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
        
        if (!productName) {
          setError('Parámetros incompletos para cargar el producto');
          setLoading(false);
          return;
        }

        const data = await productsService.getProducts({
          page: 1,
          totalItems: 20,
          categoryId: categoryId ? Number(categoryId) : 0,
          subcategoryId: subcategoryId ? Number(subcategoryId) : 0,
          productName: productName,
        });

        const productsList = (() => {
          if (!data) return [];
          if (Array.isArray(data)) return data;
          if (Array.isArray(data?.body?.products)) return data.body.products;
          if (Array.isArray(data?.body)) return data.body;
          if (Array.isArray(data?.products)) return data.products;
          return [];
        })();

        if (productsList.length > 0) {
          setProduct(productsList[0]);
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

