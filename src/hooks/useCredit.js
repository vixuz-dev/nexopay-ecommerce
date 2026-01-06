import { useState, useEffect } from 'react';

export const useCredit = () => {
  const [creditInfo, setCreditInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCreditInfo = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const mockCreditInfo = {
          creditLimit: 50000,
          creditUsed: 15000,
          creditAvailable: 35000,
          currentBalance: 15000,
          minimumPayment: 3000,
          paymentDueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          cutOffDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          nextPaymentDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        };

        setCreditInfo(mockCreditInfo);
      } catch (error) {
        console.error('Error loading credit info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCreditInfo();
  }, []);

  return { creditInfo, loading };
};

