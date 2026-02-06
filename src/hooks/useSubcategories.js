import { useMemo } from 'react';
import useSWR from 'swr';
import { subcategoryService } from '../api/services/subcategoryService';

const CACHE_KEY = 'subcategories';

export const useSubcategories = (categoryId = null) => {
  const { data, error, isLoading, mutate } = useSWR(
    CACHE_KEY,
    () => subcategoryService.getActiveSubcategories(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 30 * 60 * 1000,
    }
  );

  const filteredSubcategories = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    if (!categoryId) {
      return [];
    }

    return data.filter(
      (subcategory) =>
        String(subcategory.category_id) === String(categoryId) ||
        String(subcategory.categoryId) === String(categoryId) ||
        String(subcategory.parent_id) === String(categoryId) ||
        String(subcategory.parentId) === String(categoryId)
    );
  }, [data, categoryId]);

  return {
    subcategories: filteredSubcategories,
    isLoading,
    isError: error,
    error,
    mutate,
  };
};

