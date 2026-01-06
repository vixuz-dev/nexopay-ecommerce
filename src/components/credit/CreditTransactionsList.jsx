import React from 'react';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import CreditTransactionItem from './CreditTransactionItem';

const CreditTransactionsList = ({ transactions, onViewAll }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600 text-center py-8">No hay movimientos recientes</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Últimos Movimientos</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
          >
            Ver todos
            <HiOutlineArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <CreditTransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};

export default CreditTransactionsList;

