import { useState, useEffect } from 'react';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockInvoices = [
          {
            id: 'INV-001',
            invoiceNumber: 'FACT-2024-001',
            orderId: 'ORD-001',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            total: 45000,
            status: 'partial',
            items: [
              { id: 1, name: 'iPhone 17 Pro', price: 35000, quantity: 1, image: null },
              { id: 2, name: 'Funda iPhone 17 Pro', price: 5000, quantity: 1, image: null },
              { id: 3, name: 'Tenis Nike Air Max', price: 5000, quantity: 1, image: null },
            ],
            paymentSchedule: {
              initialPayment: {
                amount: 13500,
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                status: 'paid',
                paidDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
              },
              monthlyPayments: [
                {
                  month: 1,
                  amount: 2625,
                  dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 2,
                  amount: 2625,
                  dueDate: new Date(Date.now() + 58 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 3,
                  amount: 2625,
                  dueDate: new Date(Date.now() + 88 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 4,
                  amount: 2625,
                  dueDate: new Date(Date.now() + 118 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 5,
                  amount: 2625,
                  dueDate: new Date(Date.now() + 148 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 6,
                  amount: 2625,
                  dueDate: new Date(Date.now() + 178 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 7,
                  amount: 2625,
                  dueDate: new Date(Date.now() + 208 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 8,
                  amount: 2625,
                  dueDate: new Date(Date.now() + 238 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 9,
                  amount: 2625,
                  dueDate: new Date(Date.now() + 268 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 10,
                  amount: 2625,
                  dueDate: new Date(Date.now() + 298 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 11,
                  amount: 2625,
                  dueDate: new Date(Date.now() + 328 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 12,
                  amount: 2625,
                  dueDate: new Date(Date.now() + 358 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
              ]
            },
            totalPaid: 13500,
            totalPending: 31500
          },
          {
            id: 'INV-002',
            invoiceNumber: 'FACT-2024-002',
            orderId: 'ORD-002',
            date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
            total: 12999,
            status: 'paid',
            items: [
              { id: 2, name: 'Laptop HP Pavilion 15', price: 12999, quantity: 1, image: null },
            ],
            paymentSchedule: {
              initialPayment: {
                amount: 3900,
                date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
                status: 'paid',
                paidDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
              },
              monthlyPayments: [
                {
                  month: 1,
                  amount: 758,
                  dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                  status: 'paid',
                  paidDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
                },
                {
                  month: 2,
                  amount: 758,
                  dueDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
                  status: 'paid',
                  paidDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
                },
                {
                  month: 3,
                  amount: 758,
                  dueDate: new Date(Date.now() + 52 * 24 * 60 * 60 * 1000),
                  status: 'paid',
                  paidDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000)
                },
                {
                  month: 4,
                  amount: 758,
                  dueDate: new Date(Date.now() + 82 * 24 * 60 * 60 * 1000),
                  status: 'paid',
                  paidDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000)
                },
                {
                  month: 5,
                  amount: 758,
                  dueDate: new Date(Date.now() + 112 * 24 * 60 * 60 * 1000),
                  status: 'paid',
                  paidDate: new Date(Date.now() + 110 * 24 * 60 * 60 * 1000)
                },
                {
                  month: 6,
                  amount: 758,
                  dueDate: new Date(Date.now() + 142 * 24 * 60 * 60 * 1000),
                  status: 'paid',
                  paidDate: new Date(Date.now() + 140 * 24 * 60 * 60 * 1000)
                },
                {
                  month: 7,
                  amount: 758,
                  dueDate: new Date(Date.now() + 172 * 24 * 60 * 60 * 1000),
                  status: 'paid',
                  paidDate: new Date(Date.now() + 170 * 24 * 60 * 60 * 1000)
                },
                {
                  month: 8,
                  amount: 758,
                  dueDate: new Date(Date.now() + 202 * 24 * 60 * 60 * 1000),
                  status: 'paid',
                  paidDate: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000)
                },
                {
                  month: 9,
                  amount: 758,
                  dueDate: new Date(Date.now() + 232 * 24 * 60 * 60 * 1000),
                  status: 'paid',
                  paidDate: new Date(Date.now() + 230 * 24 * 60 * 60 * 1000)
                },
                {
                  month: 10,
                  amount: 758,
                  dueDate: new Date(Date.now() + 262 * 24 * 60 * 60 * 1000),
                  status: 'paid',
                  paidDate: new Date(Date.now() + 260 * 24 * 60 * 60 * 1000)
                },
                {
                  month: 11,
                  amount: 758,
                  dueDate: new Date(Date.now() + 292 * 24 * 60 * 60 * 1000),
                  status: 'paid',
                  paidDate: new Date(Date.now() + 290 * 24 * 60 * 60 * 1000)
                },
                {
                  month: 12,
                  amount: 758,
                  dueDate: new Date(Date.now() + 322 * 24 * 60 * 60 * 1000),
                  status: 'paid',
                  paidDate: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000)
                },
              ]
            },
            totalPaid: 12999,
            totalPending: 0
          },
          {
            id: 'INV-003',
            invoiceNumber: 'FACT-2024-003',
            orderId: 'ORD-003',
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            total: 5999,
            status: 'partial',
            items: [
              { id: 3, name: 'Auriculares Sony WH-1000XM4', price: 5999, quantity: 1, image: null },
            ],
            paymentSchedule: {
              initialPayment: {
                amount: 1800,
                date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                status: 'paid',
                paidDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
              },
              monthlyPayments: [
                {
                  month: 1,
                  amount: 350,
                  dueDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
                  status: 'paid',
                  paidDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
                },
                {
                  month: 2,
                  amount: 350,
                  dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 3,
                  amount: 350,
                  dueDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 4,
                  amount: 350,
                  dueDate: new Date(Date.now() + 72 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 5,
                  amount: 350,
                  dueDate: new Date(Date.now() + 102 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 6,
                  amount: 350,
                  dueDate: new Date(Date.now() + 132 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 7,
                  amount: 350,
                  dueDate: new Date(Date.now() + 162 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 8,
                  amount: 350,
                  dueDate: new Date(Date.now() + 192 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 9,
                  amount: 350,
                  dueDate: new Date(Date.now() + 222 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 10,
                  amount: 350,
                  dueDate: new Date(Date.now() + 252 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 11,
                  amount: 350,
                  dueDate: new Date(Date.now() + 282 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
                {
                  month: 12,
                  amount: 350,
                  dueDate: new Date(Date.now() + 312 * 24 * 60 * 60 * 1000),
                  status: 'pending',
                  paidDate: null
                },
              ]
            },
            totalPaid: 2150,
            totalPending: 3849
          },
        ];

        setInvoices(mockInvoices);
      } catch (error) {
        console.error('Error loading invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  return { invoices, loading };
};

