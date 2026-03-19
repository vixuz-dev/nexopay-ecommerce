import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { ROUTES } from '../utils/routes';
import { useAccountMovements } from '../hooks/useAccountMovements';
import CreditTransactionItem from '../components/credit/CreditTransactionItem';
import AccountMovementsPagination from '../components/credit/AccountMovementsPagination';

const AccountMovements = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('pagina') || '1', 10);
  const currentPage = Math.max(1, isNaN(pageParam) ? 1 : pageParam);

  const { transactions, loading, total, totalPages, limit } = useAccountMovements(currentPage);

  const handlePageChange = (page) => {
    setSearchParams(page > 1 ? { pagina: String(page) } : {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

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
            Movimientos
          </h1>
          <p className="text-gray-500 text-sm">
            Historial de movimientos de tu línea de crédito
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500">No hay movimientos</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-500">
                  {total > 0 && (
                    <>
                      Mostrando {startItem}–{endItem} de {total} movimientos
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <CreditTransactionItem
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}
                </div>

                <AccountMovementsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountMovements;
