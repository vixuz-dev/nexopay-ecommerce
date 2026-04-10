import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import useUserStore from '../stores/userStore';
import useCreditStore from '../stores/creditStore';
import { ROUTES } from '../utils/routes';
import { formatPriceMXN } from '../utils/format';
import { parseCreditLineLimitAmount } from '../utils/creditUtils';
import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineCreditCard,
  HiOutlineDocumentText,
  HiOutlineShoppingBag,
  HiOutlineSparkles,
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
  const creditLineRequests = useCreditStore((state) => state.creditLineRequests);
  const isRequestsLoaded = useCreditStore((state) => state.isRequestsLoaded);
  const fetchCreditLineRequests = useCreditStore((state) => state.fetchCreditLineRequests);
  const fetchCreditLine = useCreditStore((state) => state.fetchCreditLine);
  const creditLine = useCreditStore((state) => state.creditLine);
  const lastCreditRequestResult = useCreditStore((state) => state.lastCreditRequestResult);
  const [error, setError] = useState(null);
  const firstName = user?.name?.trim() || '';
  const creditAmountFromApi = parseCreditLineLimitAmount(creditLine);
  const creditAmountFromUser = user?.limitCreditAmount ?? 0;
  const creditAmount =
    creditAmountFromApi ??
    lastCreditRequestResult?.creditLineAmount ??
    creditAmountFromUser;

  useEffect(() => {
    let cancelled = false;
    setError(null);
    fetchCreditLineRequests().catch((err) => {
      if (!cancelled) {
        setError(err.message || 'No se pudieron cargar las solicitudes de crédito');
      }
    });
    return () => { cancelled = true; };
  }, [fetchCreditLineRequests]);

  useEffect(() => {
    fetchCreditLine().catch(() => {});
  }, [fetchCreditLine]);

  const loading = !isRequestsLoaded;
  const requests = creditLineRequests;
  const hasApprovedFromRequests = requests.some(
    (r) => r.request_status && String(r.request_status).toLowerCase() === 'aprobado'
  );
  const hasApproved = lastCreditRequestResult?.approvedRequest === true || hasApprovedFromRequests;
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-[3rem] md:pt-[5rem] pb-[10rem] md:pb-[15rem]">
        {!hasApproved && (
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Mis solicitudes
            </h1>
            <p className="text-gray-600">
              Estado de tus solicitudes de línea de crédito NexoPay
            </p>
          </div>
        )}

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
            {requests.length === 0 ? (
              <div className="max-w-2xl space-y-8">
                <section>
                  <p className="text-lg text-gray-600">
                    Compra hoy y paga después. Solicita tu línea de crédito y disfruta de productos con pagos flexibles.
                  </p>
                </section>

                <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    ¿Cómo funciona?
                  </h2>
                  <ol className="space-y-5">
                    <li className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center">1</span>
                      <div>
                        <p className="font-semibold text-gray-900">Solicita tu línea de crédito</p>
                        <p className="text-gray-600 text-sm mt-1">Completa un proceso sencillo con tu información básica y documentos.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center">2</span>
                      <div>
                        <p className="font-semibold text-gray-900">Recibe tu aprobación</p>
                        <p className="text-gray-600 text-sm mt-1">Te notificamos en minutos si tu crédito fue aprobado.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center">3</span>
                      <div>
                        <p className="font-semibold text-gray-900">Compra y paga a plazos</p>
                        <p className="text-gray-600 text-sm mt-1">Disfruta tus compras con un pago inicial y el resto en mensualidades cómodas.</p>
                      </div>
                    </li>
                  </ol>
                </section>

                <section className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-xl border-2 border-primary-200 p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    ¿Listo para empezar?
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Solicita tu línea de crédito NexoPay y comienza a comprar con pagos flexibles.
                  </p>
                  <button
                    onClick={() => navigate(ROUTES.REQUEST_CREDIT)}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <HiOutlineCreditCard className="w-6 h-6" />
                    Solicitar mi línea de crédito
                  </button>
                </section>
              </div>
            ) : hasApproved ? (
              <div className="space-y-8">
                <section className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 mb-4 shadow-lg">
                    <HiOutlineSparkles className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    ¡Felicidades{firstName ? `, ${firstName}` : ''}!
                  </h1>
                  <p className="text-xl font-semibold text-primary-600 mb-3">
                    Tu línea de crédito NexoPay ha sido aprobada.
                  </p>
                  <p className="text-gray-600 max-w-xl mx-auto">
                    Ahora puedes comprar hoy y pagar después en tus próximas compras.
                  </p>
                  <p className="text-gray-600 font-medium">
                    El crédito ya está listo para usar.
                  </p>
                </section>

                <section className="max-w-md mx-auto">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700 p-8 shadow-xl text-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                    <div className="relative">
                      <p className="text-sm font-medium text-white/90 uppercase tracking-wider mb-2">
                        Crédito disponible
                      </p>
                      <p className="text-4xl md:text-5xl font-bold mb-2">
                        {formatPriceMXN(creditAmount)}
                      </p>
                      <p className="text-white/90 font-medium flex items-center gap-2">
                        <HiOutlineCheckCircle className="w-5 h-5 text-highlight-400" />
                        Disponible para usar ahora
                      </p>
                    </div>
                  </div>
                </section>

                <section className="text-center max-w-xl mx-auto">
                  <p className="text-gray-700 leading-relaxed">
                    Tu perfil ha sido aprobado para una línea de crédito NexoPay.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-1">
                    Empieza a usar tu crédito hoy mismo en tus próximas compras.
                  </p>
                </section>

                <section className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => navigate(ROUTES.PRODUCTS)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <HiOutlineShoppingBag className="w-6 h-6" />
                    Explorar productos
                  </button>
                  <button
                    onClick={() => navigate(ROUTES.MY_ACCOUNT)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary-500 text-primary-600 hover:bg-primary-50 font-medium rounded-xl transition-all duration-200"
                  >
                    <HiOutlineCreditCard className="w-5 h-5" />
                    Ver mi crédito
                  </button>
                </section>

                <section className="bg-white/60 rounded-xl p-6 border border-gray-200 max-w-2xl mx-auto">
                  <h3 className="font-semibold text-gray-900 mb-4 text-center">
                    ¿Cómo usar tu crédito?
                  </h3>
                  <ol className="space-y-4">
                    <li className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm">1</span>
                      <div>
                        <p className="font-medium text-gray-900">Elige un producto</p>
                        <p className="text-sm text-gray-600">Explora el catálogo y selecciona lo que necesitas.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm">2</span>
                      <div>
                        <p className="font-medium text-gray-900">Paga un pequeño anticipo</p>
                        <p className="text-sm text-gray-600">Realiza un pago inicial al momento de la compra.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm">3</span>
                      <div>
                        <p className="font-medium text-gray-900">El resto lo pagas en semanas</p>
                        <p className="text-sm text-gray-600">Disfruta tu compra y liquida en pagos cómodos.</p>
                      </div>
                    </li>
                  </ol>
                </section>

                {requests.length > 0 && (
                  <section className="bg-gray-100/80 rounded-xl p-5 border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-4">
                      <HiOutlineDocumentText className="w-4 h-4" />
                      Historial de solicitudes
                    </h3>
                    <ul className="space-y-3">
                      {requests.map((req) => {
                        const isApproved = req.request_status && String(req.request_status).toLowerCase() === 'aprobado';
                        return (
                          <li key={req.credit_line_request_id} className="flex flex-wrap items-center justify-between gap-3 text-sm">
                            <div>
                              <p className="text-gray-700">{formatDate(req.created_at)}</p>
                              <p className="text-gray-500">{req.name || 'Solicitud'}</p>
                            </div>
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {isApproved ? 'Aprobado' : (req.request_status || 'En proceso')}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                )}
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
                      {firstName ? (
                        <>Hola <strong>{firstName}</strong>, gracias por tu interés en NexoPay.</>
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

            {!hasApproved && requests.length > 0 && (
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

          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyCredit;
