import { isApprovedCreditLineStatus } from './emailVerification';
import {
  getCreditShowButtonFromApiBody,
  getCreditRequestStatusFromApiBody,
} from './creditLineShowButton';

/**
 * @param {string|undefined|null} requestStatus
 * @returns {boolean}
 */
export const isRejectedCreditRequestStatus = (requestStatus) => {
  const s = String(requestStatus ?? '')
    .trim()
    .toLowerCase();
  return s === 'rechazado' || s === 'rejected';
};

/**
 * @param {string|undefined|null} requestStatus
 * @returns {boolean}
 */
export const isPendingCreditRequestStatus = (requestStatus) => {
  const s = String(requestStatus ?? '')
    .trim()
    .toLowerCase();
  if (!s) return false;
  return (
    s === 'pendiente' ||
    s === 'pending' ||
    s === 'en proceso' ||
    s === 'en revisión' ||
    s === 'en revision' ||
    s.includes('pendiente')
  );
};

/**
 * Reglas de negocio para comprar desde el carrito (línea de crédito aprobada).
 * @param {{ showButton: number, requestStatus: string, isStatusLoaded: boolean }} params
 * @returns {{ kind: 'loading' | 'allowed' | 'need_request' | 'rejected' | 'pending' | 'no_active_line' }}
 */
/**
 * Línea de crédito aprobada pero bloqueada por el backend (`creditStatus: false`).
 * Solo aplica si el usuario está en estado “aprobado” (misma regla que compras con línea).
 * @param {Record<string, unknown>|null|undefined} user - userStore.user
 * @returns {boolean}
 */
export const isCreditLineBlocked = (user) => {
  if (!user || typeof user !== 'object') return false;
  if (user.creditStatus !== false) return false;
  const showButton = getCreditShowButtonFromApiBody(user);
  const requestStatus = getCreditRequestStatusFromApiBody(user);
  return isApprovedCreditLineStatus(showButton, requestStatus);
};

export const getCartCreditAccessState = ({ showButton, requestStatus, isStatusLoaded }) => {
  if (!isStatusLoaded) {
    return { kind: 'loading' };
  }
  const sb = Number(showButton);
  if (isApprovedCreditLineStatus(sb, requestStatus)) {
    return { kind: 'allowed' };
  }
  if (isRejectedCreditRequestStatus(requestStatus)) {
    return { kind: 'rejected' };
  }
  if (isPendingCreditRequestStatus(requestStatus)) {
    return { kind: 'pending' };
  }
  if (sb === 1) {
    return { kind: 'need_request' };
  }
  return { kind: 'no_active_line' };
};
