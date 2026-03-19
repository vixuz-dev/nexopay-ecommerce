import { useState, useEffect } from 'react';
import { productsService } from '../api/services/productsService';
import { mapSimilarProductToComponent } from '../utils/productMapper';

/**
 * Fetches similar products by categoryId using get_similar_products API
 * @param {number} categoryId - Category ID
 * @param {number} limit - Max products to return
 * @param {number} offset - Pagination offset
 * @param {number} excludeProductId - Product ID to exclude (current product)
 * @returns {object} - { products, loading, error }
 */
export const useSimilarProducts = (categoryId, limit = 10, offset = 0, excludeProductId = null) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) {
      setProducts([]);
      setLoading(false);
      setError(null);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productsService.getSimilarProducts({
          categoryId,
          limit: limit + (excludeProductId ? 1 : 0),
          offset,
        });

        const rawList = (() => {
          if (!data) return [];
          if (Array.isArray(data)) return data;
          if (Array.isArray(data?.body?.products)) return data.body.products;
          if (Array.isArray(data?.body)) return data.body;
          if (Array.isArray(data?.products)) return data.products;
          return [];
        })();

        const mapped = rawList
          .filter((p) => (p.productId ?? p.id) !== excludeProductId)
          .slice(0, limit)
          .map(mapSimilarProductToComponent);

        setProducts(mapped);
      } catch (err) {
        setError(err?.message || 'Error al cargar productos similares');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [categoryId, limit, offset, excludeProductId]);

  return { products, loading, error };
};
