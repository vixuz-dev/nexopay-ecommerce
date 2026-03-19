import React, { useState } from 'react';
import { formatPrice, formatDate, getDaysUntil } from '../../utils/creditUtils';
import { HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineCheckCircle, HiOutlineClock, HiOutlineExclamationTriangle } from 'react-icons/hi2';
import InvoiceDetail from './InvoiceDetail';

const InvoiceCard = ({ invoice, onPay }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusInfo = () => {
    switch (invoice.status) {
      case 'paid':
        return {
          label: 'Pagada completamente',
          icon: HiOutlineCheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          badgeColor: 'bg-green-100 text-green-800'
        };
      case 'partial':
        return {
          label: 'Pago parcial',
          icon: HiOutlineClock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          badgeColor: 'bg-yellow-100 text-yellow-800'
        };
      case 'pending':
        return {
          label: 'Pendiente',
          icon: HiOutlineExclamationTriangle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          badgeColor: 'bg-red-100 text-red-800'
        };
      case 'canceled':
        return {
          label: 'Cancelada',
          icon: HiOutlineExclamationTriangle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          badgeColor: 'bg-gray-100 text-gray-800'
        };
      default:
        return {
          label: 'Desconocido',
          icon: HiOutlineClock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          badgeColor: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const schedule = invoice.paymentSchedule || {};
  const monthlyPayments = schedule.monthlyPayments || [];
  const initialPayment = schedule.initialPayment || {};
  const items = invoice.items || [];

  const pendingPayments = monthlyPayments.filter(p => p.status === 'pending').length;
  const completedPayments = monthlyPayments.filter(p => p.status === 'paid').length;
  const totalPayments = monthlyPayments.length;
  const progressPercentage = totalPayments > 0
    ? ((completedPayments + (initialPayment.status === 'paid' ? 1 : 0)) / (totalPayments + 1)) * 100
    : invoice.totalPending === 0 ? 100 : 0;

  const nextPayment = monthlyPayments.find(p => p.status === 'pending');
  const itemsSummary = items.length === 0
    ? 'Producto'
    : items.length === 1
      ? items[0].name
      : `${items[0].name} + ${items.length - 1} más`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 ${statusInfo.bgColor} rounded-lg`}>
                <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
                <p className="text-xs text-gray-500">{formatDate(invoice.date || new Date())}</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-2 line-clamp-1">{itemsSummary}</p>

            <div className="flex items-center gap-4 text-sm">
              <span className="font-bold text-gray-900">{formatPrice(invoice.total)}</span>
              {invoice.status !== 'paid' && (
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.badgeColor}`}>
                  {pendingPayments} {pendingPayments === 1 ? 'pago pendiente' : 'pagos pendientes'}
                </span>
              )}
            </div>

            {invoice.status !== 'paid' && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Progreso de pago</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}

            {nextPayment && (
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="text-gray-600">Próximo pago:</span>
                <span className="font-semibold text-gray-900">{formatPrice(nextPayment.amount)}</span>
                <span className="text-gray-500">
                  {getDaysUntil(nextPayment.dueDate) > 0 
                    ? `Vence en ${getDaysUntil(nextPayment.dueDate)} días`
                    : 'Vence hoy'}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-start gap-2">
            {invoice.status !== 'paid' && onPay && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPay(invoice);
                }}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Pagar ahora
              </button>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isExpanded ? (
                <HiOutlineChevronUp className="w-5 h-5" />
              ) : (
                <HiOutlineChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200">
          <InvoiceDetail invoice={invoice} onPay={onPay} />
        </div>
      )}
    </div>
  );
};

export default InvoiceCard;

