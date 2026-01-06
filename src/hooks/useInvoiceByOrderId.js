import { useState, useEffect } from 'react';
import { useInvoices } from './useInvoices';

export const useInvoiceByOrderId = (orderId) => {
  const { invoices, loading: invoicesLoading } = useInvoices();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    setLoading(invoicesLoading);
    
    if (!invoicesLoading && invoices) {
      const foundInvoice = invoices.find(inv => inv.orderId === orderId);
      setInvoice(foundInvoice || null);
      setLoading(false);
    }
  }, [orderId, invoices, invoicesLoading]);

  return { invoice, loading };
};

