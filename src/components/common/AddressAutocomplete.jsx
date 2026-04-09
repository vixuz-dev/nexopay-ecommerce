import React, { useRef, useEffect } from 'react';
import { HiOutlineMapPin } from 'react-icons/hi2';
import { usePlacesAutocomplete } from '../../hooks/usePlacesAutocomplete';

/**
 * Campo principal de búsqueda de dirección con Google Places Autocomplete (sesión + debounce en el hook).
 * Al elegir una sugerencia se dispara onResolved con los campos del formulario Nexo (dirección personal).
 *
 * @param {Object} props
 * @param {(patch: Record<string, string>) => void} props.onResolved — calle, numeroExterior, numeroInterior, colonia, ciudad, estado, codigoPostal
 * @param {string} [props.label]
 * @param {string} [props.placeholder]
 * @param {boolean} [props.disabled]
 * @param {string} [props.hint]
 */
const AddressAutocomplete = ({
  onResolved,
  label = 'Buscar dirección',
  placeholder = 'Escribe calle, colonia o código postal…',
  disabled = false,
  hint = 'Selecciona una sugerencia para llenar los campos. Puedes ajustarlos después.',
}) => {
  const containerRef = useRef(null);

  const {
    inputValue,
    predictions,
    loadingPredictions,
    loadingDetails,
    error,
    isOpen,
    isScriptReady,
    handleInputChange,
    handleSelectPrediction,
    clearPredictions,
  } = usePlacesAutocomplete({
    onPlaceResolved: onResolved,
  });

  useEffect(() => {
    const onDocDown = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        clearPredictions();
      }
    };
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, [clearPredictions]);

  const showEmpty =
    isOpen &&
    !loadingPredictions &&
    predictions.length === 0 &&
    inputValue.trim().length >= 3;

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor="address-autocomplete-input" className="block text-sm font-semibold text-gray-700 mb-2">
        <span className="inline-flex items-center gap-2">
          <HiOutlineMapPin className="w-4 h-4 text-primary-600" />
          {label}
        </span>
      </label>
      <div className="relative">
        <input
          id="address-autocomplete-input"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled || !isScriptReady}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="address-autocomplete-listbox"
        />
        {loadingPredictions && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">Buscando…</span>
        )}
      </div>

      {hint && (
        <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {isOpen && (predictions.length > 0 || showEmpty) && (
        <ul
          id="address-autocomplete-listbox"
          role="listbox"
          className="absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {predictions.map((p) => (
            <li key={p.place_id} role="option">
              <button
                type="button"
                className="flex w-full flex-col items-start px-3 py-2.5 text-left text-sm text-gray-800 hover:bg-primary-50 focus:bg-primary-50 focus:outline-none"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelectPrediction(p);
                }}
              >
                <span className="font-medium text-gray-900">{p.structured_formatting?.main_text || p.description}</span>
                {p.structured_formatting?.secondary_text && (
                  <span className="text-xs text-gray-500">{p.structured_formatting.secondary_text}</span>
                )}
              </button>
            </li>
          ))}
          {showEmpty && (
            <li className="px-3 py-2.5 text-sm text-gray-500">No encontramos coincidencias. Intenta con otra búsqueda.</li>
          )}
        </ul>
      )}

      {loadingDetails && (
        <p className="mt-2 text-xs text-gray-500">Completando dirección…</p>
      )}
    </div>
  );
};

export default AddressAutocomplete;
