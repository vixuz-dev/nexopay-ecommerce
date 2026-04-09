/**
 * @param {Record<string, unknown>} body - Respuesta de login, have-credit-line o creación de solicitud
 * @returns {number} 1 = puede mostrar solicitud de línea de crédito, 0 = no
 */
export function getCreditShowButtonFromApiBody(body) {
  if (!body || typeof body !== 'object') return 1;
  if (body.showButtonCreditLineRequest !== undefined) {
    const v = body.showButtonCreditLineRequest;
    if (v === true || v === 1) return 1;
    if (v === false || v === 0) return 0;
    return Number(v) === 1 ? 1 : 0;
  }
  const raw = body.showButton;
  if (raw === true || raw === 1) return 1;
  if (raw === false || raw === 0) return 0;
  if (raw !== undefined && raw !== null) return Number(raw) === 1 ? 1 : 0;
  return 1;
}

/**
 * @param {Record<string, unknown>} body
 * @returns {string}
 */
export function getCreditRequestStatusFromApiBody(body) {
  if (!body || typeof body !== 'object') return '';
  if (body.requestStatus != null && String(body.requestStatus).trim() !== '') {
    return String(body.requestStatus);
  }
  if (body.creditRequest != null && String(body.creditRequest).trim() !== '') {
    return String(body.creditRequest);
  }
  if (typeof body.creditStatus === 'string' && body.creditStatus.trim() !== '') {
    return String(body.creditStatus);
  }
  if (body.creditStatus === true) return 'aprobado';
  return '';
}
