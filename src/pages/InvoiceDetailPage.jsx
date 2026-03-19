import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { HiOutlineArrowLeft, HiOutlineDocumentText } from 'react-icons/hi2';
import { useOrderDetail } from '../hooks/useOrderDetail';
import OrderDetailView from '../components/orders/OrderDetailView';
import { formatPrice, formatDate } from '../utils/creditUtils';
import { ROUTES } from '../utils/routes';
const InvoiceDetailPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { order, loading, error } = useOrderDetail(orderId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-200 border-t-primary-500" />
            <p className="text-sm text-gray-500">Cargando detalle del pedido...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate(ROUTES.MY_ORDERS)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Volver a Mis Pedidos</span>
          </button>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <HiOutlineDocumentText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Pedido no encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              {error?.message ||
                'No se encontró información para este pedido.'}
            </p>
            <button
              onClick={() => navigate(ROUTES.MY_ORDERS)}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
            >
              Volver a Mis Pedidos
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const folio = order.folio ?? `P${order.order_id ?? ''}`;
  const orderStatus = order.order_status ?? 'Pendiente';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(ROUTES.MY_ORDERS)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Volver a Mis Pedidos</span>
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <HiOutlineDocumentText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {folio}
              </h1>
              <p className="text-gray-600">
                Pedido del {formatDate(order.created_at)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Fecha</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(order.created_at)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Total</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatPrice(order.total ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Estado</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    orderStatus === 'Completado'
                      ? 'bg-green-100 text-green-800'
                      : orderStatus === 'En envío' || orderStatus === 'Enviado'
                      ? 'bg-blue-100 text-blue-800'
                      : orderStatus === 'Cancelado'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {orderStatus}
                </span>
              </div>
            </div>
          </div>

          <OrderDetailView order={order} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InvoiceDetailPage;
