import { useCallback } from 'react';
import { cartService } from '../api/services/cartService';
import useCartStore from '../stores/cartStore';
import useUserStore from '../stores/userStore';
import { isSameCartLine } from '../utils/cartLineUtils';

export const useRemoveFromCart = () => {
  const isAuthenticated = !!useUserStore((s) => s.user);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);

  const removeFromCart = useCallback(
    (itemId, size = null, productVariantId) => {
      const item = items.find((i) =>
        isSameCartLine(i, { productId: itemId, size, productVariantId })
      );
      const variantIdForApi = item?.productVariantId;

      removeItem(itemId, size, productVariantId);

      if (isAuthenticated && variantIdForApi >= 1) {
        cartService
          .deleteProductFromCart({ productVariantId: Number(variantIdForApi) })
          .catch(() => {});
      }
    },
    [isAuthenticated, items, removeItem]
  );

  return { removeFromCart };
};
