import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import CreditSection from '../components/credit/CreditSection';
import RecommendedProducts from '../components/account/RecommendedProducts';
import ShopCTABanner from '../components/account/ShopCTABanner';
import InvoicesSummaryCard from '../components/account/InvoicesSummaryCard';
import { useInvoices } from '../hooks/useInvoices';
import useCreditStore from '../stores/creditStore';
import {
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineShoppingBag,
  HiOutlineCreditCard
} from 'react-icons/hi2';
import { formatPrice, formatDate } from '../utils/creditUtils';

const MyAccount = () => {
  const navigate = useNavigate();
  const { invoices } = useInvoices();
  const showButton = useCreditStore((state) => state.showButton);
  const requestStatus = useCreditStore((state) => state.requestStatus);
  const isLoaded = useCreditStore((state) => state.isLoaded);
  const fetchCreditLineStatus = useCreditStore((state) => state.fetchCreditLineStatus);
  const fetchCreditLineProfile = useCreditStore((state) => state.fetchCreditLineProfile);

  const hasApprovedCreditRequest =
    isLoaded &&
    showButton === 0 &&
    requestStatus &&
    String(requestStatus).toLowerCase() === 'aprobado';

  useEffect(() => {
    let cancelled = false;
    if (!isLoaded) {
      fetchCreditLineStatus().catch(() => {
        if (!cancelled) void 0;
      });
    }
    return () => { cancelled = true; };
  }, [isLoaded, fetchCreditLineStatus]);

  useEffect(() => {
    fetchCreditLineProfile().catch(() => {});
  }, [fetchCreditLineProfile]);

  const user = {
    id: '1',
    email: 'usuario@ejemplo.com',
    name: 'Usuario Ejemplo',
  };
  const isAuthenticated = true;
  const loading = false;

  const dashboardStats = {
    totalOrders: 12,
    pendingOrders: 2,
    completedOrders: 10,
    totalSpent: 125000,
    creditLimit: 50000,
    creditUsed: 15000,
    creditAvailable: 35000,
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
            Bienvenido de vuelta, {user?.email || 'Usuario'}
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

        {hasApprovedCreditRequest && <CreditSection />}

        <InvoicesSummaryCard invoices={invoices} />

        <RecommendedProducts limit={6} />

        <div className="mt-6">
          <ShopCTABanner />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyAccount;

