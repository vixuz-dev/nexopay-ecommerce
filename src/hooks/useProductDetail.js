import { useState, useEffect } from 'react';
import { productsService } from '../api/services/productsService';

/**
 * Extrae el objeto producto del body de `get_product_by_id` (formas habituales del API).
 * @param {object|null|undefined} data - Respuesta cruda del servicio
 * @returns {object|null}
 */
const extractProductFromDetailResponse = (data) => {
  if (!data || typeof data !== 'object') return null;
  const body = data.body;
  if (body == null) return null;
  if (Array.isArray(body)) return body[0] ?? null;
  if (typeof body === 'object') {
    if (body.product && typeof body.product === 'object') return body.product;
    if (Array.isArray(body.products) && body.products.length > 0) return body.products[0];
    if (
      body.productId != null ||
      body.product_id != null ||
      body.productName != null ||
      body.product_name != null
    ) {
      return body;
    }
  }
  if (data.product && typeof data.product === 'object') return data.product;
  return null;
};

/**
 * Carga el detalle de un producto por ID (`get_product_by_id`).
 * @param {string|null|undefined} productId - ID de catálogo
 * @returns {{ product: object|null, loading: boolean, error: string|null }}
 */
export const useProductDetail = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = productId != null ? String(productId).trim() : '';

    const loadProduct = async () => {
      if (!id) {
        setError('Parámetros incompletos para cargar el producto');
        setProduct(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await productsService.getProductById(id);
        const raw = extractProductFromDetailResponse(data);

        if (!raw) {
          setError('Producto no encontrado');
          setProduct(null);
        } else {
          setProduct(raw);
        }
      } catch (err) {
        setError(err.message || 'Error al cargar el producto');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  return { product, loading, error };
};
