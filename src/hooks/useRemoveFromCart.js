import { useCallback } from 'react';
import { cartService } from '../api/services/cartService';
import useCartStore from '../stores/cartStore';
import { useAuth } from '../context/AuthContext';

export const useRemoveFromCart = () => {
  const { isAuthenticated } = useAuth();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);

  const removeFromCart = useCallback(
    (itemId, size = null) => {
      const normalizedSize = size || 'Estándar';
      const item = items.find(
        (i) => String(i.id) === String(itemId) && i.size === normalizedSize
      );
      const productVariantId = item?.productVariantId;

      removeItem(itemId, size);

      if (isAuthenticated && productVariantId >= 1) {
        cartService
          .deleteProductFromCart({ productVariantId: Number(productVariantId) })
          .catch(() => {});
      }
    },
    [isAuthenticated, items, removeItem]
  );

  return { removeFromCart };
};
