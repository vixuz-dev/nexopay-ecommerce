import { useState, useEffect, useCallback } from 'react';
import { affiliateService } from '../api/services/affiliateService';

export const useAffiliateSalesSummary = (affiliateId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    if (!affiliateId) {
      setData(null);
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await affiliateService.getAffiliateSalesSummary(affiliateId);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [affiliateId]);

  useEffect(() => {
    if (affiliateId) {
      fetchSummary().catch(() => {});
    } else {
      setData(null);
    }
  }, [affiliateId, fetchSummary]);

  return {
    data,
    loading,
    error,
    refetch: fetchSummary,
  };
};
