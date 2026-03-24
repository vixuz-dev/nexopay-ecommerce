import { useState, useEffect, useCallback } from 'react';
import { productsService } from '../api/services/productsService';
import { mapApiProductToComponent } from '../utils/productMapper';

const SEARCH_LIMIT = 8;

export const useSearchProducts = (searchTerm) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (term) => {
    if (!term || term.trim().length < 2) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await productsService.getProducts({
        page: 1,
        totalItems: SEARCH_LIMIT,
        categoryId: 0,
        subcategoryId: 0,
        productName: term.trim(),
      });

      const rawProducts = (() => {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.body?.products)) return data.body.products;
        if (Array.isArray(data?.body)) return data.body;
        if (Array.isArray(data?.products)) return data.products;
        return [];
      })();

      setProducts(rawProducts.map(mapApiProductToComponent));
    } catch (err) {
      setProducts([]);
      setError(err?.message || 'Error al buscar productos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    search(searchTerm);
  }, [searchTerm, search]);

  return { products, loading, error };
};
