const STATUS_NORMALIZE = {
  Pendiente: 'pending',
  pending: 'pending',
  Completado: 'completed',
  completed: 'completed',
  Cancelado: 'cancelled',
  cancelled: 'cancelled',
  'En envío': 'shipping',
  Enviado: 'shipping',
  shipping: 'shipping',
};

export const mapOrderFromApi = (order) => ({
  id: order.order_id?.toString() ?? order.folio,
  folio: order.folio,
  order_id: order.order_id,
  total: order.total ?? 0,
  date: order.created_at,
  status: STATUS_NORMALIZE[order.order_status] ?? 'pending',
  order_status: order.order_status,
  product_quantity: order.product_quantity ?? 0,
});
