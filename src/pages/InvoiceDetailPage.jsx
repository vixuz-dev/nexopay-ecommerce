import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { HiOutlineArrowLeft, HiOutlineDocumentText } from 'react-icons/hi2';
import { useInvoiceByOrderId } from '../hooks/useInvoiceByOrderId';
import InvoiceDetail from '../components/invoices/InvoiceDetail';
import { formatPrice, formatDate } from '../utils/creditUtils';

const InvoiceDetailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { invoice, loading } = useInvoiceByOrderId(orderId);

  const handlePay = (invoice, payment = null) => {
    navigate('/pagar-credito', { 
      state: { 
        invoiceId: invoice.id,
        paymentId: payment ? payment.type : null
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/mis-compras')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Volver a Mis Compras</span>
          </button>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <HiOutlineDocumentText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Factura no encontrada</h2>
            <p className="text-gray-600 mb-6">
              No se encontró una factura asociada a este pedido.
            </p>
            <button
              onClick={() => navigate('/mis-compras')}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
            >
              Volver a Mis Compras
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/mis-compras')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Volver a Mis Compras</span>
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <HiOutlineDocumentText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {invoice.invoiceNumber}
              </h1>
              <p className="text-gray-600">
                Factura del pedido {invoice.orderId}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Fecha de emisión</p>
                <p className="text-sm font-semibold text-gray-900">{formatDate(invoice.date)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Total de la factura</p>
                <p className="text-sm font-semibold text-gray-900">{formatPrice(invoice.total)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Estado</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  invoice.status === 'paid' 
                    ? 'bg-green-100 text-green-800'
                    : invoice.status === 'partial'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {invoice.status === 'paid' 
                    ? 'Pagada completamente'
                    : invoice.status === 'partial'
                    ? 'Pago parcial'
                    : 'Pendiente'}
                </span>
              </div>
            </div>
          </div>

          <InvoiceDetail invoice={invoice} onPay={handlePay} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InvoiceDetailPage;

