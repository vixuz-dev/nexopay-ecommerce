import React, { useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import CreditSection from '../components/credit/CreditSection';
import BlockedCreditLineAccountCard from '../components/account/BlockedCreditLineAccountCard';
import { isCreditLineBlocked } from '../utils/creditLinePurchaseAccess';
import ShopCTABanner from '../components/account/ShopCTABanner';
import useCreditStore from '../stores/creditStore';
import useUserStore from '../stores/userStore';
import useProfileStore from '../stores/profileStore';
import { isApprovedCreditLineStatus } from '../utils/emailVerification';
import {
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineShoppingBag,
} from 'react-icons/hi2';

const StatCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-lg" />
      <div className="w-12 h-7 bg-gray-200 rounded" />
    </div>
    <div className="w-24 h-4 bg-gray-200 rounded" />
  </div>
);

const MyAccount = () => {
  const user = useUserStore((state) => state.user);
  const fetchCreditLineHistory = useCreditStore((state) => state.fetchCreditLineHistory);
  const fetchCreditLineStatus = useCreditStore((state) => state.fetchCreditLineStatus);
  const showButton = useCreditStore((state) => state.showButton);
  const requestStatus = useCreditStore((state) => state.requestStatus);
  const isCreditStatusLoaded = useCreditStore((state) => state.isStatusLoaded);
  const fetchProfileInformation = useProfileStore((state) => state.fetchProfileInformation);
  const profileInformation = useProfileStore((state) => state.profileInformation);
  const isProfileLoaded = useProfileStore((state) => state.isProfileLoaded);

  const hasApprovedCreditRequest =
    isCreditStatusLoaded && isApprovedCreditLineStatus(showButton, requestStatus);

  useEffect(() => {
    void fetchCreditLineStatus();
  }, [fetchCreditLineStatus]);

  useEffect(() => {
    fetchProfileInformation().catch(() => {});
  }, [fetchProfileInformation]);

  useEffect(() => {
    fetchCreditLineHistory().catch(() => {});
  }, [fetchCreditLineHistory]);

  const displayName = user?.name?.trim() || 'Usuario';
  const loading = !isProfileLoaded;

  const orders = profileInformation?.orders ?? {};
  const dashboardStats = {
    totalOrders: orders.total_orders ?? 0,
    pendingOrders: orders.pending_orders ?? 0,
    completedOrders: orders.completed_orders ?? 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Mi Cuenta
          </h1>
          {loading ? (
            <div className="w-48 h-5 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-gray-600">
              Bienvenido de vuelta, {displayName}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 animate-pulse">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-200 rounded-lg" />
              <div>
                <div className="w-32 h-5 bg-gray-200 rounded mb-2" />
                <div className="w-48 h-3 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-full h-10 bg-gray-200 rounded-lg" />
              <div className="w-full h-10 bg-gray-200 rounded-lg" />
            </div>
          </div>
        ) : isCreditLineBlocked(user) ? (
          <BlockedCreditLineAccountCard />
        ) : (
          <CreditSection hasApproved={hasApprovedCreditRequest} />
        )}

        {loading ? (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              <div className="flex-1">
                <div className="w-40 h-5 bg-gray-200 rounded mb-2" />
                <div className="w-64 h-3 bg-gray-200 rounded" />
              </div>
              <div className="w-28 h-10 bg-gray-200 rounded-lg" />
            </div>
          </div>
        ) : !isCreditLineBlocked(user) ? (
          <div className="mt-6">
            <ShopCTABanner />
          </div>
        ) : null}
      </main>
      
      <Footer />
    </div>
  );
};

export default MyAccount;
