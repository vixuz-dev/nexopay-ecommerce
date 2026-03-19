import React from 'react';
import { formatPrice, formatDate, getDaysUntil } from '../../utils/creditUtils';
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineCalendarDays } from 'react-icons/hi2';

const InvoiceDetail = ({ invoice, onPay }) => {
  const schedule = invoice.paymentSchedule || {};
  const initialPayment = schedule.initialPayment || {};
  const monthlyPayments = schedule.monthlyPayments || [];
  const items = invoice.items || [];

  const allPayments = [
    {
      type: 'initial',
      label: 'Pago inicial',
      amount: initialPayment.amount || 0,
      dueDate: initialPayment.date || new Date(),
      status: initialPayment.status || 'pending',
      paidDate: initialPayment.paidDate
    },
    ...monthlyPayments.map(p => ({
      type: 'monthly',
      label: `Mensualidad ${p.month}`,
      amount: p.amount,
      dueDate: p.dueDate,
      status: p.status,
      paidDate: p.paidDate
    }))
  ];

  return (
    <div className="p-6 bg-gray-50 space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Productos</h4>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-xs text-gray-400">Imagen</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatPrice((item.price ?? 0) * (item.quantity ?? 1))}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <HiOutlineCalendarDays className="w-4 h-4" />
          Calendario de Pagos
        </h4>
        <div className="space-y-2">
          {allPayments.map((payment, index) => {
            const isPaid = payment.status === 'paid';
            const isOverdue = !isPaid && getDaysUntil(payment.dueDate) < 0;
            const isDueSoon = !isPaid && getDaysUntil(payment.dueDate) <= 7 && getDaysUntil(payment.dueDate) >= 0;

            return (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  isPaid
                    ? 'bg-green-50 border-green-200'
                    : isOverdue
                    ? 'bg-red-50 border-red-200'
                    : isDueSoon
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  {isPaid ? (
                    <HiOutlineCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <HiOutlineClock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{payment.label}</p>
                    <p className="text-xs text-gray-600">
                      {isPaid && payment.paidDate
                        ? `Pagado el ${formatDate(payment.paidDate)}`
                        : `Vence el ${formatDate(payment.dueDate)}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${
                    isPaid ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {formatPrice(payment.amount)}
                  </p>
                  {!isPaid && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      isOverdue
                        ? 'bg-red-100 text-red-800'
                        : isDueSoon
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isOverdue
                        ? 'Vencido'
                        : isDueSoon
                        ? `Vence en ${getDaysUntil(payment.dueDate)} días`
                        : `Vence en ${getDaysUntil(payment.dueDate)} días`}
                    </span>
                  )}
                </div>
                {!isPaid && onPay && (
                  <button
                    onClick={() => onPay(invoice, payment)}
                    className="ml-4 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded transition-colors"
                  >
                    Pagar
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-600 mb-1">Total pagado</p>
          <p className="text-lg font-bold text-green-600">{formatPrice(invoice.totalPaid ?? 0)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Total pendiente</p>
          <p className="text-lg font-bold text-gray-900">{formatPrice(invoice.totalPending ?? 0)}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;

