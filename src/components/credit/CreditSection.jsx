import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCalendarDays, HiOutlineBanknotes, HiOutlineCheckCircle } from 'react-icons/hi2';
import { useCredit } from '../../hooks/useCredit';
import { useCreditTransactions } from '../../hooks/useCreditTransactions';
import { formatPrice } from '../../utils/creditUtils';
import CreditCard from './CreditCard';
import CreditInfoCard from './CreditInfoCard';
import CreditTransactionsList from './CreditTransactionsList';
import CreditPaymentSection from './CreditPaymentSection';

const CreditSection = () => {
  const navigate = useNavigate();
  const { creditInfo, loading: creditLoading } = useCredit();
  const { transactions, loading: transactionsLoading } = useCreditTransactions(4);

  if (creditLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!creditInfo) {
    return null;
  }

  const handlePay = () => {
    navigate('/pagar-credito');
  };

  const handleViewAllTransactions = () => {
    navigate('/movimientos-credito');
  };

  return (
    <>
      <div className="mb-8">
        <CreditCard creditInfo={creditInfo} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <CreditInfoCard
            icon={HiOutlineCalendarDays}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            label="Fecha de Corte"
            value={creditInfo.cutOffDate}
          />
          <CreditInfoCard
            icon={HiOutlineBanknotes}
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
            label="Límite de Pago"
            value={creditInfo.paymentDueDate}
          />
          <CreditInfoCard
            icon={HiOutlineCheckCircle}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            label="Pago Mínimo"
            value={formatPrice(creditInfo.minimumPayment)}
            subtitle="Aproximado hasta hoy"
          />
        </div>
      </div>

      <div className="mb-8">
        <CreditTransactionsList
          transactions={transactions}
          onViewAll={handleViewAllTransactions}
        />

        <div className="mt-6">
          <CreditPaymentSection onPay={handlePay} />
        </div>
      </div>
    </>
  );
};

export default CreditSection;

