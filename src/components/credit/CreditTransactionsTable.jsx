import React from 'react';
import { formatPrice, formatDate } from '../../utils/creditUtils';
import { HiOutlineArrowDownCircle, HiOutlineArrowUpCircle } from 'react-icons/hi2';

const CreditTransactionsTable = ({ transactions, onTransactionClick }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No se encontraron movimientos</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tipo</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Descripción</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fecha</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Monto</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Estado</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const isPayment = transaction.type === 'payment';
            const isPositive = transaction.amount < 0;

            return (
              <tr
                key={transaction.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onTransactionClick && onTransactionClick(transaction)}
              >
                <td className="py-4 px-4">
                  <div className={`inline-flex items-center gap-2 p-2 rounded-lg ${
                    isPayment 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {isPayment ? (
                      <HiOutlineArrowUpCircle className="w-4 h-4" />
                    ) : (
                      <HiOutlineArrowDownCircle className="w-4 h-4" />
                    )}
                    <span className="text-xs font-medium">
                      {isPayment ? 'Pago' : 'Compra'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-900">{transaction.description}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-600">{formatDate(transaction.date)}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className={`text-sm font-bold ${
                    isPositive ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {isPositive ? '' : '-'}{formatPrice(Math.abs(transaction.amount))}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                    {transaction.status === 'completed' ? 'Completado' : 'Pendiente'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CreditTransactionsTable;

