/**
 * Parsea el cuerpo de un fetch como JSON. Si el cuerpo está vacío (p. ej. 204), devuelve {}.
 * Evita "Unexpected end of JSON input" cuando el servidor no envía body.
 * @param {Response} response
 * @returns {Promise<Record<string, unknown>>}
 */
export async function parseResponseJsonSafe(response) {
  const text = await response.text();
  const trimmed = text == null ? '' : String(text).trim();
  if (trimmed === '') {
    return {};
  }
  return JSON.parse(trimmed);
}
