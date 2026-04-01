import { useCallback } from 'react';
import { cartService } from '../api/services/cartService';
import useCartStore from '../stores/cartStore';
import useUserStore from '../stores/userStore';

export const useClearCart = () => {
  const isAuthenticated = !!useUserStore((s) => s.user);
  const clearCart = useCartStore((s) => s.clearCart);

  const clearCartWithApi = useCallback(() => {
    clearCart();

    if (isAuthenticated) {
      cartService.deleteCart().catch(() => {});
    }
  }, [isAuthenticated, clearCart]);

  return { clearCart: clearCartWithApi };
};
