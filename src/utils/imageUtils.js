/**
 * Utility functions for image processing
 */

/**
 * Convert file to base64 string without data URI prefix
 * @param {File} file - Image file
 * @returns {Promise<string>} - Base64 string without prefix
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      // Remove data URI prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Validate image format from base64 string
 * Only allows PNG, JPG, JPEG, and WEBP formats
 * @param {string} base64String - Base64 encoded image (without data URI prefix)
 * @returns {{ valid: boolean, format: string|null, error: string|null }} - Validation result
 */
export const validateImageFormat = (base64String) => {
  if (!base64String || typeof base64String !== 'string' || base64String.trim() === '') {
    return {
      valid: false,
      format: null,
      error: 'La imagen debe ser un string base64 válido'
    };
  }

  // Base64 signatures for supported formats
  const formatSignatures = {
    'PNG': 'iVBORw0KGgo',
    'JPEG': '/9j/',
    'JPG': '/9j/',
    'WEBP': 'UklGR'
  };

  // Check format by base64 signature
  if (base64String.startsWith('iVBORw0KGgo')) {
    return { valid: true, format: 'PNG', error: null };
  }
  
  if (base64String.startsWith('/9j/')) {
    return { valid: true, format: 'JPEG', error: null };
  }
  
  if (base64String.startsWith('UklGR')) {
    return { valid: true, format: 'WEBP', error: null };
  }

  return {
    valid: false,
    format: null,
    error: 'Formato de imagen no soportado. Solo se permiten PNG, JPG, JPEG y WEBP'
  };
};
