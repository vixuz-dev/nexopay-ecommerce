import { ROUTES, EMAIL_VERIFY_FROM_QUERY, EMAIL_VERIFY_FROM } from './routes';

/**
 * Tras validar el OTP de correo: destino según `?from=` (solicitud aprobada → mis solicitudes).
 * @param {string} [search] - `location.search` (ej. `?from=credit-request`)
 * @returns {string} ruta interna
 */
export function getPostEmailVerificationDestination(search) {
  const raw = typeof search === 'string' ? search : '';
  const query = raw.startsWith('?') ? raw.slice(1) : raw;
  const params = new URLSearchParams(query);
  if (params.get(EMAIL_VERIFY_FROM_QUERY) === EMAIL_VERIFY_FROM.CREDIT_REQUEST) {
    return ROUTES.MY_CREDIT;
  }
  return ROUTES.HOME;
}

/**
 * Crédito aprobado: ya no puede solicitar (showButton 0; API: showButtonCreditLineRequest false) y el estado es aprobado.
 * Alineado con login y userStore (showButtonCreditLineRequest / creditRequest).
 */
export function isApprovedCreditLineStatus(showButton, requestStatus) {
  if (showButton !== 0) return false;
  const s = String(requestStatus ?? '')
    .trim()
    .toLowerCase();
  return s === 'aprobado' || s === 'approved';
}

/**
 * Muestra el banner de verificación de correo solo si el correo no está verificado
 * y la solicitud de crédito existe y fue aprobada (no sin solicitud, no rechazada, no pendiente).
 */
export function shouldShowEmailVerificationBanner({
  emailVerified,
  showButton,
  requestStatus,
  isCreditStatusLoaded,
}) {
  if (emailVerified === true) return false;
  if (!isCreditStatusLoaded) return false;
  return isApprovedCreditLineStatus(showButton, requestStatus);
}
