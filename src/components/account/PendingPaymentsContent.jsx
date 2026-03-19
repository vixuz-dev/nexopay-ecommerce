import React, { useState } from 'react';
import { HiOutlineCreditCard, HiOutlineExclamationTriangle, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi2';
import { formatPrice } from '../../utils/creditUtils';
import ProductPlaceholder from '../common/ProductPlaceholder';
import PaymentModal from './PaymentModal';

const parseAmount = (val) => (typeof val === 'string' ? parseFloat(val) || 0 : Number(val) || 0);

const PaymentItemCard = ({ item, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const products = item.products ?? [];
  const totalAmount = parseAmount(item.total) ?? 0;
  const lateFee = parseAmount(item.lateFeeAmount) ?? 0;
  const status = item.status ?? 'PENDING';
  const month = item.month ?? '';
  const hasProducts = products.length > 0;

  return (
    <div className={`rounded-xl border overflow-hidden transition-colors ${
      status === 'OVERDUE' ? 'border-amber-300 bg-amber-50/50' : 'border-gray-200 bg-white'
    }`}>
      <button
        type="button"
        onClick={() => hasProducts && setIsExpanded((prev) => !prev)}
        className={`w-full p-4 text-left flex items-center justify-between gap-4 ${hasProducts ? 'cursor-pointer hover:bg-gray-50/50' : 'cursor-default'}`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900">{month}</h3>
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
              status === 'OVERDUE' ? 'bg-amber-200 text-amber-900' : 'bg-blue-100 text-blue-800'
            }`}>
              {status === 'OVERDUE' ? 'Vencido' : 'Pendiente'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Corte: {item.cutDate} · Vence: {item.graceEndDate}
            {lateFee > 0 && (
              <span className="text-amber-600 ml-1">· Mora: {formatPrice(lateFee)}</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <p className="text-lg font-bold text-gray-900">{formatPrice(totalAmount)}</p>
          {hasProducts && (
            <span className="text-gray-400">
              {isExpanded ? <HiOutlineChevronUp className="w-5 h-5" /> : <HiOutlineChevronDown className="w-5 h-5" />}
            </span>
          )}
        </div>
      </button>
      {hasProducts && isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-100">
          <div className="space-y-2 pt-3">
            {products.map((product, idx) => (
              <div key={product.orderDetailId ?? idx} className="flex gap-3 py-2">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {product.variantImageUrl ? (
                    <img
                      src={product.variantImageUrl}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ProductPlaceholder name={product.productName} className="w-full h-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{product.productName}</p>
                  <p className="text-xs text-gray-500">
                    {product.productQuantity} {product.productQuantity === 1 ? 'unidad' : 'unidades'}
                    {product.periodLabel && ` · Periodo ${product.periodLabel}`}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900 flex-shrink-0">{formatPrice(parseAmount(product.total))}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PendingPaymentsContent = ({ data, onPaymentSuccess }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const payments = data?.payments ?? [];
  const subtotal = parseAmount(data?.subtotal);
  const lateFee = parseAmount(data?.lateFee);
  const total = parseAmount(data?.total);

  const hasPayments = payments.length > 0;
  const pendingPayments = payments.filter((p) => p.status === 'PENDING');
  const overduePayments = payments.filter((p) => p.status === 'OVERDUE');

  const handlePay = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    onPaymentSuccess?.();
  };

  if (!hasPayments) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <HiOutlineCreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay pagos pendientes</h3>
        <p className="text-gray-500 text-sm">Tu cuenta está al corriente</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pendingPayments.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Pagos pendientes</h2>
          <div className="space-y-4">
            {pendingPayments.map((item, index) => (
              <PaymentItemCard key={`pending-${index}`} item={item} />
            ))}
          </div>
        </section>
      )}

      {overduePayments.length > 0 && (
        <section>
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex gap-3">
              <HiOutlineExclamationTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Tienes pagos vencidos</p>
                <p className="text-sm text-amber-800 mt-1">
                  Uno o más pagos han superado la fecha límite. Realiza el pago lo antes posible para evitar cargos adicionales por mora y mantener tu línea de crédito en buen estado.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {overduePayments.map((item, index) => (
              <PaymentItemCard key={`overdue-${index}`} item={item} defaultExpanded={true} />
            ))}
          </div>
        </section>
      )}

      <div className="bg-primary-50 rounded-xl border border-primary-200 p-6">
        <div className="space-y-2 mb-4">
          {subtotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
            </div>
          )}
          {lateFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-amber-700">Cargos por mora</span>
              <span className="font-medium text-amber-700">{formatPrice(lateFee)}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-primary-200">
          <div>
            <p className="text-sm text-primary-800 font-medium">Total a pagar</p>
            <p className="text-2xl font-bold text-primary-900">{formatPrice(total)}</p>
          </div>
          <button
            type="button"
            onClick={handlePay}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            <HiOutlineCreditCard className="w-5 h-5" />
            Realizar pago
          </button>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={total}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default PendingPaymentsContent;
