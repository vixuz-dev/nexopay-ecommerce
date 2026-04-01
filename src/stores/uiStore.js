import { create } from 'zustand';

const useUIStore = create((set) => ({
  isCartSidebarOpen: false,
  isGlobalLoaderOpen: false,

  openCartSidebar: () => set({ isCartSidebarOpen: true }),
  closeCartSidebar: () => set({ isCartSidebarOpen: false }),

  showGlobalLoader: () => set({ isGlobalLoaderOpen: true }),
  hideGlobalLoader: () => set({ isGlobalLoaderOpen: false }),
}));

export default useUIStore;

