import { useCallback } from 'react';
import { cartService } from '../api/services/cartService';
import useCartStore from '../stores/cartStore';
import useUserStore from '../stores/userStore';

export const useAddToCart = () => {
  const isAuthenticated = !!useUserStore((s) => s.user);
  const addItem = useCartStore((s) => s.addItem);

  const addToCart = useCallback(
    (product, quantity = 1, size = null, options = {}) => {
      const productVariantId = options.productVariantId ?? product.productVariantId ?? product.product_variant_id;
      const variantId = productVariantId ?? product.id;

      addItem(product, quantity, size, options);

      if (isAuthenticated && variantId >= 1) {
        const variantIdInt = Math.floor(Number(variantId));
        const qty = Math.max(1, Math.floor(Number(quantity) || 1));
        cartService
          .addProductToCart({
            productVariantId: variantIdInt,
            quantity: qty,
          })
          .catch(() => {});
      }

      return true;
    },
    [isAuthenticated, addItem]
  );

  return { addToCart };
};
