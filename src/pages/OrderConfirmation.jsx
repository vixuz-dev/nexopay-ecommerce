import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ROUTES } from '../utils/routes';
import useCartStore from '../stores/cartStore';
import { useClearCart } from '../hooks/useClearCart';
import PurchaseFlowBreadcrumb from '../components/common/PurchaseFlowBreadcrumb';
import {
  HiOutlineCheckCircle,
  HiOutlineCalendarDays,
  HiOutlineDocumentText,
  HiOutlineEnvelope,
  HiOutlineShoppingBag,
  HiOutlineHome,
  HiOutlinePrinter,
  HiOutlineBanknotes,
} from 'react-icons/hi2';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useClearCart();
  const { 
    items,
    getSubtotal,
    isEmpty,
    deferralMonths,
    getInitialPayment,
    getDeferredAmount,
    getMonthlyPayment,
    getPaymentSchedule,
  } = useCartStore();

  const [orderData, setOrderData] = useState(location.state?.order ?? null);

  useEffect(() => {
    if (orderData) return;

    if (!isEmpty()) {
      const subtotal = getSubtotal();
      const shipping = subtotal > 5000 ? 0 : 200;
      
      setOrderData({
        items: [...items],
        subtotal,
        shipping,
        total: subtotal + shipping,
        initialPayment: getInitialPayment(),
        deferredAmount: getDeferredAmount(),
        monthlyPayment: getMonthlyPayment(),
        deferralMonths,
        paymentSchedule: getPaymentSchedule(),
        orderDate: new Date(),
        orderNumber: `NXP-${Date.now().toString().slice(-8)}`,
      });
      
      clearCart();
    } else {
      navigate(ROUTES.HOME);
    }
  }, []);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const formatMonthYear = (date) => {
    return new Intl.DateTimeFormat('es-MX', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PurchaseFlowBreadcrumb currentStep="confirmation" />
        {/* Mensaje de Éxito */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <HiOutlineCheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            ¡Compra Exitosa!
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Tu pago inicial ha sido procesado correctamente. Recibirás un correo con los detalles de tu pedido.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
            <span className="text-sm text-gray-600">Número de orden:</span>
            <span className="font-mono font-bold text-gray-900">{orderData.orderNumber ?? `NXP-${Date.now().toString().slice(-8)}`}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda - Detalles del Pedido */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resumen de lo Pagado */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <HiOutlineBanknotes className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Pago Realizado</h2>
                    <p className="text-sm text-gray-600">{formatDate(orderData.orderDate)}</p>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-5">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                  <span className="text-gray-700">Pago inicial (30%)</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(orderData.initialPayment)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Total del pedido</span>
                  <span className="font-medium">{formatPrice(orderData.total)}</span>
                </div>
              </div>
            </div>

            {/* Productos Comprados */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <HiOutlineShoppingBag className="w-5 h-5 text-gray-600" />
                  <h2 className="font-semibold text-gray-900">Productos Comprados</h2>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {orderData.items.map((item) => (
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
                      <p className="text-sm text-gray-600">
                        {item.size} · Cantidad: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatPrice(item.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendario de Pagos Restantes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-primary-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <HiOutlineCalendarDays className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Calendario de Pagos</h2>
                    <p className="text-sm text-gray-600">{orderData.deferralMonths} pagos mensuales de {formatPrice(orderData.monthlyPayment)}</p>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-600">
                        <th className="pb-3 font-medium">Pago</th>
                        <th className="pb-3 font-medium">Mes de corte</th>
                        <th className="pb-3 font-medium text-right">Monto</th>
                        <th className="pb-3 font-medium text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orderData.paymentSchedule.map((payment) => (
                        <tr key={payment.number}>
                          <td className="py-3">
                            <span className="inline-flex items-center justify-center w-7 h-7 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                              {payment.number}
                            </span>
                          </td>
                          <td className="py-3 text-sm text-gray-900">
                            {formatMonthYear(payment.date)}
                          </td>
                          <td className="py-3 text-right font-medium text-gray-900">
                            {formatPrice(orderData.monthlyPayment)}
                          </td>
                          <td className="py-3 text-center">
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                              Pendiente
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-200">
                        <td colSpan="2" className="py-3 font-semibold text-gray-900">
                          Total restante
                        </td>
                        <td className="py-3 text-right font-bold text-gray-900">
                          {formatPrice(orderData.deferredAmount)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
                <div className="flex items-start gap-3">
                  <HiOutlineEnvelope className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Recibirás recordatorios de pago
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Te enviaremos un correo 3 días antes de cada fecha de pago con un link para realizarlo fácilmente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Acciones */}
          <div className="lg:col-span-1 space-y-6">
            {/* Resumen Rápido */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Resumen de tu Compra</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Productos</span>
                  <span className="font-medium">{orderData.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(orderData.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-medium">
                    {orderData.shipping === 0 ? 'Gratis' : formatPrice(orderData.shipping)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">{formatPrice(orderData.total)}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pagado hoy</span>
                  <span className="font-semibold text-green-600">{formatPrice(orderData.initialPayment)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Por pagar ({orderData.deferralMonths} meses)</span>
                  <span className="font-medium text-gray-900">{formatPrice(orderData.deferredAmount)}</span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3">
              <Link
                to={ROUTES.MY_ORDERS}
                className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <HiOutlineDocumentText className="w-5 h-5" />
                Ver Mis Pedidos
              </Link>
              
              <button
                onClick={() => window.print()}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <HiOutlinePrinter className="w-5 h-5" />
                Imprimir Comprobante
              </button>
              
              <Link
                to={ROUTES.HOME}
                className="w-full py-3 text-gray-600 hover:text-primary-600 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <HiOutlineHome className="w-5 h-5" />
                Volver al Inicio
              </Link>
            </div>

            {/* Información de Contacto */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">¿Tienes dudas?</h4>
              <p className="text-sm text-gray-600 mb-4">
                Nuestro equipo de soporte está disponible para ayudarte.
              </p>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-gray-700">
                  <span className="font-medium">Email:</span>
                  <a href="mailto:soporte@nexopay.com" className="text-primary-600 hover:underline">
                    soporte@nexopay.com
                  </a>
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                  <span className="font-medium">WhatsApp:</span>
                  <a href="tel:+525512345678" className="text-primary-600 hover:underline">
                    +52 55 1234 5678
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;

