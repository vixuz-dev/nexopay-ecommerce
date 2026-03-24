import { useState, useCallback } from 'react';
import { cartService } from '../api/services/cartService';
import { mapApiCartToStoreItems } from '../utils/cartMapper';
import useCartStore from '../stores/cartStore';

export const useCartApi = (options = {}) => {
  const { syncToStore = true } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const setItemsFromApi = useCartStore((s) => s.setItemsFromApi);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartService.getCart();
      const items = mapApiCartToStoreItems(data);

      if (syncToStore && setItemsFromApi) {
        setItemsFromApi(items);
      }

      return { data, items };
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [syncToStore, setItemsFromApi]);

  return {
    fetchCart,
    loading,
    error,
  };
};
