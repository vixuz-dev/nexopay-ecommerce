import { useState, useEffect } from 'react';
import { orderService } from '../api/services/orderService';

export const useOrderDetail = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await orderService.getOrderById(orderId);
        const orderData = data?.orders ?? data;
        setOrder(orderData ?? null);
      } catch (err) {
        setError(err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return { order, loading, error };
};
