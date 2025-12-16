import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
// import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/routes';
import {
  HiOutlineArrowLeft,
  HiOutlineMagnifyingGlass,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineEye,
  HiOutlineChevronDown,
  HiOutlineChevronUp
} from 'react-icons/hi2';

const MyOrders = () => {
  // TODO: Descomentar cuando se conecte la API
  // const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrders, setExpandedOrders] = useState({});

  // Datos mock de pedidos
  const allOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      total: 8999,
      status: 'completed',
      items: [
        {
          id: 1,
          name: 'Smartphone Samsung Galaxy A54',
          price: 8999,
          quantity: 1,
          image: null,
        },
      ],
      paymentMethod: 'Crédito a plazos',
      shippingAddress: 'Calle Ejemplo 123, Ciudad de México',
      trackingNumber: 'TRACK-123456789',
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      total: 12999,
      status: 'pending',
      items: [
        {
          id: 2,
          name: 'Laptop HP Pavilion 15',
          price: 12999,
          quantity: 1,
          image: null,
        },
      ],
      paymentMethod: 'Crédito a plazos',
      shippingAddress: 'Calle Ejemplo 123, Ciudad de México',
      trackingNumber: null,
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      total: 5999,
      status: 'completed',
      items: [
        {
          id: 3,
          name: 'Auriculares Sony WH-1000XM4',
          price: 5999,
          quantity: 1,
          image: null,
        },
      ],
      paymentMethod: 'Crédito a plazos',
      shippingAddress: 'Calle Ejemplo 123, Ciudad de México',
      trackingNumber: 'TRACK-987654321',
    },
    {
      id: 'ORD-004',
      date: '2023-12-28',
      total: 14999,
      status: 'completed',
      items: [
        {
          id: 5,
          name: 'Smart TV LG 55" 4K',
          price: 14999,
          quantity: 1,
          image: null,
        },
      ],
      paymentMethod: 'Crédito a plazos',
      shippingAddress: 'Calle Ejemplo 123, Ciudad de México',
      trackingNumber: 'TRACK-456789123',
    },
    {
      id: 'ORD-005',
      date: '2023-12-20',
      total: 7999,
      status: 'cancelled',
      items: [
        {
          id: 7,
          name: 'Smartwatch Apple Watch Series 9',
          price: 7999,
          quantity: 1,
          image: null,
        },
      ],
      paymentMethod: 'Crédito a plazos',
      shippingAddress: 'Calle Ejemplo 123, Ciudad de México',
      trackingNumber: null,
    },
  ];

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

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Filtrar pedidos
  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'shipping', label: 'En envío' },
    { value: 'completed', label: 'Completados' },
    { value: 'cancelled', label: 'Cancelados' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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
            Historial completo de tus compras
          </p>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <HiOutlineMagnifyingGlass className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por número de pedido o producto..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Filtro de estado */}
            <div className="md:w-64">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">
                No se encontraron pedidos
              </p>
              <p className="text-gray-500 text-sm">
                {searchTerm || statusFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
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
                  {/* Header del Pedido */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            Pedido {order.id}
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
                          <span>{order.items.length} producto(s)</span>
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

                  {/* Detalles Expandidos */}
                  {isExpanded && (
                    <div className="p-6 bg-gray-50 border-t border-gray-200">
                      {/* Productos */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">
                          Productos
                        </h4>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200"
                            >
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-xs text-gray-400">
                                  Imagen
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Cantidad: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  {formatPrice(item.price)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Subtotal: {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Información Adicional */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">
                            Información de Pago
                          </h4>
                          <p className="text-sm text-gray-600">
                            {order.paymentMethod}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">
                            Dirección de Envío
                          </h4>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress}
                          </p>
                        </div>

                        {order.trackingNumber && (
                          <div className="md:col-span-2">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">
                              Número de Seguimiento
                            </h4>
                            <div className="flex items-center gap-2">
                              <HiOutlineTruck className="w-5 h-5 text-primary-600" />
                              <p className="text-sm font-mono text-primary-600">
                                {order.trackingNumber}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Acciones */}
                      {order.status === 'completed' && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm">
                            Comprar de nuevo
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Resumen */}
        {filteredOrders.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Mostrando {filteredOrders.length} de {allOrders.length} pedidos
              </p>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default MyOrders;

