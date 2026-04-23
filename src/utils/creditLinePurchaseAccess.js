import { isApprovedCreditLineStatus } from './emailVerification';
import {
  getCreditShowButtonFromApiBody,
  getCreditRequestStatusFromApiBody,
} from './creditLineShowButton';

/** Texto unificado: línea aprobada pero dada de baja (`creditStatus: false`). */
export const creditLineBlockedCopy = {
  headline: 'Tu cuenta está deshabilitada para compras con crédito.',
  detail:
    'Tu línea de crédito ha sido dada de baja. No podrás crear nuevas órdenes ni usar crédito hasta que se regularice tu cuenta. Si consideras que es un error, contacta al equipo de NexoPay.',
};

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
 * Sin solicitud de crédito aún (p. ej. login: `hasCreditLine` false, `creditStatus` false, `creditRequest` vacío).
 * @param {Record<string, unknown>|null|undefined} user - userStore.user
 * @returns {boolean}
 */
export const isNoCreditRequestYetFromUser = (user) => {
  if (!user || typeof user !== 'object') return false;
  if (user.hasCreditLine !== false) return false;
  if (user.creditStatus !== false) return false;
  const cr = user.creditRequest;
  if (cr != null && String(cr).trim() !== '') return false;
  return true;
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
 * @param {string|undefined|null} requestStatus
 * @returns {boolean}
 */
const isApprovedCreditRequestText = (requestStatus) => {
  const s = String(requestStatus ?? '')
    .trim()
    .toLowerCase();
  return s === 'aprobado' || s === 'approved';
};

/**
 * Línea de crédito aprobada pero bloqueada por el backend (`creditStatus: false`).
 * Incluye el caso `creditRequest: "Aprobado"`, `hasCreditLine: true` y `creditStatus: false` (línea dada de baja)
 * aunque `showButton` no venga en 0.
 * @param {Record<string, unknown>|null|undefined} user - userStore.user
 * @returns {boolean}
 */
export const isCreditLineBlocked = (user) => {
  if (!user || typeof user !== 'object') return false;
  if (user.creditStatus !== false) return false;
  const showButton = getCreditShowButtonFromApiBody(user);
  const requestStatus = getCreditRequestStatusFromApiBody(user);
  if (isApprovedCreditLineStatus(showButton, requestStatus)) return true;
  if (user.hasCreditLine === true && isApprovedCreditRequestText(requestStatus)) return true;
  return false;
};

/**
 * @param {{ showButton: number, requestStatus: string, isStatusLoaded: boolean, user?: Record<string, unknown>|null }} params
 * @returns {{ kind: 'loading' | 'allowed' | 'need_request' | 'rejected' | 'pending' | 'no_active_line' | 'line_blocked' | 'email_unverified' }}
 */
export const getCartCreditAccessState = ({ showButton, requestStatus, isStatusLoaded, user }) => {
  if (user && user.emailVerified !== true) {
    return { kind: 'email_unverified' };
  }
  if (!isStatusLoaded) {
    return { kind: 'loading' };
  }
  if (user && isCreditLineBlocked(user)) {
    return { kind: 'line_blocked' };
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
