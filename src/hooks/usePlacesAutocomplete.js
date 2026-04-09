import { useCallback, useEffect, useRef, useState } from 'react';
import { loadGoogleMapsPlacesLibrary } from '../utils/loadGoogleMapsPlaces';
import { mapGooglePlaceToNexoPersonalAddress } from '../utils/mapGooglePlaceToNexoPersonalAddress';

const DEFAULT_MIN_CHARS = 3;
const DEFAULT_DEBOUNCE_MS = 350;
const DEFAULT_COMPONENT_RESTRICTIONS = { country: 'mx' };
const PREDICTIONS_TIMEOUT_MS = 15000;
const DETAILS_TIMEOUT_MS = 15000;

/**
 * @param {string} status
 * @returns {string | null}
 */
const mapPredictionStatusToMessage = (status) => {
  const s = String(status ?? '');
  if (s === 'REQUEST_DENIED' || s === 'INVALID_REQUEST') {
    return 'No se pudo usar el autocompletado. En Google Cloud activa la API «Maps JavaScript API» (y facturación del proyecto), habilita también «Places API» si aplica, revisa la clave en VITE_GOOGLE_MAP_KEY y que las restricciones permitan este sitio (p. ej. http://localhost:5173/*).';
  }
  if (s === 'OVER_QUERY_LIMIT' || s === 'RESOURCE_EXHAUSTED') {
    return 'Límite de consultas alcanzado. Intenta más tarde.';
  }
  if (s === 'UNKNOWN_ERROR') {
    return 'Error temporal del servicio de direcciones. Intenta de nuevo.';
  }
  return null;
};

/**
 * Autocomplete de Places con sessionToken, debounce y Place Details solo al elegir una sugerencia.
 * Token de sesión nuevo tras cada selección (tras cerrar el billing de esa sesión) y al editar el texto
 * después de haber elegido una dirección.
 */
