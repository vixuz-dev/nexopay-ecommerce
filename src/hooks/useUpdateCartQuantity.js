import { useCallback } from 'react';
import { cartService } from '../api/services/cartService';
import useCartStore from '../stores/cartStore';
import { useAuth } from '../context/AuthContext';

export const useUpdateCartQuantity = () => {
  const { isAuthenticated } = useAuth();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const updateQuantityInCart = useCallback(
    (itemId, size, newQuantity) => {
      const normalizedSize = size || 'Estándar';
      const item = items.find(
        (i) => String(i.id) === String(itemId) && i.size === normalizedSize
      );
      const productVariantId = item?.productVariantId;

      updateQuantity(itemId, newQuantity, size);

      if (isAuthenticated && productVariantId >= 1 && newQuantity >= 1) {
        const variantId = Math.floor(Number(productVariantId));
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
