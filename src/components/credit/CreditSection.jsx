import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiOutlineCalendarDays, HiOutlineBanknotes, HiOutlineArrowRight } from 'react-icons/hi2';
import { useCredit } from '../../hooks/useCredit';
import { useCreditTransactions } from '../../hooks/useCreditTransactions';
import { usePendingPayments } from '../../hooks/usePendingPayments';
import { isAfterCutoffDate } from '../../utils/creditUtils';
import { ROUTES } from '../../utils/routes';
import CreditCard from './CreditCard';
import CreditInfoCard from './CreditInfoCard';
import CreditTransactionsList from './CreditTransactionsList';
import CreditPaymentSection from './CreditPaymentSection';

const CreditSection = ({ hasApproved = true }) => {
  const navigate = useNavigate();
  const { creditInfo, loading: creditLoading } = useCredit();
  const { transactions, loading: transactionsLoading } = useCreditTransactions(4);
  const { data: pendingPaymentsData } = usePendingPayments();
  const hasPendingPayments = (pendingPaymentsData?.payments ?? []).length > 0;

  if (!hasApproved) {
    return null;
  }

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
    navigate(ROUTES.PAY_CREDIT);
  };

  const handleViewAllTransactions = () => {
    navigate(ROUTES.ACCOUNT_MOVEMENTS);
  };

  return (
    <>
      <div className="mb-8">
        <CreditCard creditInfo={creditInfo} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
        </div>
      </div>

      {creditInfo.daysUntilCutoff === 0 && hasPendingPayments && (
        <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-primary-900 font-medium">
              Tu estado de cuenta del periodo actual ya está disponible. Revisa los montos a pagar y realiza tu pago antes de la fecha límite.
            </p>
            <Link
              to={ROUTES.ACCOUNT_PAYMENTS}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap"
            >
              Ver pagos pendientes
              <HiOutlineArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}

      <div className="mb-8">
        <CreditTransactionsList
          transactions={transactions}
          onViewAll={handleViewAllTransactions}
        />

        {isAfterCutoffDate(creditInfo.cutOffDate) && (
          <div className="mt-6">
            <CreditPaymentSection onPay={handlePay} />
          </div>
        )}
      </div>
    </>
  );
};

export default CreditSection;

