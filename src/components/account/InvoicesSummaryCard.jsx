import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineDocumentText, HiOutlineArrowRight, HiOutlineClock, HiOutlineCalendarDays } from 'react-icons/hi2';
import { formatPrice } from '../../utils/creditUtils';
import { ROUTES } from '../../utils/routes';

const InvoicesSummaryCard = ({ invoices }) => {
  const navigate = useNavigate();

  if (!invoices || invoices.length === 0) {
    return null;
  }

  const activeInvoices = invoices.filter(inv => inv.status !== 'paid').length;
  const allPayments = invoices.flatMap(inv =>
    (inv.paymentSchedule?.monthlyPayments || []).filter(p => p.status === 'pending')
  );
  const pendingPayments = allPayments.length;
  const totalPending = invoices.reduce((sum, inv) => sum + (inv.totalPending ?? 0), 0);

  return (
    <div className="bg-gradient-to-br from-white to-primary-50/30 rounded-2xl shadow-lg border border-primary-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-primary-100 rounded-xl">
            <HiOutlineDocumentText className="w-7 h-7 text-primary-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Mis Facturas</h3>
            <p className="text-sm text-gray-600">Facturas y calendarios de pago</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineDocumentText className="w-4 h-4 text-gray-400" />
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total facturas</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{invoices.length}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineClock className="w-4 h-4 text-gray-400" />
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Facturas activas</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{activeInvoices}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-orange-100">
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineCalendarDays className="w-4 h-4 text-orange-500" />
              <p className="text-xs font-medium text-orange-600 uppercase tracking-wide">Pagos pendientes</p>
            </div>
            <p className="text-3xl font-bold text-orange-600">{pendingPayments}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-red-100">
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineDocumentText className="w-4 h-4 text-red-500" />
              <p className="text-xs font-medium text-red-600 uppercase tracking-wide">Total pendiente</p>
            </div>
            <p className="text-2xl font-bold text-red-600">{formatPrice(totalPending)}</p>
          </div>
        </div>

        <button
          onClick={() => navigate(ROUTES.MY_INVOICES)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Ver todas mis facturas
          <HiOutlineArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default InvoicesSummaryCard;

