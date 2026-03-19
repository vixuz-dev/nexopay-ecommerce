import { useState, useEffect, useCallback } from 'react';
import { invoiceService } from '../api/services/invoiceService';
import { mapApiInvoiceToComponent } from '../utils/invoiceMapper';

export const useInvoices = (options = {}) => {
  const { page = 1, limit = 20 } = options;
  const [invoices, setInvoices] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    limit,
    page: 1,
    totalPages: 0,
    hasMore: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { invoices: apiInvoices, pagination: apiPagination } =
        await invoiceService.getInvoicesByStatus({ status: 'Pendiente', page, limit });

      setInvoices((apiInvoices || []).map(mapApiInvoiceToComponent));
      setPagination({
        total: apiPagination?.total ?? 0,
        limit: apiPagination?.limit ?? limit,
        page: apiPagination?.page ?? page,
        totalPages: apiPagination?.totalPages ?? 1,
        hasMore: apiPagination?.hasMore ?? false,
      });
    } catch (err) {
      setError(err);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return { invoices, loading, error, pagination, refetch: fetchInvoices };
};
