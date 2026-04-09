import { useState, useCallback } from 'react';
import { cartService } from '../api/services/cartService';
import { mapApiCartToStoreItems } from '../utils/cartMapper';
import useCartStore from '../stores/cartStore';
import { isSameCartLine } from '../utils/cartLineUtils';

/**
 * Si get_cart devuelve atributos/imagen de la variante por defecto y el cliente ya tiene la línea
 * correcta (p. ej. tras agregar desde PDP), conservamos atributos e imagen locales para esa variante.
 */
function mergeFetchedCartWithLocalItems(apiItems, prevItems) {
  if (!Array.isArray(prevItems) || prevItems.length === 0) return apiItems;

  return apiItems.map((mapped) => {
    const prev = prevItems.find((p) =>
      isSameCartLine(p, {
        productId: mapped.id,
        size: mapped.size,
        productVariantId: mapped.productVariantId,
      })
    );
    if (
      !prev ||
      mapped.productVariantId == null ||
      Number(prev.productVariantId) !== Number(mapped.productVariantId)
    ) {
      return mapped;
    }
    const hasLocalAttrs = Array.isArray(prev.attributes) && prev.attributes.length > 0;
    return {
      ...mapped,
      ...(hasLocalAttrs ? { attributes: prev.attributes } : {}),
      ...(prev.image && prev.image !== mapped.image ? { image: prev.image } : {}),
    };
  });
}

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
      const prevItems = useCartStore.getState().items;
      const mergedItems = mergeFetchedCartWithLocalItems(items, prevItems);

      if (syncToStore && setItemsFromApi) {
        setItemsFromApi(mergedItems);
      }

      return { data, items: mergedItems };
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
