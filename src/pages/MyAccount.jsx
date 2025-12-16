import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
// import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/routes';
import {
  HiOutlineUser,
  HiOutlineCreditCard,
  HiOutlineShoppingBag,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineClock,
  HiOutlineCheckCircle
} from 'react-icons/hi2';

const MyAccount = () => {
  // TODO: Descomentar cuando se conecte la API
  // const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Datos mock del usuario (temporal hasta conectar API)
  const user = {
    id: '1',
    email: 'usuario@ejemplo.com',
    name: 'Usuario Ejemplo',
  };
  const isAuthenticated = true;
  const loading = false;

  // TODO: Descomentar cuando se conecte la API
  // Redirigir si no está autenticado
  // React.useEffect(() => {
  //   if (!loading && !isAuthenticated) {
  //     navigate(ROUTES.LOGIN);
  //   }
  // }, [isAuthenticated, loading, navigate]);

  // TODO: Descomentar cuando se conecte la API
  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       <Header />
  //       <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
  //         <div className="flex justify-center items-center py-20">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
  //         </div>
  //       </main>
  //       <Footer />
  //     </div>
  //   );
  // }

  // TODO: Descomentar cuando se conecte la API
  // if (!isAuthenticated) {
  //   return null;
  // }

  // Datos mock para el dashboard
  const dashboardStats = {
    totalOrders: 12,
    pendingOrders: 2,
    completedOrders: 10,
    totalSpent: 125000,
    creditLimit: 50000,
    creditUsed: 15000,
    creditAvailable: 35000,
  };

  const recentOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      total: 8999,
      status: 'completed',
      items: 1,
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      total: 12999,
      status: 'pending',
      items: 1,
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      total: 5999,
      status: 'completed',
      items: 1,
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

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    const labels = {
      completed: 'Completado',
      pending: 'Pendiente',
      cancelled: 'Cancelado',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const quickActions = [
    {
      title: 'Mis Pedidos',
      description: 'Ver historial de compras',
      icon: HiOutlineShoppingBag,
      link: ROUTES.MY_ORDERS,
      color: 'bg-blue-500',
    },
    {
      title: 'Mi Crédito',
      description: 'Gestionar crédito disponible',
      icon: HiOutlineCreditCard,
      link: ROUTES.CREDIT_REQUEST,
      color: 'bg-green-500',
    },
    {
      title: 'Perfil',
      description: 'Editar información personal',
      icon: HiOutlineUser,
      link: ROUTES.MY_PROFILE,
      color: 'bg-purple-500',
    },
    {
      title: 'Configuración',
      description: 'Ajustes de cuenta',
      icon: HiOutlineCog6Tooth,
      link: '#',
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Mi Cuenta
          </h1>
          <p className="text-gray-600">
            Bienvenido de vuelta, {user?.email || 'Usuario'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Pedidos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <HiOutlineShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{dashboardStats.totalOrders}</span>
            </div>
            <p className="text-sm text-gray-600">Total de pedidos</p>
          </div>

          {/* Pedidos Pendientes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <HiOutlineClock className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{dashboardStats.pendingOrders}</span>
            </div>
            <p className="text-sm text-gray-600">Pedidos pendientes</p>
          </div>

          {/* Total Gastado */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <HiOutlineChartBar className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{formatPrice(dashboardStats.totalSpent)}</span>
            </div>
            <p className="text-sm text-gray-600">Total gastado</p>
          </div>

          {/* Crédito Disponible */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <HiOutlineCreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{formatPrice(dashboardStats.creditAvailable)}</span>
            </div>
            <p className="text-sm text-gray-600">Crédito disponible</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Información de Crédito */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Mi Crédito</h2>
            </div>

            <div className="space-y-4">
              {/* Barra de progreso de crédito */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Crédito utilizado</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(dashboardStats.creditUsed)} / {formatPrice(dashboardStats.creditLimit)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(dashboardStats.creditUsed / dashboardStats.creditLimit) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Límite total</p>
                  <p className="text-lg font-bold text-gray-900">{formatPrice(dashboardStats.creditLimit)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Utilizado</p>
                  <p className="text-lg font-bold text-gray-900">{formatPrice(dashboardStats.creditUsed)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Disponible</p>
                  <p className="text-lg font-bold text-primary-600">{formatPrice(dashboardStats.creditAvailable)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Accesos Rápidos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Accesos Rápidos</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => action.link !== '#' && navigate(action.link)}
                    className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
                  >
                    <div className={`p-2 ${action.color} rounded-lg text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {action.title}
                      </p>
                      <p className="text-xs text-gray-600">{action.description}</p>
                    </div>
                    <HiOutlineArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pedidos Recientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Pedidos Recientes</h2>
            <button
              onClick={() => navigate(ROUTES.MY_ORDERS)}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
            >
              Ver todos
              <HiOutlineArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Pedido</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fecha</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Items</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Estado</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{order.id}</span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{formatDate(order.date)}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{order.items} producto(s)</td>
                    <td className="py-4 px-4 font-semibold text-gray-900">{formatPrice(order.total)}</td>
                    <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyAccount;

