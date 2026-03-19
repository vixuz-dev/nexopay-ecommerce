import React from 'react';
import { HiOutlineArrowDownCircle, HiOutlineArrowUpCircle } from 'react-icons/hi2';
import { formatPrice, formatDate } from '../../utils/creditUtils';

const CreditTransactionItem = ({ transaction, variant = 'default' }) => {
  const isPayment = transaction.type === 'payment';
  const isPositive = transaction.amount < 0;
  const subtle = variant === 'subtle';

  const iconBg = subtle
    ? 'bg-gray-100 text-gray-600'
    : isPayment
      ? 'bg-green-100 text-green-600'
      : 'bg-red-100 text-red-600';

  const amountColor = subtle
    ? isPositive ? 'text-gray-700' : 'text-gray-900'
    : isPositive ? 'text-green-600' : 'text-gray-900';

  const statusClass = subtle
    ? 'bg-gray-100 text-gray-600'
    : 'bg-green-100 text-green-800';

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all">
      <div className="flex items-center gap-4 flex-1">
        <div className={`p-2 rounded-lg ${iconBg}`}>
          {isPayment ? (
            <HiOutlineArrowUpCircle className="w-5 h-5" />
          ) : (
            <HiOutlineArrowDownCircle className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900 text-sm">{transaction.description}</p>
          <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold ${amountColor}`}>
          {isPositive ? '' : '-'}{formatPrice(Math.abs(transaction.amount))}
        </p>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusClass}`}>
          {transaction.status === 'completed' ? 'Completado' : 'Pendiente'}
        </span>
      </div>
    </div>
  );
};

export default CreditTransactionItem;

