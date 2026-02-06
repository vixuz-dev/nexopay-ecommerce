import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { creditLineRequestService } from '../api/services/creditLineRequestService';
import useUserStore from '../stores/userStore';
import { ROUTES } from '../utils/routes';
import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineDocumentText,
} from 'react-icons/hi2';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr.replace(' ', 'T'));
    return d.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
};

const MyCredit = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userName = user?.name?.trim() || '';

  useEffect(() => {
    let cancelled = false;
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await creditLineRequestService.getCreditLineRequests();
        if (!cancelled) {
          setRequests(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'No se pudieron cargar las solicitudes de crédito');
          setRequests([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchRequests();
    return () => { cancelled = true; };
  }, []);

  const hasApproved = requests.some(
    (r) => r.request_status && String(r.request_status).toLowerCase() === 'aprobado'
  );
  const latestRequest = requests.length > 0 ? requests[requests.length - 1] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Mi Crédito
          </h1>
          <p className="text-gray-600">
            Estado de tus solicitudes de línea de crédito NexoPay
          </p>
        </div>

        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Cargando tus solicitudes...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm font-medium text-red-600 hover:text-red-800 underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {hasApproved ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <HiOutlineCheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-green-900 mb-2">
                      Línea de crédito aprobada
                    </h2>
                    <p className="text-green-800">
                      Tu solicitud ha sido aprobada. Puedes utilizar tu línea de crédito NexoPay en tus próximas compras.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <HiOutlineClock className="w-7 h-7 text-primary-600" />
                    </div>
                    <h2 className="text-xl font-bold text-primary-900">
                      Lista de espera
                    </h2>
                  </div>
                </div>
                <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
                  <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-4">
                    <p className="text-base md:text-lg">
                      {userName ? (
                        <>Hola <strong>{userName}</strong>, gracias por tu interés en NexoPay.</>
                      ) : (
                        <>Gracias por tu interés en NexoPay.</>
                      )}
                    </p>
                    <p>
                      Lamentamos decirte que, tras analizar tu solicitud con cuidado, en este momento te hemos colocado en lista de espera, mientras buscamos una opción pensada para ti.
                    </p>
                    <p className="font-medium text-gray-900">
                      Muy pronto podremos ofrecerte algo especial.
                    </p>
                  </div>
                </article>
              </>
            )}

            {requests.length > 0 && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <HiOutlineDocumentText className="w-5 h-5 text-primary-600" />
                    Historial de solicitudes
                  </h2>
                </div>
                <ul className="divide-y divide-gray-200">
                  {requests.map((req) => {
                    const isApproved = req.request_status && String(req.request_status).toLowerCase() === 'aprobado';
                    const statusLabel =
                      req.request_status && String(req.request_status).toLowerCase() === 'rechazado'
                        ? 'En lista de espera'
                        : (req.request_status || 'En proceso');
                    return (
                      <li key={req.credit_line_request_id} className="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-gray-900">{req.name || 'Solicitud'}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(req.created_at)}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            isApproved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {!loading && !error && requests.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-600 mb-4">Aún no tienes solicitudes de crédito.</p>
                <button
                  onClick={() => navigate(ROUTES.REQUEST_CREDIT)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Solicitar línea de crédito
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyCredit;
