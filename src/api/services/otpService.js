import { ENDPOINTS } from '../endpoints';

class OtpService {
  async insertOtp(personalPhonenumber) {
    const response = await fetch(ENDPOINTS.OTP.INSERT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalPhonenumber,
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

    if (response.status === 200 && data.statusMessage === 'SMS no enviado') {
      const error = new Error('SMS no enviado');
      error.statusCode = 200;
      error.statusMessage = data.statusMessage;
      throw error;
    }

    if (response.status === 201 && data.statusMessage) {
      return data;
    }

    throw new Error('Unexpected response format');
  }

  async validateOtp(personalPhonenumber, otp) {
    const response = await fetch(ENDPOINTS.OTP.VALIDATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalPhonenumber,
        otp,
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

