/**
 * Carga única del script de Google Maps JS API con la librería `places`.
 * Usa la misma clave que el resto de NexoPay (VITE_GOOGLE_MAP_KEY o respaldo VITE_GOOGLE_MAPS_API_KEY).
 */

const SCRIPT_ID = 'nexopay-google-maps-places';

function installGoogleMapsAuthFailureBridge() {
  if (typeof window === 'undefined' || window.__nexopayMapsAuthBridge) return;
  window.__nexopayMapsAuthBridge = true;
  const prev = window.gm_authFailure;
  window.gm_authFailure = function googleMapsAuthFailure() {
    if (typeof prev === 'function') prev();
    window.dispatchEvent(new CustomEvent('nexopay-google-maps-auth-failure'));
  };
}

export function getGoogleMapsBrowserKey() {
  return import.meta.env.VITE_GOOGLE_MAP_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
}

let loadPromise = null;

/**
 * @returns {Promise<typeof google.maps>}
 */
export function loadGoogleMapsPlacesLibrary() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Maps solo está disponible en el navegador'));
  }

  if (window.google?.maps?.places) {
    return Promise.resolve(window.google.maps);
  }

  const key = getGoogleMapsBrowserKey();
  if (!key) {
    return Promise.reject(new Error('Falta la variable de entorno VITE_GOOGLE_MAP_KEY'));
  }

  installGoogleMapsAuthFailureBridge();

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      const done = () => {
        if (window.google?.maps?.places) {
          resolve(window.google.maps);
        } else {
          reject(new Error('La librería de Places no está disponible'));
        }
      };
      if (window.google?.maps?.places) {
        done();
        return;
      }
      existing.addEventListener('load', done);
      existing.addEventListener('error', () => reject(new Error('Error al cargar Google Maps')));
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places&language=es&region=MX`;
    script.onload = () => {
      if (window.google?.maps?.places) {
        resolve(window.google.maps);
      } else {
        reject(new Error('La librería de Places no está disponible'));
      }
    };
    script.onerror = () => reject(new Error('No se pudo cargar el script de Google Maps'));
    document.head.appendChild(script);
  });

  return loadPromise;
}
