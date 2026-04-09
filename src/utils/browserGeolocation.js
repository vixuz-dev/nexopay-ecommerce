const DEFAULT_TIMEOUT_MS = 12000;

/**
 * Obtiene la posición actual del navegador (requiere permiso del usuario).
 * @param {{ timeout?: number, enableHighAccuracy?: boolean }} [options]
 * @returns {Promise<{ lat: number, lng: number }>}
 */
export function getBrowserGeolocationPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocalización no disponible en este navegador'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        reject(err);
      },
      {
        enableHighAccuracy: options.enableHighAccuracy ?? false,
        maximumAge: 60_000,
        timeout: options.timeout ?? DEFAULT_TIMEOUT_MS,
      }
    );
  });
}
