import { useEffect, useMemo } from 'react';
import useCategoriesStore from '../stores/categoriesStore';

/**
 * Custom hook to get subcategories from the global store.
 * Fetches once and shares data across all components.
 * @param {number|string|null} categoryId - Filter subcategories by category
 */
export const useSubcategories = (categoryId = null) => {
  const subcategories = useCategoriesStore((state) => state.subcategories);
  const isLoading = useCategoriesStore((state) => state.isSubcategoriesLoading);
  const isLoaded = useCategoriesStore((state) => state.isSubcategoriesLoaded);
  const error = useCategoriesStore((state) => state.subcategoriesError);
  const fetchSubcategories = useCategoriesStore((state) => state.fetchSubcategories);

  useEffect(() => {
    fetchSubcategories().catch(() => {});
  }, [fetchSubcategories]);

  const filteredSubcategories = useMemo(() => {
    const list = subcategories ?? [];
    if (!Array.isArray(list)) return [];
    if (!categoryId) return [];

    return list.filter(
      (subcategory) =>
        String(subcategory.category_id) === String(categoryId) ||
        String(subcategory.categoryId) === String(categoryId) ||
        String(subcategory.parent_id) === String(categoryId) ||
        String(subcategory.parentId) === String(categoryId)
    );
  }, [subcategories, categoryId]);

  return {
    subcategories: filteredSubcategories,
    isLoading: isLoading || (!isLoaded && (subcategories?.length ?? 0) === 0),
    isError: !!error,
    error,
    mutate: fetchSubcategories,
  };
};
