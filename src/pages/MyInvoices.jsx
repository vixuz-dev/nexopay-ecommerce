import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { useInvoices } from '../hooks/useInvoices';
import InvoiceSummary from '../components/invoices/InvoiceSummary';
import InvoiceFilters from '../components/invoices/InvoiceFilters';
import InvoiceCard from '../components/invoices/InvoiceCard';

const MyInvoices = () => {
  const navigate = useNavigate();
  const { invoices, loading } = useInvoices();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredInvoices = useMemo(() => {
    let filtered = invoices;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(invoice => {
        const invoiceNumber = invoice.invoiceNumber.toLowerCase();
        const itemsText = invoice.items.map(item => item.name.toLowerCase()).join(' ');
        return invoiceNumber.includes(term) || itemsText.includes(term);
      });
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [invoices, statusFilter, searchTerm]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handlePay = (invoice, payment = null) => {
    console.log('Pay invoice:', invoice, payment);
    navigate('/pagar-credito', { 
      state: { 
        invoiceId: invoice.id,
        paymentId: payment ? payment.type : null
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/mi-cuenta')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Volver a Mi Cuenta</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Mis Facturas
          </h1>
          <p className="text-gray-600">
            Consulta todas tus facturas y calendarios de pago
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            <InvoiceSummary invoices={invoices} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <InvoiceFilters
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onSearchChange={handleSearchChange}
                onStatusFilterChange={handleStatusFilterChange}
                onClearSearch={handleClearSearch}
              />

              {filteredInvoices.length > 0 ? (
                <>
                  <div className="mb-4 text-sm text-gray-600">
                    Mostrando {filteredInvoices.length} {filteredInvoices.length === 1 ? 'factura' : 'facturas'}
                    {searchTerm && (
                      <span className="ml-2 text-primary-600">
                        (filtradas por: "{searchTerm}")
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    {filteredInvoices.map((invoice) => (
                      <InvoiceCard
                        key={invoice.id}
                        invoice={invoice}
                        onPay={handlePay}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No se encontraron facturas</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default MyInvoices;

