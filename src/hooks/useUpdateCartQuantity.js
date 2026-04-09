import { useCallback } from 'react';
import { cartService } from '../api/services/cartService';
import useCartStore from '../stores/cartStore';
import useUserStore from '../stores/userStore';
import { isSameCartLine } from '../utils/cartLineUtils';

export const useUpdateCartQuantity = () => {
  const isAuthenticated = !!useUserStore((s) => s.user);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const updateQuantityInCart = useCallback(
    (itemId, size, newQuantity, productVariantId) => {
      const item = items.find((i) =>
        isSameCartLine(i, { productId: itemId, size, productVariantId })
      );
      const variantIdForApi = item?.productVariantId;

      updateQuantity(itemId, newQuantity, size, productVariantId);

      if (isAuthenticated && variantIdForApi >= 1 && newQuantity >= 1) {
        const variantId = Math.floor(Number(variantIdForApi));
        const qty = Math.floor(Number(newQuantity) || 1);
        cartService
          .updateProductQuantity({
            productVariantId: variantId,
            quantity: qty,
          })
          .catch(() => {});
      }
    },
    [isAuthenticated, items, updateQuantity]
  );

  return { updateQuantityInCart };
};
