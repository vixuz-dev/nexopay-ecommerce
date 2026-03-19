import { ENDPOINTS } from '../endpoints';
import { validateImageFormat } from '../../utils/imageUtils';

const KYC_TYPE_IMAGE_FILE = {
  PASSPORT: 'passport',
  INE_FRONT: 'ine_front',
  INE_BACK: 'ine_back',
};

const KYC_ERROR_MESSAGES = {
  DOCUMENT_MISMATCH: 'La imagen proporcionada no corresponde al documento solicitado.',
  IDENTITY_MISMATCH: 'Los datos del documento no coinciden con el usuario esperado.',
  DOCUMENT_ILLEGIBLE: 'Documento correcto pero datos ilegibles o incompletos.',
};

function normalizeKycResponse(data) {
  if (!data) return data;
  if (data.documentType === 'passport' && (data.names || data.last_name)) {
    return {
      ...data,
      firstName: data.firstName ?? data.names ?? '',
      lastName: data.lastName ?? data.last_name ?? '',
    };
  }
  return data;
}

/**
 * Service for KYC (Know Your Customer) API calls
 * Services only handle API communication, no business logic or validation
 *
 * Input: { base64ImageFile, typeImageFile, fullName?, address? } → payload includes userContext: { fullName, address }
 * typeImageFile: 'passport' | 'ine_front' | 'ine_back'
 */
class KYCService {
  /**
   * Evaluate document using KYC service
   * @param {string} base64ImageFile - Base64 encoded image (without data URI prefix)
   * @param {string} typeImageFile - Type of document: 'passport' | 'ine_front' | 'ine_back'
   * @param {Object} [options] - Optional context
   * @param {string} [options.fullName] - "ApellidoP ApellidoM Nombres"
   * @param {Object} [options.address] - { city, state, neighborhood, street, internalNumber, externalNumber, zipCode }
   * @param {number} [options.timeoutMs] - Timeout in milliseconds (default: 120000 = 2 minutes)
   * @returns {Promise<object>} - Extracted document data
   */
  async evaluateDocument(base64ImageFile, typeImageFile, options = {}) {
    const { fullName, address, timeoutMs = 120000 } = typeof options === 'object' ? options : {};

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
      const payload = {
        base64ImageFile,
        typeImageFile: typeImageFile || KYC_TYPE_IMAGE_FILE.INE_FRONT,
        userContext: {
          fullName: fullName ? String(fullName).trim() : '',
          address: address && typeof address === 'object'
            ? {
                city: address.city ?? '',
                state: address.state ?? '',
                neighborhood: address.neighborhood ?? '',
                street: address.street ?? '',
                internalNumber: address.internalNumber ?? '',
                externalNumber: address.externalNumber ?? '',
                zipCode: address.zipCode ?? '',
              }
            : {
                city: '',
                state: '',
                neighborhood: '',
                street: '',
                internalNumber: '',
                externalNumber: '',
                zipCode: '',
              },
        },
      };

      const response = await fetch(ENDPOINTS.KYC.EVALUATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        responseData = { message: `Error ${response.status}: ${response.statusText}` };
      }

      if (!response.ok) {
        const errorCode = responseData.error;
        const serverMessage = responseData.message || responseData.statusMessage;
        let userMessage = serverMessage || 'Error al procesar el documento';

        if (response.status === 422 && errorCode && KYC_ERROR_MESSAGES[errorCode]) {
          userMessage = KYC_ERROR_MESSAGES[errorCode];
        } else if (response.status === 500) {
          userMessage = 'Error interno del servidor. Por favor, intenta más tarde.';
        }

        const error = new Error(userMessage);
        error.status = response.status;
        error.statusCode = response.status;
        error.errorCode = errorCode;
        error.statusMessage = serverMessage;
        error.details = responseData.error || responseData.details;
        throw error;
      }

      const body = responseData.body ?? responseData.data ?? responseData;
      return normalizeKycResponse(body);
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

