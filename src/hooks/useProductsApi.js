import useSWR from 'swr';
import { productsService } from '../api/services/productsService';

/**
 * Custom hook to fetch products with SWR caching
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.totalItems - Items per page
 * @param {number} params.categoryId - Category ID
 * @param {number} params.subcategoryId - Subcategory ID
 * @param {string} params.productName - Product name search term
 * @returns {object} - { products, isLoading, isError, error, mutate }
 */
export const useProductsApi = (params) => {
  if (!params || typeof params.page !== 'number' || typeof params.totalItems !== 'number') {
    return {
      products: [],
      isLoading: false,
      isError: false,
      error: null,
      mutate: () => {},
    };
  }

  const { page, totalItems, categoryId, subcategoryId, productName } = params;

  const cacheKey = `products-${page}-${totalItems}-${categoryId || 0}-${subcategoryId || 0}-${productName || ''}`;

  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    () => productsService.getProducts({
      page: Number(page),
      totalItems: Number(totalItems),
      categoryId: Number(categoryId || 0),
      subcategoryId: Number(subcategoryId || 0),
      productName: productName || '',
    }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 5 * 60 * 1000, // 5 minutos para productos
    }
  );

  const products = (() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.body?.products)) return data.body.products;
    if (Array.isArray(data?.body)) return data.body;
    if (Array.isArray(data?.products)) return data.products;
    return [];
  })();

  return {
    products,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

