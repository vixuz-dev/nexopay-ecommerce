import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { homeService } from '../api/services/homeService';

const HOME_CACHE_TTL_MS = 5 * 60 * 1000;

const useHomeStore = create(
  persist(
    (set, get) => ({
      sections: [],
      lastFetchedAt: null,
      isLoading: false,
      error: null,

      fetchHome: async () => {
        const { sections, lastFetchedAt, isLoading } = get();
        const now = Date.now();
        const isStale = !lastFetchedAt || now - lastFetchedAt > HOME_CACHE_TTL_MS;

        if (!isStale && sections.length > 0) {
          return sections;
        }

        if (isLoading) return get().sections;

        set({ isLoading: true, error: null });
        try {
          const { sections: newSections } = await homeService.getHome();
          set({
            sections: newSections,
            lastFetchedAt: Date.now(),
            isLoading: false,
            error: null,
          });
          return newSections;
        } catch (err) {
          set({
            isLoading: false,
            error: err?.message || 'Error al cargar el inicio',
          });
          return get().sections;
        }
      },

      invalidateHome: () => set({ lastFetchedAt: null }),
    }),
    {
      name: 'home-storage',
      partialize: (state) => ({
        sections: state.sections,
        lastFetchedAt: state.lastFetchedAt,
      }),
    }
  )
);

export default useHomeStore;