export function usePlacesAutocomplete({
  debounceMs = DEFAULT_DEBOUNCE_MS,
  minChars = DEFAULT_MIN_CHARS,
  componentRestrictions = DEFAULT_COMPONENT_RESTRICTIONS,
  onPlaceResolved,
} = {}) {
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isScriptReady, setIsScriptReady] = useState(false);

  const mapsRef = useRef(null);
  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const debounceRef = useRef(null);
  /** Valor del input justo después de elegir un lugar en Places (para detectar edición y nueva sesión). */
  const committedSnapshotRef = useRef(null);
  const onPlaceResolvedRef = useRef(onPlaceResolved);

  useEffect(() => {
    onPlaceResolvedRef.current = onPlaceResolved;
  }, [onPlaceResolved]);

  const ensureMapsAndSession = useCallback(async () => {
    const maps = await loadGoogleMapsPlacesLibrary();
    mapsRef.current = maps;

    if (!autocompleteServiceRef.current) {
      autocompleteServiceRef.current = new maps.places.AutocompleteService();
    }
    if (!placesServiceRef.current) {
      placesServiceRef.current = new maps.places.PlacesService(document.createElement('div'));
    }
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new maps.places.AutocompleteSessionToken();
    }
    setIsScriptReady(true);
    return maps;
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMapsPlacesLibrary()
      .then(() => {
        if (!cancelled) setIsScriptReady(true);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'No se pudo cargar Google Maps');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onMapsAuthFailure = () => {
      setError(
        'Google Maps rechazó la clave (p. ej. ApiNotActivatedMapError). Activa «Maps JavaScript API» en Google Cloud Console para este proyecto, con facturación habilitada, y permite este origen en la restricción de sitios web de la clave.'
      );
      setLoading(false);
      setLoadingDetails(false);
    };
    window.addEventListener('nexopay-google-maps-auth-failure', onMapsAuthFailure);
    return () => window.removeEventListener('nexopay-google-maps-auth-failure', onMapsAuthFailure);
  }, []);

  const rotateSessionToken = useCallback(() => {
    const maps = mapsRef.current;
    if (maps?.places?.AutocompleteSessionToken) {
      sessionTokenRef.current = new maps.places.AutocompleteSessionToken();
    }
  }, []);

  const clearPredictions = useCallback(() => {
    setPredictions([]);
    setIsOpen(false);
  }, []);

  const fetchPredictions = useCallback(
    async (query) => {
      const q = (query || '').trim();
      if (q.length < minChars) {
        clearPredictions();
        setLoading(false);
        return;
      }

      setError(null);
      setLoading(true);

      try {
        const maps = await ensureMapsAndSession();
        const service = autocompleteServiceRef.current;
        const token = sessionTokenRef.current;

        await new Promise((resolve, reject) => {
          let outcome = 'pending';

          const done = () => {
            if (outcome !== 'pending') return;
            outcome = 'resolved';
            clearTimeout(timeoutId);
            resolve(undefined);
          };

          const timeoutId = setTimeout(() => {
            if (outcome !== 'pending') return;
            outcome = 'timeout';
            reject(new Error('TIMEOUT_PREDICTIONS'));
          }, PREDICTIONS_TIMEOUT_MS);

          try {
            service.getPlacePredictions(
              {
                input: q,
                sessionToken: token,
                componentRestrictions,
              },
              (results, status) => {
                if (outcome === 'timeout') return;
                try {
                  const statusStr = String(status ?? '');
                  const OK = maps.places.PlacesServiceStatus?.OK ?? 'OK';
                  const ZERO =
                    maps.places.PlacesServiceStatus?.ZERO_RESULTS ?? 'ZERO_RESULTS';

                  if (statusStr === OK && results?.length) {
                    setPredictions(results);
                    setIsOpen(true);
                    setError(null);
                  } else if (statusStr === ZERO) {
                    setPredictions([]);
                    setIsOpen(true);
                    setError(null);
                  } else {
                    setPredictions([]);
                    setIsOpen(false);
                    const specific = mapPredictionStatusToMessage(statusStr);
                    setError(
                      specific ??
                        'No se pudieron obtener sugerencias. Intenta de nuevo.'
                    );
                  }
                } finally {
                  done();
                }
              }
            );
          } catch (callErr) {
            clearTimeout(timeoutId);
            if (outcome === 'pending') {
              outcome = 'error';
              reject(callErr);
            }
          }
        });
      } catch (e) {
        const msg = e?.message;
        if (msg === 'TIMEOUT_PREDICTIONS') {
          setError(
            'La búsqueda no respondió a tiempo. Revisa tu conexión, la clave de Google Maps (VITE_GOOGLE_MAP_KEY) y que Places API esté activa.'
          );
        } else {
          setError(e?.message || 'Error al buscar direcciones');
        }
        clearPredictions();
      } finally {
        setLoading(false);
      }
    },
    [clearPredictions, componentRestrictions, ensureMapsAndSession, minChars]
  );

  const scheduleFetch = useCallback(
    (query) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        fetchPredictions(query);
      }, debounceMs);
    },
    [debounceMs, fetchPredictions]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setInputValue(value);

      if (committedSnapshotRef.current !== null && value !== committedSnapshotRef.current) {
        committedSnapshotRef.current = null;
        rotateSessionToken();
      }

      if (value.trim().length < minChars) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        clearPredictions();
        setLoading(false);
        return;
      }

      scheduleFetch(value);
    },
    [clearPredictions, minChars, rotateSessionToken, scheduleFetch]
  );

  const handleSelectPrediction = useCallback(
    async (prediction) => {
      if (!prediction?.place_id) return;

      setLoadingDetails(true);
      setError(null);
      clearPredictions();

      try {
        const maps = await ensureMapsAndSession();
        const service = placesServiceRef.current;
        const token = sessionTokenRef.current;

        const place = await new Promise((resolve, reject) => {
          let outcome = 'pending';

          const finish = (fn) => {
            if (outcome !== 'pending') return;
            outcome = 'settled';
            clearTimeout(timeoutId);
            fn();
          };

          const timeoutId = setTimeout(() => {
            finish(() => reject(new Error('TIMEOUT_DETAILS')));
          }, DETAILS_TIMEOUT_MS);

          try {
            service.getDetails(
              {
                placeId: prediction.place_id,
                fields: ['address_components', 'formatted_address', 'place_id'],
                sessionToken: token,
              },
              (result, status) => {
                if (outcome === 'settled') return;
                const OK = maps.places.PlacesServiceStatus?.OK ?? 'OK';
                const statusStr = String(status ?? '');
                if (statusStr === OK && result) {
                  finish(() => resolve(result));
                } else {
                  finish(() =>
                    reject(new Error('No se pudo obtener el detalle del lugar'))
                  );
                }
              }
            );
          } catch (err) {
            clearTimeout(timeoutId);
            if (outcome === 'pending') {
              outcome = 'settled';
              reject(err);
            }
          }
        });

        const fields = mapGooglePlaceToNexoPersonalAddress(place);
        const display = place.formatted_address || prediction.description || '';
        setInputValue(display);
        committedSnapshotRef.current = display;

        rotateSessionToken();

        if (onPlaceResolvedRef.current) {
          onPlaceResolvedRef.current(fields);
        }
      } catch (e) {
        rotateSessionToken();
        const msg = e?.message;
        if (msg === 'TIMEOUT_DETAILS') {
          setError(
            'No se pudo cargar el detalle de la dirección. Intenta elegir la sugerencia de nuevo o revisa tu conexión.'
          );
        } else {
          setError(msg || 'No se pudo completar la dirección');
        }
      } finally {
        setLoadingDetails(false);
      }
    },
    [clearPredictions, ensureMapsAndSession, rotateSessionToken]
  );

  const resetSearchInput = useCallback(() => {
    setInputValue('');
    committedSnapshotRef.current = null;
    clearPredictions();
    rotateSessionToken();
  }, [clearPredictions, rotateSessionToken]);

  return {
    inputValue,
    setInputValue,
    predictions,
    loading: loading || loadingDetails,
    loadingPredictions: loading,
    loadingDetails,
    error,
    isOpen,
    isScriptReady,
    handleInputChange,
    handleSelectPrediction,
    clearPredictions,
    resetSearchInput,
  };
}
