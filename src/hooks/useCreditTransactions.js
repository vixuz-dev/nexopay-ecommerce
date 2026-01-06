import { useState, useEffect } from 'react';

export const useCreditTransactions = (limit = 4) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const mockTransactions = [
          {
            id: 'TXN-001',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            description: 'Compra en NexoPay Store',
            amount: 8999,
            type: 'purchase',
            status: 'completed'
          },
          {
            id: 'TXN-002',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            description: 'Pago de línea de crédito',
            amount: -5000,
            type: 'payment',
            status: 'completed'
          },
          {
            id: 'TXN-003',
            date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
            description: 'Compra en NexoPay Store',
            amount: 12999,
            type: 'purchase',
            status: 'completed'
          },
          {
            id: 'TXN-004',
            date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
            description: 'Compra en NexoPay Store',
            amount: 5999,
            type: 'purchase',
            status: 'completed'
          },
        ];

        setTransactions(mockTransactions.slice(0, limit));
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [limit]);

  return { transactions, loading };
};

