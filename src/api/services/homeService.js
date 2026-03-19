import { ENDPOINTS } from '../endpoints';
import { getInternalApiHeaders } from '../utils/apiHeaders';
import { handleAuthError } from '../../utils/authInterceptor';

/**
 * Fetches home page sections (new products, brands, featured)
 * @returns {Promise<{sections: Array}>}
 */
async function getHome() {
  const response = await fetch(ENDPOINTS.HOME.GET_HOME, {
    method: 'GET',
    headers: getInternalApiHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || data.statusMessage || 'Error al obtener el contenido del inicio');
    error.statusCode = response.status;
    error.status = response.status;
    error.statusMessage = data.statusMessage;

    handleAuthError(error, response);

    throw error;
  }

  const body = data.body ?? data;
  const sections = body.sections ?? [];

  return { sections: Array.isArray(sections) ? sections : [] };
}

export const homeService = { getHome };
