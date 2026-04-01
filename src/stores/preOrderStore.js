import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePreOrderStore = create(
  persist(
    (set) => ({
      preOrder: null,

      setPreOrder: (data) => set({ preOrder: data }),
    }),
    { name: 'pre-order-storage' }
  )
);

export default usePreOrderStore;
