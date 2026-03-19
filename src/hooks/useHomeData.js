import { useEffect } from 'react';
import useHomeStore from '../stores/homeStore';

/**
 * Fetches home sections from store; triggers API only when cache is stale (5 min TTL)
 * @returns {{ sections, newProducts, brands, featured, isLoading, error }}
 */
export const useHomeData = () => {
  const sections = useHomeStore((state) => state.sections);
  const isLoading = useHomeStore((state) => state.isLoading);
  const error = useHomeStore((state) => state.error);
  const fetchHome = useHomeStore((state) => state.fetchHome);

  useEffect(() => {
    fetchHome();
  }, [fetchHome]);

  const newSection = sections.find((s) => s.key === 'new');
  const brandsSection = sections.find((s) => s.key === 'brands');
  const featuredSection = sections.find((s) => s.key === 'featured');

  return {
    sections,
    newProducts: newSection?.items ?? [],
    brands: brandsSection?.items ?? [],
    featured: featuredSection?.items ?? [],
    newTitle: newSection?.title ?? 'Lo más nuevo',
    brandsTitle: brandsSection?.title ?? 'Marcas destacadas',
    featuredTitle: featuredSection?.title ?? 'Productos destacados',
    isLoading,
    error,
  };
};
