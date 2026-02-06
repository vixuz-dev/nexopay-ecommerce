import { ENDPOINTS } from '../endpoints';
import { validateImageFormat } from '../../utils/imageUtils';

/**
 * Service for KYC (Know Your Customer) API calls
 * Services only handle API communication, no business logic or validation
 */

class KYCService {
  /**
   * Evaluate document using KYC service
   * @param {string} base64ImageFile - Base64 encoded image (without data URI prefix)
   * @param {number} timeoutMs - Timeout in milliseconds (default: 120000 = 2 minutes)
   * @returns {Promise<object>} - Extracted document data
   */
  async evaluateDocument(base64ImageFile, timeoutMs = 120000) {
    // Validate image format before processing
    const formatValidation = validateImageFormat(base64ImageFile);
    if (!formatValidation.valid) {
      const error = new Error(formatValidation.error || 'Formato de imagen no válido');
      error.status = 400;
      error.statusCode = 400;
      error.isFormatError = true;
      throw error;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(ENDPOINTS.KYC.EVALUATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base64ImageFile,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `Error ${response.status}: ${response.statusText}` };
        }

        const error = new Error(errorData.message || errorData.statusMessage || 'Error al procesar el documento');
        error.status = response.status;
        error.statusCode = response.status;
        error.statusMessage = errorData.statusMessage;
        error.details = errorData.error || errorData.details;
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        const timeoutError = new Error('El procesamiento del documento está tomando más tiempo del esperado. Por favor, intenta nuevamente.');
        timeoutError.status = 408;
        timeoutError.statusCode = 408;
        timeoutError.isTimeout = true;
        throw timeoutError;
      }

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const networkError = new Error('Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.');
        networkError.status = 0;
        networkError.statusCode = 0;
        networkError.isNetworkError = true;
        throw networkError;
      }

      throw error;
    }
  }
}

export const kycService = new KYCService();

