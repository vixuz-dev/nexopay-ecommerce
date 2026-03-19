import useSWR from 'swr';
import { productsService } from '../api/services/productsService';

/**
 * Fetches affiliate products with SWR caching and pagination
 * @param {Object} params - Query parameters
 * @param {number} params.affiliateId - Affiliate ID
 * @param {number} params.categoryId - Category ID (0 for all)
 * @param {string} params.filter - Filter type (default: 'category')
 * @param {number} params.page - Page number (1-based)
 * @param {number} params.totalItems - Items per page
 * @returns {object} - { products, isLoading, isError, error, mutate }
 */
export const useAffiliateProductsApi = (params) => {
  if (!params || !params.affiliateId) {
    return {
      products: [],
      isLoading: false,
      isError: false,
      error: null,
      mutate: () => {},
    };
  }

  const { affiliateId, categoryId = 0, filter = 'category', page = 1, totalItems = 20 } = params;
  const offset = (page - 1) * totalItems;

  const cacheKey = `affiliate-products-${affiliateId}-${categoryId}-${filter}-${page}-${totalItems}`;

  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    () => productsService.getAffiliateProducts({
      affiliateId,
      filter,
      categoryId,
      limit: totalItems,
      offset,
    }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 5 * 60 * 1000,
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
