import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { categoryService } from '../api/services/categoryService';
import { subcategoryService } from '../api/services/subcategoryService';

const useCategoriesStore = create(
  persist(
    (set, get) => ({
      categories: [],
      subcategories: [],
      isCategoriesLoaded: false,
      isSubcategoriesLoaded: false,
      isCategoriesLoading: false,
      isSubcategoriesLoading: false,
      categoriesError: null,
      subcategoriesError: null,

      fetchCategories: async () => {
        const { isCategoriesLoaded, isCategoriesLoading } = get();
        if (isCategoriesLoaded || isCategoriesLoading) return get().categories;

        set({ categoriesError: null, isCategoriesLoading: true });
        try {
          const data = await categoryService.getActiveCategories();
          const list = Array.isArray(data) ? data : [];
          set({ categories: list, isCategoriesLoaded: true, isCategoriesLoading: false });
          return list;
        } catch (err) {
          set({ categories: [], isCategoriesLoaded: true, isCategoriesLoading: false, categoriesError: err });
          throw err;
        }
      },

      invalidateCategories: () => set({ isCategoriesLoaded: false }),

      fetchSubcategories: async () => {
        const { isSubcategoriesLoaded, isSubcategoriesLoading } = get();
        if (isSubcategoriesLoaded || isSubcategoriesLoading) return get().subcategories;

        set({ subcategoriesError: null, isSubcategoriesLoading: true });
        try {
          const data = await subcategoryService.getActiveSubcategories();
          const list = Array.isArray(data) ? data : [];
          set({ subcategories: list, isSubcategoriesLoaded: true, isSubcategoriesLoading: false });
          return list;
        } catch (err) {
          set({ subcategories: [], isSubcategoriesLoaded: true, isSubcategoriesLoading: false, subcategoriesError: err });
          throw err;
        }
      },

      clearCategories: () => set({
        categories: [],
        subcategories: [],
        isCategoriesLoaded: false,
        isSubcategoriesLoaded: false,
        categoriesError: null,
        subcategoriesError: null,
      }),
    }),
    {
      name: 'categories-storage',
      partialize: (state) => ({
        categories: state.categories,
        subcategories: state.subcategories,
        isCategoriesLoaded: state.isCategoriesLoaded,
        isSubcategoriesLoaded: state.isSubcategoriesLoaded,
      }),
    }
  )
);

export default useCategoriesStore;
