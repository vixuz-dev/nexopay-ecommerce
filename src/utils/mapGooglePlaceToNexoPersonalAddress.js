import { ESTADOS_MEXICO, CIUDADES_MEXICO } from '../constants/app';

/**
 * Normaliza texto para comparar nombres de estado/ciudad con listas de NexoPay.
 * @param {string} str
 * @returns {string}
 */
export function normalizeForAddressMatch(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * @param {string} googleStateLongName
 * @returns {string} Valor exacto de ESTADOS_MEXICO o cadena vacía
 */
export function matchEstadoFromGoogle(googleStateLongName) {
  if (!googleStateLongName) return '';
  const n = normalizeForAddressMatch(googleStateLongName);

  const exact = ESTADOS_MEXICO.find((e) => normalizeForAddressMatch(e) === n);
  if (exact) return exact;

  if (n.includes('estado') && n.includes('mexico') && !n.includes('ciudad')) {
    return 'Estado de México';
  }

  const partial = ESTADOS_MEXICO.find(
    (e) => {
      const ne = normalizeForAddressMatch(e);
      return n.includes(ne) || ne.includes(n);
    }
  );
  return partial || '';
}

/**
 * @param {string} locality
 * @param {string} estadoMatched
 * @returns {string} Valor exacto de CIUDADES_MEXICO o cadena vacía (el usuario elige en el listado)
 */
export function matchCiudadFromGoogle(locality, estadoMatched) {
  if (!locality) return '';
  if (estadoMatched === 'Ciudad de México') {
    return CIUDADES_MEXICO.includes('Ciudad de México') ? 'Ciudad de México' : '';
  }

  const n = normalizeForAddressMatch(locality);
  const exact = CIUDADES_MEXICO.find((c) => normalizeForAddressMatch(c) === n);
  if (exact) return exact;

  const partial = CIUDADES_MEXICO.find((c) => {
    const nc = normalizeForAddressMatch(c);
    return n.includes(nc) || nc.includes(n);
  });
  return partial || '';
}

/**
 * Convierte el resultado de Place Details al shape del formulario de dirección personal NexoPay.
 * Solo devuelve campos que el formulario ya usa hoy (sin placeId ni coordenadas en el state).
 *
 * @param {Object} place — respuesta de PlacesService.getDetails
 * @returns {{
 *   calle: string,
 *   numeroExterior: string,
 *   numeroInterior: string,
 *   colonia: string,
 *   ciudad: string,
 *   estado: string,
 *   codigoPostal: string
 * }}
 */
export function mapGooglePlaceToNexoPersonalAddress(place) {
  const components = place?.address_components || [];

  const get = (type) => {
    const comp = components.find((c) => Array.isArray(c.types) && c.types.includes(type));
    return comp?.long_name || '';
  };

  const route = get('route');
  const streetNumber = get('street_number');
  const subpremise = get('subpremise');

  const colonia =
    get('neighborhood') ||
    get('sublocality') ||
    get('sublocality_level_1') ||
    get('administrative_area_level_3') ||
    '';

  let locality = get('locality');
  if (!locality) {
    locality = get('administrative_area_level_2') || '';
  }

  const admin1 = get('administrative_area_level_1');
  const postalCode = (get('postal_code') || '').replace(/\D/g, '').slice(0, 5);

  const estado = matchEstadoFromGoogle(admin1);
  const ciudad = matchCiudadFromGoogle(locality, estado);

  const rawNumeroExterior = (streetNumber || '').trim();
  const isSinNumeroPlaceholder =
    !rawNumeroExterior ||
    /^s\/?n\.?$/i.test(rawNumeroExterior) ||
    /^sn$/i.test(rawNumeroExterior) ||
    /^sin\s*n[uú]mero$/i.test(rawNumeroExterior);

  return {
    calle: (route || '').trim() || (place?.formatted_address ? place.formatted_address.split(',')[0]?.trim() || '' : ''),
    numeroExterior: isSinNumeroPlaceholder ? '' : rawNumeroExterior,
    numeroInterior: (subpremise || '').trim(),
    colonia: (colonia || '').trim(),
    ciudad,
    estado,
    codigoPostal: postalCode,
  };
}
