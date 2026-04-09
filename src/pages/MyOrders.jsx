import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ROUTES, getOrderDetailUrl } from '../utils/routes';
import {
  HiOutlineArrowLeft,
  HiOutlineMagnifyingGlass,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineDocumentText,
} from 'react-icons/hi2';
import { useOrders } from '../hooks/useOrders';
import { mapOrderFromApi } from '../utils/orderMapper';
import { orderService } from '../api/services/orderService';
import AccountMovementsPagination from '../components/credit/AccountMovementsPagination';
import Dropdown from '../components/common/Dropdown';
import useToastStore from '../stores/toastStore';

const LIMIT = 10;

const getStatusInfo = (status) => {
  const statusMap = {
    completed: {
      label: 'Completado',
      icon: HiOutlineCheckCircle,
      color: 'bg-green-100 text-green-800',
      iconColor: 'text-green-600',
    },
    pending: {
      label: 'Pendiente',
      icon: HiOutlineClock,
      color: 'bg-yellow-100 text-yellow-800',
      iconColor: 'text-yellow-600',
    },
    cancelled: {
      label: 'Cancelado',
      icon: HiOutlineXCircle,
      color: 'bg-red-100 text-red-800',
      iconColor: 'text-red-600',
    },
    shipping: {
      label: 'En envío',
      icon: HiOutlineTruck,
      color: 'bg-blue-100 text-blue-800',
      iconColor: 'text-blue-600',
    },
  };
  return statusMap[status] || statusMap.pending;
};

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'completed', label: 'Completados' },
  { value: 'cancelled', label: 'Cancelados' },
];

const MyOrders = () => {
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.showToast);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrders, setExpandedOrders] = useState({});
  const [loadingOrderId, setLoadingOrderId] = useState(null);

  const {
    orders,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage,
    statusFilter,
    goToPage,
    changeStatus,
  } = useOrders({ limit: LIMIT });

  useEffect(() => {
    if (statusFilter === 'shipping') {
      changeStatus('all');
    }
  }, [statusFilter, changeStatus]);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const mappedOrders = orders.map(mapOrderFromApi);

  const filteredOrders = searchTerm.trim()
    ? mappedOrders.filter(
        (order) =>
          (order.folio || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.id || '').toString().includes(searchTerm)
      )
    : mappedOrders;

  const handleViewInvoice = async (order) => {
    const orderId = order.order_id ?? order.id;
    if (!orderId) return;
    setLoadingOrderId(orderId);
    try {
      const orderData = await orderService.getOrderById(orderId);
      navigate(getOrderDetailUrl(orderId), {
        state: { order: orderData },
      });
    } catch (err) {
      showToast(err?.message || 'Error al cargar el pedido', 'error');
    } finally {
      setLoadingOrderId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(ROUTES.MY_ACCOUNT)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Volver a Mi Cuenta</span>
          </button>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Mis Pedidos
          </h1>
          <p className="text-gray-600">
            Historial completo de tus pedidos
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <HiOutlineMagnifyingGlass className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por folio o número de pedido..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="md:w-64 md:flex-shrink-0">
              <Dropdown
                id="orders-status-filter"
                name="status"
                value={statusFilter}
                onChange={(e) => changeStatus(e.target.value)}
                options={STATUS_OPTIONS}
                placeholder="Todos los estados"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex justify-center">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-red-600 mb-2">Error al cargar los pedidos</p>
              <p className="text-sm text-gray-500">{error.message}</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">
                No se encontraron pedidos
              </p>
              <p className="text-gray-500 text-sm">
                {searchTerm
                  ? 'Intenta ajustar el filtro de búsqueda'
                  : 'Aún no has realizado ningún pedido'}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              const isExpanded = expandedOrders[order.id];

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            Pedido {order.folio || order.id}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusInfo.color}`}
                          >
                            <StatusIcon className={`w-4 h-4 ${statusInfo.iconColor}`} />
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span>Fecha: {formatDate(order.date)}</span>
                          <span className="font-semibold text-gray-900">
                            Total: {formatPrice(order.total)}
                          </span>
                          <span>{order.product_quantity} producto(s)</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleOrderExpansion(order.id)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          {isExpanded ? (
                            <>
                              <span>Ocultar detalles</span>
                              <HiOutlineChevronUp className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              <span>Ver detalles</span>
                              <HiOutlineChevronDown className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-6 bg-gray-50 border-t border-gray-200">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleViewInvoice(order)}
                          disabled={loadingOrderId === (order.order_id ?? order.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm disabled:opacity-70 disabled:cursor-wait"
                        >
                          {loadingOrderId === (order.order_id ?? order.id) ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Cargando...
                            </>
                          ) : (
                            <>
                              <HiOutlineDocumentText className="w-4 h-4" />
                              Ver factura y calendario de pagos
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {!loading && !error && filteredOrders.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-600">
                Mostrando {filteredOrders.length} de {totalItems} pedidos
                {searchTerm && ' (filtrados por búsqueda)'}
              </p>
              <AccountMovementsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyOrders;
