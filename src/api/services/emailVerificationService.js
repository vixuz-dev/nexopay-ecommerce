import { ENDPOINTS } from '../endpoints';

/**
 * Service for email verification API calls (AWS)
 */
class EmailVerificationService {
  async addEmailVerification(clientId) {
    const response = await fetch(ENDPOINTS.EMAIL_VERIFICATION.ADD_EMAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: Number(clientId),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(
        data.status_Message || data.statusMessage || data.message || 'Error al enviar el código de verificación'
      );
      error.statusCode = response.status;
      error.statusMessage = data.status_Message || data.statusMessage;
      throw error;
    }

    if (data.status === false) {
      const error = new Error(
        data.status_Message || data.statusMessage || 'Error al enviar el código de verificación'
      );
      error.statusCode = 200;
      error.statusMessage = data.status_Message || data.statusMessage;
      throw error;
    }

    return data;
  }

  async validateEmailOtp(clientId, otpCode) {
    const response = await fetch(ENDPOINTS.EMAIL_VERIFICATION.VALIDATE_OTP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: Number(clientId),
        otp_code: Number(otpCode),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(
        data.status_Message || data.statusMessage || data.message || 'Error al validar el código'
      );
      error.statusCode = response.status;
      error.statusMessage = data.status_Message || data.statusMessage;
      throw error;
    }

    if (data.status === false || data.valid === false) {
      const error = new Error(
        data.status_Message || data.statusMessage || 'Código inválido o expirado'
      );
      error.statusCode = 200;
      error.statusMessage = data.status_Message || data.statusMessage;
      error.valid = data.valid;
      throw error;
    }

    return data;
  }
}

export const emailVerificationService = new EmailVerificationService();
