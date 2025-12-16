import { create } from 'zustand';

const useUIStore = create((set) => ({
  isCartSidebarOpen: false,

  openCartSidebar: () => set({ isCartSidebarOpen: true }),
  closeCartSidebar: () => set({ isCartSidebarOpen: false }),
  toggleCartSidebar: () => set((state) => ({ isCartSidebarOpen: !state.isCartSidebarOpen })),
}));

export default useUIStore;

