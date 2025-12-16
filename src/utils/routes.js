/**
 * Centralización de todas las rutas de la aplicación
 * Facilita el mantenimiento y cambios futuros de URLs
 */

export const ROUTES = {
  // Páginas principales
  HOME: '/',
  NOT_FOUND: '*',

  // Autenticación
  LOGIN: '/iniciar-sesion',
  REGISTER: '/registro',

  // Crédito
  REQUEST_CREDIT: '/solicitar-credito',
  CREDIT_REQUEST: '/solicitud-credito',

  // Productos
  PRODUCTS: '/productos',
  PRODUCT_DETAIL: '/producto',

  // Carrito y compras
  CART: '/carrito',
  CHECKOUT: '/pago',
  MY_ORDERS: '/mis-compras',
  OFFERS: '/ofertas',

  // Cuenta
  MY_ACCOUNT: '/mi-cuenta',
  MY_PROFILE: '/mi-perfil',

  // Legal
  TERMS: '/terminos',
  PRIVACY: '/privacidad',
};

/**
 * Genera la URL del detalle de un producto con query params
 * @param {number|string} productId - ID del producto
 * @param {string} [category] - Categoría del producto (opcional)
 * @returns {string} - URL completa con query params
 */
export const getProductDetailUrl = (productId, category = null) => {
  const params = new URLSearchParams({ id: productId });
  if (category) {
    params.set('category', category);
  }
  return `${ROUTES.PRODUCT_DETAIL}?${params.toString()}`;
};

/**
 * Genera la URL del catálogo de productos con filtros
 * @param {Object} filters - Objeto con los filtros a aplicar
 * @param {string} [filters.q] - Término de búsqueda
 * @param {string|string[]} [filters.categories] - Categoría(s) a filtrar
 * @param {string} [filters.sort] - Ordenamiento
 * @param {number} [filters.minPrice] - Precio mínimo
 * @param {number} [filters.maxPrice] - Precio máximo
 * @param {boolean} [filters.onSale] - Solo ofertas
 * @param {boolean} [filters.inStock] - Solo disponibles
 * @param {number} [filters.minRating] - Calificación mínima
 * @param {number} [filters.minDiscount] - Descuento mínimo
 * @param {number} [filters.maxDiscount] - Descuento máximo
 * @param {boolean} [filters.new] - Solo productos nuevos
 * @returns {string} - URL completa con query params
 */
export const getProductsUrl = (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.q) params.set('q', filters.q);
  if (filters.categories) {
    const categories = Array.isArray(filters.categories) 
      ? filters.categories.join(',') 
      : filters.categories;
    params.set('categories', categories);
  }
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.minPrice !== undefined) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice);
  if (filters.onSale) params.set('onSale', 'true');
  if (filters.inStock !== undefined) params.set('inStock', filters.inStock);
  if (filters.minRating !== undefined) params.set('minRating', filters.minRating);
  if (filters.minDiscount !== undefined) params.set('minDiscount', filters.minDiscount);
  if (filters.maxDiscount !== undefined) params.set('maxDiscount', filters.maxDiscount);
  if (filters.new) params.set('new', 'true');

  const queryString = params.toString();
  return queryString ? `${ROUTES.PRODUCTS}?${queryString}` : ROUTES.PRODUCTS;
};

/**
 * Genera la URL de búsqueda de productos
 * @param {string} searchTerm - Término de búsqueda
 * @returns {string} - URL de búsqueda
 */
export const getSearchUrl = (searchTerm) => {
  return getProductsUrl({ q: searchTerm });
};

/**
 * Genera la URL de productos filtrados por categoría
 * @param {string|string[]} categories - Categoría(s) a filtrar
 * @returns {string} - URL con filtro de categoría
 */
export const getProductsByCategoryUrl = (categories) => {
  return getProductsUrl({ categories });
};

