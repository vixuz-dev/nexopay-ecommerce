import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  HiOutlineExclamationTriangle,
  HiOutlineTrash,
  HiOutlineXMark,
} from 'react-icons/hi2';
import { authService } from '../../api/services/authService';
import { performLogout } from '../../utils/authInterceptor';
import useToastStore from '../../stores/toastStore';
import useCartStore from '../../stores/cartStore';
import useCreditStore from '../../stores/creditStore';
import usePreOrderStore from '../../stores/preOrderStore';
import {
  DELETE_ACCOUNT_REASON_OPTIONS,
  DELETE_ACCOUNT_REASON_OTHER,
} from '../../constants/app';

const CONFIRM_PHRASE = 'ELIMINAR';

/**
 * Sección de perfil: eliminación permanente de cuenta (confirmación en dos pasos).
 */
export const DangerZoneAccountSection = () => {
  const showToast = useToastStore((s) => s.showToast);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const resolveReasonDelete = () => {
    if (!selectedReason) return '';
    if (selectedReason === DELETE_ACCOUNT_REASON_OTHER) return customReason.trim();
    return selectedReason.trim();
  };

  const openModal = () => {
    setConfirmText('');
    setSelectedReason('');
    setCustomReason('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (isDeleting) return;
    setModalOpen(false);
    setConfirmText('');
    setSelectedReason('');
    setCustomReason('');
  };

  useEffect(() => {
    if (!modalOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [modalOpen]);

  const reasonDelete = resolveReasonDelete();
  const reasonOk = Boolean(selectedReason) && reasonDelete.length >= 3;

  const canSubmit =
    reasonOk &&
    confirmText.trim().toUpperCase() === CONFIRM_PHRASE &&
    !isDeleting;

  const handleDeleteAccount = async () => {
    if (!canSubmit) return;
    setIsDeleting(true);
    try {
      await authService.deleteClientAccount({ reasonDelete });
      useCartStore.getState().clearCart();
      useCreditStore.getState().resetStatus();
      useCreditStore.getState().clearCreditData();
      useCreditStore.getState().clearLastCreditRequestResult();
      usePreOrderStore.getState().setPreOrder(null);
      performLogout();
    } catch (err) {
      const msg =
        err?.message || 'No se pudo eliminar la cuenta. Intenta de nuevo más tarde.';
      showToast(msg, 'error');
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
        <div className="flex items-center gap-2 mb-2">
          <HiOutlineExclamationTriangle className="w-5 h-5 text-red-600" />
          <h2 className="text-base font-semibold text-gray-900">Zona de peligro</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Al eliminar tu cuenta se borrará tu acceso a NexoPay y los datos asociados a este
          perfil, según las políticas del servicio. Esta acción no se puede deshacer desde la
          tienda.
        </p>
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
        >
          <HiOutlineTrash className="w-4 h-4" />
          Eliminar mi cuenta
        </button>
      </div>

      {modalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[10000] flex min-h-0 items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[min(90dvh,100%)] overflow-y-auto p-6 relative">
              <button
                type="button"
                onClick={closeModal}
                disabled={isDeleting}
                className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                aria-label="Cerrar"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-3">
                  <HiOutlineExclamationTriangle className="w-7 h-7 text-red-600" />
                </div>
                <h3
                  id="delete-account-title"
                  className="text-lg font-bold text-gray-900 mb-2 pr-8"
                >
                  ¿Eliminar tu cuenta permanentemente?
                </h3>
                <p className="text-sm text-gray-600 text-left w-full">
                  Perderás el acceso con este usuario, tu historial en la app y deberás registrarte de
                  nuevo si deseas volver a usar el servicio.
                </p>
              </div>
              <fieldset className="border border-gray-200 rounded-xl bg-white p-4 mb-2">
                <legend className="text-sm font-semibold text-gray-900 px-1 mb-3">
                  ¿Por qué quieres eliminar tu cuenta?
                </legend>
                <div className="space-y-3">
                  {DELETE_ACCOUNT_REASON_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 cursor-pointer rounded-lg p-2 -m-2 transition-colors ${
                        isDeleting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delete-account-reason"
                        value={opt.value}
                        checked={selectedReason === opt.value}
                        onChange={() => {
                          setSelectedReason(opt.value);
                          if (opt.value !== DELETE_ACCOUNT_REASON_OTHER) setCustomReason('');
                        }}
                        disabled={isDeleting}
                        className="mt-1 h-4 w-4 shrink-0 border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 leading-snug">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {selectedReason === DELETE_ACCOUNT_REASON_OTHER && (
                <>
                  <label className="block text-left text-xs font-medium text-gray-600 mb-1.5">
                    Describe tu motivo
                  </label>
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    disabled={isDeleting}
                    rows={3}
                    maxLength={500}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50 mb-4 resize-y min-h-[5rem]"
                    placeholder="Escribe al menos unas palabras sobre por qué eliminas tu cuenta"
                  />
                </>
              )}
              <label className="block text-left text-xs font-medium text-gray-600 mb-1.5 mt-4">
                Escribe <span className="font-mono font-semibold text-gray-900">{CONFIRM_PHRASE}</span>{' '}
                para confirmar
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                disabled={isDeleting}
                autoComplete="off"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50 mb-4"
                placeholder={CONFIRM_PHRASE}
              />
              <div className="flex flex-col gap-2 sm:flex-row-reverse sm:gap-3">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={!canSubmit}
                  className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isDeleting ? 'Eliminando…' : 'Sí, eliminar mi cuenta'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isDeleting}
                  className="w-full px-4 py-2.5 bg-gray-100 text-gray-800 rounded-lg font-semibold text-sm hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
