import useSWR from 'swr';
import { categoryService } from '../api/services/categoryService';

const CACHE_KEY = 'categories';

/**
 * Custom hook to fetch active categories with SWR caching
 * Cache duration: 30 minutes
 * @returns {object} - { data, error, isLoading, mutate }
 */
export const useCategories = () => {
  const { data, error, isLoading, mutate } = useSWR(
    CACHE_KEY,
    () => categoryService.getActiveCategories(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 30 * 60 * 1000, // 30 minutos
    }
  );

  return {
    categories: data,
    isLoading,
    isError: error,
    error,
    mutate, // Para invalidar/actualizar manualmente si es necesario
  };
};

