import { useCallback } from 'react';
import { cartService } from '../api/services/cartService';
import useCartStore from '../stores/cartStore';
import { useAuth } from '../context/AuthContext';

export const useClearCart = () => {
  const { isAuthenticated } = useAuth();
  const clearCart = useCartStore((s) => s.clearCart);

  const clearCartWithApi = useCallback(() => {
    clearCart();

    if (isAuthenticated) {
      cartService.deleteCart().catch(() => {});
    }
  }, [isAuthenticated, clearCart]);

  return { clearCart: clearCartWithApi };
};
