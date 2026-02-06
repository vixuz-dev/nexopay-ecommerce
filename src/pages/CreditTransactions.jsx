import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { useAllCreditTransactions } from '../hooks/useAllCreditTransactions';
import { ROUTES } from '../utils/routes';
import CreditTransactionsTable from '../components/credit/CreditTransactionsTable';
import CreditTransactionsPagination from '../components/credit/CreditTransactionsPagination';
import CreditTransactionsSearch from '../components/credit/CreditTransactionsSearch';

const ITEMS_PER_PAGE = 10;

const CreditTransactions = () => {
  const navigate = useNavigate();
  const { transactions, loading } = useAllCreditTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    if (!searchTerm.trim()) {
      return transactions;
    }

    const term = searchTerm.toLowerCase();
    return transactions.filter(transaction => {
      const description = transaction.description.toLowerCase();
      const id = transaction.id.toLowerCase();
      const amount = Math.abs(transaction.amount).toString();
      
      return description.includes(term) || 
             id.includes(term) || 
             amount.includes(term);
    });
  }, [transactions, searchTerm]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTransactionClick = (transaction) => {
    console.log('Transaction clicked:', transaction);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(ROUTES.MY_ACCOUNT)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Volver a Mi Cuenta</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Movimientos de Crédito
          </h1>
          <p className="text-gray-600">
            Consulta todos tus movimientos y transacciones
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <CreditTransactionsSearch
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onClear={handleClearSearch}
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                {filteredTransactions.length > 0 ? (
                  <>
                    Mostrando {paginatedTransactions.length} de {filteredTransactions.length} movimientos
                  {searchTerm && (
                    <span className="ml-2 text-primary-600">
                      (filtrados por: "{searchTerm}")
                    </span>
                  )}
                  </>

                ) : (
                  <span>No se encontraron movimientos</span>
                )}
              </div>

              <CreditTransactionsTable
                transactions={paginatedTransactions}
                onTransactionClick={handleTransactionClick}
              />

              <CreditTransactionsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreditTransactions;

