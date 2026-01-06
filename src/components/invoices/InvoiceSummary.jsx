import React, { useMemo } from 'react';
import { formatPrice } from '../../utils/creditUtils';
import { HiOutlineDocumentText, HiOutlineClock, HiOutlineCalendarDays } from 'react-icons/hi2';

const InvoiceSummary = ({ invoices }) => {
  const summary = useMemo(() => {
    if (!invoices || invoices.length === 0) {
      return {
        totalInvoices: 0,
        activeInvoices: 0,
        pendingPayments: 0,
        nextPayment: null,
        totalPending: 0
      };
    }

    const activeInvoices = invoices.filter(inv => inv.status !== 'paid');
    const allPayments = invoices.flatMap(inv => 
      inv.paymentSchedule.monthlyPayments.filter(p => p.status === 'pending')
    );
    
    const nextPayment = allPayments
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

    const totalPending = invoices.reduce((sum, inv) => sum + inv.totalPending, 0);

    return {
      totalInvoices: invoices.length,
      activeInvoices: activeInvoices.length,
      pendingPayments: allPayments.length,
      nextPayment,
      totalPending
    };
  }, [invoices]);

  if (summary.totalInvoices === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <HiOutlineDocumentText className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900">{summary.totalInvoices}</p>
        <p className="text-sm text-gray-600">Total de facturas</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <HiOutlineClock className="w-5 h-5 text-yellow-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900">{summary.activeInvoices}</p>
        <p className="text-sm text-gray-600">Facturas activas</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <HiOutlineCalendarDays className="w-5 h-5 text-orange-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900">{summary.pendingPayments}</p>
        <p className="text-sm text-gray-600">Pagos pendientes</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <HiOutlineDocumentText className="w-5 h-5 text-red-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900">{formatPrice(summary.totalPending)}</p>
        <p className="text-sm text-gray-600">Total pendiente</p>
      </div>
    </div>
  );
};

export default InvoiceSummary;

