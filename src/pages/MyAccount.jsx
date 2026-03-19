import React, { useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import CreditSection from '../components/credit/CreditSection';
import RecommendedProducts from '../components/account/RecommendedProducts';
import ShopCTABanner from '../components/account/ShopCTABanner';
import useCreditStore from '../stores/creditStore';
import useUserStore from '../stores/userStore';
import useProfileStore from '../stores/profileStore';
import {
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineShoppingBag,
  HiOutlineCreditCard
} from 'react-icons/hi2';
import { formatPrice } from '../utils/creditUtils';

const MyAccount = () => {
  const user = useUserStore((state) => state.user);
  const fetchCreditLineHistory = useCreditStore((state) => state.fetchCreditLineHistory);
  const fetchProfileInformation = useProfileStore((state) => state.fetchProfileInformation);
  const profileInformation = useProfileStore((state) => state.profileInformation);

  const creditLineInfo = profileInformation?.credit_line_information ?? {};
  const hasApprovedCreditRequest = creditLineInfo.has_line_credit === true;

  useEffect(() => {
    fetchProfileInformation().catch(() => {});
  }, [fetchProfileInformation]);

  useEffect(() => {
    fetchCreditLineHistory().catch(() => {});
  }, [fetchCreditLineHistory]);

  const displayName = user?.name?.trim() || 'Usuario';
  const isAuthenticated = !!user;
  const loading = false;

  const orders = profileInformation?.orders ?? {};
  const dashboardStats = {
    totalOrders: orders.total_orders ?? 0,
    pendingOrders: orders.pending_orders ?? 0,
    completedOrders: orders.completed_orders ?? 0,
    canceledOrders: orders.canceled_orders ?? 0,
    creditLimit: creditLineInfo.limit_credit_amount ?? 0,
    creditUsed: creditLineInfo.credit_used ?? 0,
    creditAvailable: creditLineInfo.remaining_credit_amount ?? 0,
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Mi Cuenta
          </h1>
          <p className="text-gray-600">
            Bienvenido de vuelta, {displayName}
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 ${hasApprovedCreditRequest ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <HiOutlineShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{dashboardStats.totalOrders}</span>
            </div>
            <p className="text-sm text-gray-600">Total de pedidos</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <HiOutlineClock className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{dashboardStats.pendingOrders}</span>
            </div>
            <p className="text-sm text-gray-600">Pedidos pendientes</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <HiOutlineCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{dashboardStats.completedOrders}</span>
            </div>
            <p className="text-sm text-gray-600">Pedidos completados</p>
          </div>

          {hasApprovedCreditRequest && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <HiOutlineCreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{formatPrice(dashboardStats.creditAvailable)}</span>
              </div>
              <p className="text-sm text-gray-600">Crédito disponible</p>
            </div>
          )}
        </div>

        <CreditSection hasApproved={hasApprovedCreditRequest} />

        {/* Recomendados para ti - Oculto por ahora
        <RecommendedProducts limit={6} />
        */}

        <div className="mt-6">
          <ShopCTABanner />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyAccount;

