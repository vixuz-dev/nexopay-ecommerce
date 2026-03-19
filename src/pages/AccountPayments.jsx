import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { ROUTES } from '../utils/routes';
import { usePendingPayments } from '../hooks/usePendingPayments';
import PendingPaymentsContent from '../components/account/PendingPaymentsContent';

const AccountPayments = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = usePendingPayments();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(ROUTES.MY_ACCOUNT)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Volver a Mi Cuenta</span>
        </button>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Pagos
          </h1>
          <p className="text-gray-500 text-sm">
            Revisa y realiza el pago de tus cuotas pendientes
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">{error?.message ?? 'Error al cargar los pagos pendientes'}</p>
              <button
                onClick={() => navigate(ROUTES.MY_ACCOUNT)}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Volver a Mi Cuenta
              </button>
            </div>
          ) : (
            <PendingPaymentsContent data={data} onPaymentSuccess={refetch} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountPayments;
