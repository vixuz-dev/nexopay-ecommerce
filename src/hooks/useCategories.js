import { useEffect } from 'react';
import useCategoriesStore from '../stores/categoriesStore';

/**
 * Custom hook to get categories from the global store.
 * Fetches once and shares data across all components.
 */
export const useCategories = () => {
  const categories = useCategoriesStore((state) => state.categories);
  const isLoading = useCategoriesStore((state) => state.isCategoriesLoading);
  const isLoaded = useCategoriesStore((state) => state.isCategoriesLoaded);
  const error = useCategoriesStore((state) => state.categoriesError);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  useEffect(() => {
    fetchCategories().catch(() => {});
  }, [fetchCategories]);

  return {
    categories: categories ?? [],
    isLoading: isLoading || (!isLoaded && categories.length === 0),
    isError: !!error,
    error,
    mutate: fetchCategories,
  };
};
