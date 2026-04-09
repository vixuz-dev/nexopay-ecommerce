/**
 * Geocodificación vía Nominatim (solo cliente). Respeta la política de uso: volumen bajo.
 * @param {string} query - Dirección en texto libre
 * @returns {Promise<{ lat: number, lng: number } | null>}
 */
export async function geocodeAddressQuery(query) {
  const trimmed = query?.trim();
  if (!trimmed) return null;

  const params = new URLSearchParams({
    format: 'json',
    q: trimmed,
    countrycodes: 'mx',
    limit: '1',
  });

  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'NexoPay-Ecommerce/1.0',
    },
  });

  if (!res.ok) return null;
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;

  const lat = parseFloat(data[0].lat);
  const lng = parseFloat(data[0].lon);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}
