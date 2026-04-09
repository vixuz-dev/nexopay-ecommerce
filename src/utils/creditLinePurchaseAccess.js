import { isApprovedCreditLineStatus } from './emailVerification';

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
 * Reglas de negocio para comprar desde el carrito (línea de crédito aprobada).
 * @param {{ showButton: number, requestStatus: string, isStatusLoaded: boolean }} params
 * @returns {{ kind: 'loading' | 'allowed' | 'need_request' | 'rejected' | 'no_active_line' }}
 */
export const getCartCreditAccessState = ({ showButton, requestStatus, isStatusLoaded }) => {
  if (!isStatusLoaded) {
    return { kind: 'loading' };
  }
  const sb = Number(showButton);
  if (isApprovedCreditLineStatus(sb, requestStatus)) {
    return { kind: 'allowed' };
  }
  if (sb === 1) {
    return { kind: 'need_request' };
  }
  if (isRejectedCreditRequestStatus(requestStatus)) {
    return { kind: 'rejected' };
  }
  return { kind: 'no_active_line' };
};
