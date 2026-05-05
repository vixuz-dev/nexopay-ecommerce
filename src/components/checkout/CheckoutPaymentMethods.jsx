import { useRef } from 'react';
import {
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';
import { formatPriceMXN } from '../../utils/format';
import { TERMS_AND_CONDITIONS_URL } from '../../constants/app';
import { CardPaymentForm } from './CardPaymentForm';

export const CheckoutPaymentMethods = ({
  mpCardMethods,
  selectedMpMethodId,
  onSelectMpMethod,
  cardData,
  onCardDataChange,
  saveCard,
  onSaveCardChange,
  acceptedTerms,
  onAcceptedTermsChange,
  isProcessing,
  onCheckout,
  initialPayment,
}) => {
  const cardFormRef = useRef(null);
  const showCardForm = mpCardMethods.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Método de Pago</h3>

      <div className="space-y-3 mb-6">
        {mpCardMethods.map((pm) => {
          const thumb = pm.thumbnail || pm.secure_thumbnail;
          const isSelected = selectedMpMethodId === pm.id;
          return (
            <label
              key={pm.id}
              className={`flex gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="mpCardMethod"
                value={pm.id}
                checked={isSelected}
                onChange={() => onSelectMpMethod(pm.id)}
                className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-600 focus:ring-primary-500"
              />
              <div className="flex-1 min-w-0 flex items-center gap-3">
                <span className="font-medium text-gray-900">{pm.name}</span>
                {thumb ? (
                  <img
                    src={thumb}
                    alt=""
                    className="h-8 w-12 object-contain ml-auto shrink-0"
                  />
                ) : null}
              </div>
            </label>
          );
        })}

        {mpCardMethods.length === 0 && (
          <div className="p-4 text-center text-gray-500 text-sm">
            Cargando métodos de pago...
          </div>
        )}
      </div>

      {showCardForm && (
        <div className="space-y-4 mb-6 pt-4 border-t border-gray-200">
          <CardPaymentForm
            ref={cardFormRef}
            cardData={cardData}
            onCardDataChange={onCardDataChange}
            disabled={isProcessing}
          />

          <label className="hidden flex items-start gap-3 p-4 bg-blue-50 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={saveCard}
              onChange={(e) => onSaveCardChange(e.target.checked)}
              className="w-5 h-5 text-primary-600 focus:ring-primary-500 rounded mt-0.5"
            />
            <div>
              <span className="font-medium text-gray-900 text-sm">
                Guardar tarjeta para pagos automáticos
              </span>
              <p className="text-xs text-gray-600 mt-1">
                Tus pagos mensuales se cargarán automáticamente a esta tarjeta
              </p>
            </div>
          </label>
        </div>
      )}

      <label className="flex items-start gap-3 mb-6 cursor-pointer">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => onAcceptedTermsChange(e.target.checked)}
          className="w-5 h-5 text-primary-600 focus:ring-primary-500 rounded mt-0.5"
        />
        <span className="text-sm text-gray-600">
          Acepto los{' '}
          <a
            href={TERMS_AND_CONDITIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline"
          >
            términos y condiciones
          </a>
        </span>
      </label>

      <button
        type="button"
        onClick={async () => {
          if (showCardForm && cardFormRef.current) {
            const tokenResult = await cardFormRef.current.getToken();
            if (tokenResult) onCheckout(tokenResult);
          } else {
            onCheckout();
          }
        }}
        disabled={!acceptedTerms || isProcessing || !selectedMpMethodId || mpCardMethods.length === 0}
        className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
          acceptedTerms && !isProcessing && selectedMpMethodId && mpCardMethods.length > 0
            ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <HiOutlineLockClosed className="w-5 h-5" />
            Pagar {formatPriceMXN(initialPayment)}
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
        <HiOutlineShieldCheck className="w-4 h-4" />
        <span>Pago seguro con encriptación SSL</span>
      </div>
    </div>
  );
};
