import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineXMark } from 'react-icons/hi2';
import { ROUTES, EMAIL_VERIFY_FROM_QUERY, EMAIL_VERIFY_FROM } from '../../utils/routes';
import { creditLineBlockedCopy } from '../../utils/creditLinePurchaseAccess';

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {'need_request' | 'rejected' | 'pending' | 'no_active_line' | 'line_blocked' | 'email_unverified' | null} props.variant
 * @param {() => void} props.onClose
 */
const CartCreditGateModal = ({ isOpen, variant, onClose }) => {
  if (!isOpen || !variant) return null;

  const content =
    variant === 'email_unverified'
      ? {
          title: 'Verifica tu correo electrónico',
          body: 'Para realizar compras debes verificar primero tu correo electrónico. Revisa tu bandeja de entrada o solicita un nuevo código de verificación.',
          primaryTo: `${ROUTES.EMAIL_VERIFICATION}?${EMAIL_VERIFY_FROM_QUERY}=${EMAIL_VERIFY_FROM.BANNER}`,
          primaryLabel: 'Ir a verificar correo',
        }
      : variant === 'line_blocked'
      ? {
          title: creditLineBlockedCopy.headline,
          body: creditLineBlockedCopy.detail,
          primaryTo: null,
          primaryLabel: null,
        }
      : variant === 'need_request'
      ? {
          title: 'Solicita tu línea de crédito',
          body: 'Para continuar con tu compra y agregar direcciones de envío, primero debes solicitar tu línea de crédito NexoPay.',
          primaryTo: ROUTES.REQUEST_CREDIT,
          primaryLabel: 'Solicitar línea de crédito',
        }
      : variant === 'rejected'
        ? {
            title: 'Tu solicitud de crédito no fue aprobada',
            body: 'Para comprar a plazos en NexoPay necesitas una línea de crédito aprobada. En esta ocasión tu solicitud no fue aprobada, por eso no podemos dejarte continuar con la compra ni usar financiamiento. Te agradecemos tu interés. Si más adelante hay cambios o una nueva evaluación, podrás volver a intentarlo. Puedes revisar el detalle en Mis solicitudes.',
            primaryTo: ROUTES.MY_CREDIT,
            primaryLabel: 'Ver mis solicitudes',
          }
        : variant === 'pending'
          ? {
              title: 'Solicitud en revisión',
              body: 'Tu solicitud de crédito está en proceso de revisión. No puedes completar compras hasta que sea aprobada. Te notificaremos cuando haya novedades.',
              primaryTo: ROUTES.MY_CREDIT,
              primaryLabel: 'Ver mis solicitudes',
            }
          : {
              title: 'Compra no disponible aún',
              body: 'Tu solicitud de crédito aún no ha sido aprobada. No puedes completar compras hasta contar con una línea activa. Te notificaremos cuando haya novedades.',
              primaryTo: ROUTES.MY_CREDIT,
              primaryLabel: 'Ver mis solicitudes',
            };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-credit-gate-title"
        className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          aria-label="Cerrar"
        >
          <HiOutlineXMark className="w-5 h-5" />
        </button>
        <h2 id="cart-credit-gate-title" className="text-lg font-bold text-gray-900 pr-8 mb-3">
          {content.title}
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">{content.body}</p>
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Entendido
          </button>
          {content.primaryTo ? (
            <Link
              to={content.primaryTo}
              onClick={onClose}
              className="w-full sm:w-auto text-center px-4 py-2.5 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
            >
              {content.primaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CartCreditGateModal;
