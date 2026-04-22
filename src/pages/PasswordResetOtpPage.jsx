import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlinePhone, HiOutlineArrowLeft } from 'react-icons/hi2';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/routes';
import { OTP_TYPE_VERIFICATION } from '../constants/app';
import { otpService } from '../api/services/otpService';
import usePasswordResetStore from '../stores/passwordResetStore';

const COUNTDOWN_SECONDS = 20;

/**
 * Paso 2: validar OTP enviado para recuperación de contraseña.
 */
const PasswordResetOtpPage = () => {
  const navigate = useNavigate();
  const phoneNumber = usePasswordResetStore((s) => s.phoneNumber);
  const flowCommitted = usePasswordResetStore((s) => s.flowCommitted);
  const setOtpValidatedWithToken = usePasswordResetStore((s) => s.setOtpValidatedWithToken);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (countdown > 0) {
      const t = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => window.clearTimeout(t);
    }
    setCanResend(true);
    return undefined;
  }, [countdown]);

  if (!flowCommitted || !phoneNumber) {
    return <Navigate to={ROUTES.PASSWORD_RESET} replace />;
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) {
      document.getElementById(`reset-otp-${index + 1}`)?.focus();
    }
    if (errors.otp) setErrors({ ...errors, otp: '' });
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`reset-otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;
    const next = pasted.split('').concat(Array(6 - pasted.length).fill(''));
    setOtp(next);
    const last = Math.min(pasted.length - 1, 5);
    document.getElementById(`reset-otp-${last + 1}`)?.focus();
  };

  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    setIsLoading(true);
    setErrors({});
    try {
      await otpService.insertOtp(phoneNumber, OTP_TYPE_VERIFICATION.RESET_PASSWORD);
      setCountdown(COUNTDOWN_SECONDS);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      document.getElementById('reset-otp-0')?.focus();
    } catch (error) {
      console.error('Error al reenviar OTP:', error);
      if (error.statusCode === 400) {
        setErrors({ general: 'No se pudo reenviar el código. Verifica el número.' });
      } else if (error.statusCode === 200 && error.success === false) {
        setErrors({
          general: error.statusMessage || 'No se pudo reenviar el código. Intenta más tarde.',
        });
      } else {
        setErrors({ general: error.message || 'Error al reenviar el código.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setErrors({ otp: 'El código debe tener 6 dígitos' });
      return;
    }

    setIsValidating(true);
    setErrors({});

    try {
      const data = await otpService.validateOtp(phoneNumber, otpString, OTP_TYPE_VERIFICATION.RESET_PASSWORD);
      const token = data?.tokenResetPassword;
      if (!token || typeof token !== 'string') {
        setErrors({
          general:
            'No se pudo continuar la recuperación. Solicita un nuevo código e inténtalo de nuevo.',
        });
        return;
      }
      setOtpValidatedWithToken(token);
      navigate(ROUTES.PASSWORD_RESET_NEW, { replace: true });
    } catch (error) {
      console.error('Error al validar OTP:', error);
      if (error.statusCode === 200) {
        const msg = error.statusMessage || '';
        if (msg.includes('inválido') || msg.includes('incorrecto')) {
          setErrors({ otp: 'El código es incorrecto. Revisa el SMS e intenta de nuevo.' });
          setOtp(['', '', '', '', '', '']);
          document.getElementById('reset-otp-0')?.focus();
        } else if (msg.includes('expirado')) {
          setErrors({ otp: 'El código expiró. Solicita uno nuevo con el botón de abajo.' });
          setCountdown(0);
          setCanResend(true);
        } else {
          setErrors({ otp: error.message || 'No se pudo validar el código.' });
        }
      } else if (error.statusCode === 400) {
        setErrors({ general: error.message || 'Datos inválidos.' });
      } else if (error.statusCode === 500) {
        setErrors({ general: error.message || 'Error del servidor.' });
      } else {
        setErrors({ general: 'No se pudo validar el código.' });
      }
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1">Paso 2 de 3</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Código de verificación</h1>
        <p className="text-gray-600 text-sm mb-2">
          Escribe el código de 6 dígitos que enviamos por SMS a:
        </p>
        <p className="flex items-center gap-2 text-gray-900 font-semibold mb-4">
          <HiOutlinePhone className="w-5 h-5 text-primary-600 shrink-0" />
          {phoneNumber}
        </p>
        <p className="text-xs text-gray-500 mb-6">
          Si no lo recibes, puedes pedir otro código cuando termine la cuenta regresiva.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Código SMS
            </label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`reset-otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.otp ? 'border-red-500' : 'border-gray-300'
                  }`}
                  autoFocus={index === 0}
                  autoComplete="one-time-code"
                />
              ))}
            </div>
            {errors.otp && <p className="mt-2 text-sm text-red-600 text-center">{errors.otp}</p>}
          </div>

          <motion.button
            type="submit"
            disabled={isValidating || otp.join('').length !== 6}
            whileHover={{ scale: isValidating ? 1 : 1.02 }}
            whileTap={{ scale: isValidating ? 1 : 0.98 }}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg transition-all flex items-center justify-center gap-3"
          >
            {isValidating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Verificando…
              </>
            ) : (
              'Continuar'
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center space-y-4">
          {canResend ? (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading}
              className="text-primary-600 hover:text-primary-700 font-medium hover:underline disabled:opacity-50 text-sm"
            >
              {isLoading ? 'Reenviando…' : 'Reenviar código por SMS'}
            </button>
          ) : (
            <p className="text-sm text-gray-600">
              Podrás solicitar un nuevo código en{' '}
              <span className="font-semibold text-primary-600">{countdown}s</span>
            </p>
          )}

          <div className="pt-4 border-t border-gray-200">
            <Link
              to={ROUTES.PASSWORD_RESET}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              <HiOutlineArrowLeft className="w-4 h-4" />
              Cambiar número de teléfono
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PasswordResetOtpPage;
