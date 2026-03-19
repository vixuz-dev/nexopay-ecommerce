import { useState, useEffect, useCallback } from 'react';
import { ecommercePaymentService } from '../api/services/ecommercePaymentService';

export const usePendingPayments = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await ecommercePaymentService.getPendingPayments();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingPayments();
  }, [fetchPendingPayments]);

  return {
    data,
    loading,
    error,
    refetch: fetchPendingPayments,
  };
};
