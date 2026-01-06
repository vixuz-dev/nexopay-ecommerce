import { useState, useEffect } from 'react';

export const useAllCreditTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        
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
          {
            id: 'TXN-005',
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            description: 'Pago de línea de crédito',
            amount: -3000,
            type: 'payment',
            status: 'completed'
          },
          {
            id: 'TXN-006',
            date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
            description: 'Compra en NexoPay Store - Producto electrónico',
            amount: 15999,
            type: 'purchase',
            status: 'completed'
          },
          {
            id: 'TXN-007',
            date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
            description: 'Compra en NexoPay Store',
            amount: 7999,
            type: 'purchase',
            status: 'completed'
          },
          {
            id: 'TXN-008',
            date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
            description: 'Pago de línea de crédito',
            amount: -8000,
            type: 'payment',
            status: 'completed'
          },
          {
            id: 'TXN-009',
            date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
            description: 'Compra en NexoPay Store - Accesorio',
            amount: 2999,
            type: 'purchase',
            status: 'completed'
          },
          {
            id: 'TXN-010',
            date: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
            description: 'Compra en NexoPay Store',
            amount: 11999,
            type: 'purchase',
            status: 'completed'
          },
          {
            id: 'TXN-011',
            date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
            description: 'Pago de línea de crédito',
            amount: -4000,
            type: 'payment',
            status: 'completed'
          },
          {
            id: 'TXN-012',
            date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
            description: 'Compra en NexoPay Store - Smartphone',
            amount: 18999,
            type: 'purchase',
            status: 'completed'
          },
        ];

        setTransactions(mockTransactions);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  return { transactions, loading };
};

