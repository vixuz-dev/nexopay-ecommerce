import { ENDPOINTS } from '../endpoints';
import { OTP_TYPE_VERIFICATION } from '../../constants/app';

class OtpService {
  /**
   * Solicita generación y envío de OTP por SMS.
   * @param {string} personalPhonenumber - Teléfono a 10 dígitos (sin incluir 0000000000).
   * @param {'phone_number'|'reset_password'} [typeVerification] - Flujo de verificación (por defecto validación de número).
   */
  async insertOtp(personalPhonenumber, typeVerification = OTP_TYPE_VERIFICATION.PHONE_NUMBER) {
    const resolvedTypeVerification = typeVerification ?? OTP_TYPE_VERIFICATION.PHONE_NUMBER;

    const response = await fetch(ENDPOINTS.OTP.INSERT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalPhonenumber,
        typeVerification: resolvedTypeVerification,
      }),
    });

    const data = await response.json();

    if (response.status === 400) {
      const error = new Error(data.message || 'Ocurrió un error, no se encontraron todos los parámetros o tienen un formato inválido');
      error.statusCode = 400;
      error.errors = data.error || [];
      throw error;
    }

    if (response.status === 500) {
      const error = new Error(data.statusMessage || 'Ocurrió un error, intente más tarde');
      error.statusCode = 500;
      throw error;
    }

    if (response.status === 200 && data.success === false) {
      const error = new Error(data.statusMessage || 'La operación no pudo completarse');
      error.statusCode = 200;
      error.statusMessage = data.statusMessage;
      error.success = false;
      throw error;
    }

    if (response.status === 201 && data.statusMessage) {
      return data;
    }

    throw new Error('Unexpected response format');
  }

  /**
   * Valida el código OTP recibido por SMS.
   * @param {string} personalPhonenumber - Teléfono a 10 dígitos.
   * @param {string} otp - Código de 6 dígitos.
   * @param {'phone_number'|'reset_password'} [typeVerification] - Debe coincidir con el flujo usado en `insertOtp`.
   */
  async validateOtp(
    personalPhonenumber,
    otp,
    typeVerification = OTP_TYPE_VERIFICATION.PHONE_NUMBER
  ) {
    const resolvedTypeVerification = typeVerification ?? OTP_TYPE_VERIFICATION.PHONE_NUMBER;

    const response = await fetch(ENDPOINTS.OTP.VALIDATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalPhonenumber,
        otp,
        typeVerification: resolvedTypeVerification,
      }),
    });

    const data = await response.json();

    if (response.status === 400) {
      const error = new Error(data.message || 'Ocurrió un error, no se encontraron todos los parámetros o tienen un formato inválido');
      error.statusCode = 400;
      error.errors = data.error || [];
      throw error;
    }

    if (response.status === 500) {
      const error = new Error(data.statusMessage || 'Ocurrió un error, intente más tarde');
      error.statusCode = 500;
      throw error;
    }

    if (response.status === 200) {
      if (data.statusMessage === 'OTP válido') {
        return data;
      } else if (
        data.statusMessage === 'OTP inválido' ||
        data.statusMessage === 'OTP incorrecto' ||
        data.statusMessage === 'OTP expirado' ||
        (data.success === true && data.statusMessage && !data.statusMessage.includes('válido'))
      ) {
        const error = new Error(data.statusMessage || 'OTP inválido');
        error.statusCode = 200;
        error.statusMessage = data.statusMessage;
        error.success = data.success;
        throw error;
      }
    }

    throw new Error('Unexpected response format');
  }
}

export const otpService = new OtpService();

