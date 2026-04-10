import React from 'react';
import { HiOutlineCalendarDays } from 'react-icons/hi2';
import { formatPriceMXN } from '../../utils/format';

const formatMonthYear = (date) => {
  return new Intl.DateTimeFormat('es-MX', {
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const CheckoutOrderSummary = ({
  items,
  subtotal,
  shipping,
  total,
  deferralMonths,
  initialPayment,
  deferredAmount,
  paymentSchedule,
}) => {
  const firstAmt = paymentSchedule[0]?.amount;
  const lastAmt = paymentSchedule[paymentSchedule.length - 1]?.amount;
  const hasUnequalInstallments =
    paymentSchedule.length > 1 &&
    firstAmt != null &&
    lastAmt != null &&
    firstAmt !== lastAmt;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-900">Resumen del Pedido</h2>
        </div>

        <div className="divide-y divide-gray-100">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}`} className="px-6 py-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    Imagen
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatPriceMXN(item.total)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>{formatPriceMXN(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span>Envío</span>
            <span>{shipping === 0 ? 'Gratis' : formatPriceMXN(shipping)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 pt-3 border-t border-gray-200">
            <span>Total</span>
            <span>{formatPriceMXN(total)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <HiOutlineCalendarDays className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Calendario de Pagos</h2>
              <p className="text-sm text-gray-600">Tu plan a {deferralMonths} meses sin intereses</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 bg-primary-50 border-b-2 border-primary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                ✓
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Pago Inicial
                </p>
                <p className="text-sm text-gray-600">Hoy</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-primary-600">
              {formatPriceMXN(initialPayment)}
            </span>
          </div>
        </div>

        <div className="px-6 py-4">
          <p className="text-sm font-medium text-gray-700 mb-4">
            Pagos mensuales restantes ({formatPriceMXN(deferredAmount)} en {deferralMonths} meses):
          </p>
          {hasUnequalInstallments && (
            <p className="text-xs text-gray-600 mb-3">
              Pago mensual durante {deferralMonths - 1}{' '}
              {deferralMonths - 1 === 1 ? 'mes' : 'meses'} de {formatPriceMXN(firstAmt)} y un último
              pago de {formatPriceMXN(lastAmt)}.
            </p>
          )}
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {paymentSchedule.map((payment) => (
              <div
                key={payment.number}
                className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
                    {payment.number}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Pago {payment.number}</p>
                    <p className="text-sm text-gray-600">{formatMonthYear(payment.date)}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatPriceMXN(payment.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total de pagos mensuales:</span>
            <span className="font-semibold text-gray-900">{formatPriceMXN(deferredAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
