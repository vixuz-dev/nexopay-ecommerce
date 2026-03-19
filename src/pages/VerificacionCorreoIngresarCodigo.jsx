import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineEnvelope, HiOutlineCheckCircle, HiOutlineArrowLeft } from 'react-icons/hi2';
import { ROUTES } from '../utils/routes';
import { emailVerificationService } from '../api/services/emailVerificationService';
import useUserStore from '../stores/userStore';
import useToastStore from '../stores/toastStore';
import ProtectedRoute from '../components/common/ProtectedRoute';

const RESEND_COOLDOWN = 40;

const VerificacionCorreoIngresarCodigo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserStore((state) => state.user);
  const setEmailVerified = useUserStore((state) => state.setEmailVerified);
  const showToast = useToastStore((state) => state.showToast);

  const email = location.state?.email || user?.email || 'roger.vazquez14@gmail.com';

  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate(ROUTES.EMAIL_VERIFICATION, { replace: true });
      return;
    }
  }, [email, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setCanResend(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showSuccessModal) {
      const t = setTimeout(() => {
        navigate(ROUTES.HOME, { replace: true });
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [showSuccessModal, navigate]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 3) {
      document.getElementById(`email-otp-${index + 1}`)?.focus();
    }
    if (errors.otp) setErrors((e) => ({ ...e, otp: '' }));
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`email-otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, 4);
    if (!/^\d+$/.test(pasted)) return;
    const newOtp = pasted.split('').concat(Array(4 - pasted.length).fill(''));
    setOtp(newOtp);
    const lastIdx = Math.min(pasted.length - 1, 3);
    document.getElementById(`email-otp-${lastIdx + 1}`)?.focus();
  };

  const handleResend = async () => {
    if (!canResend || isLoading || !user?.client_id) return;
    setIsLoading(true);
    setErrors({});
    try {
      await emailVerificationService.addEmailVerification(user.client_id, email);
      showToast('Código reenviado a tu correo', 'success', 3000);
      setCountdown(RESEND_COOLDOWN);
      setCanResend(false);
      setOtp(['', '', '', '']);
      document.getElementById('email-otp-0')?.focus();
    } catch (err) {
      setErrors({ general: err.message || 'Error al reenviar. Intenta más tarde.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      setErrors({ otp: 'Ingresa el código de 4 dígitos que recibiste' });
      return;
    }
    if (!email) {
      navigate(ROUTES.EMAIL_VERIFICATION, { replace: true });
      return;
    }

    setIsValidating(true);
    setErrors({});
    try {
      await emailVerificationService.validateEmailOtp(email, parseInt(otpString, 10));
      setEmailVerified(true);
      setShowSuccessModal(true);
    } catch (err) {
      setErrors({
        otp: err.statusMessage || err.message || 'Código inválido o expirado',
      });
      setOtp(['', '', '', '']);
      document.getElementById('email-otp-0')?.focus();
    } finally {
      setIsValidating(false);
    }
  };

  if (!email) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="w-full max-w-lg mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <HiOutlineEnvelope className="w-8 h-8 text-primary-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Ingresa el código
                </h1>
                <p className="text-gray-600 mb-2">
                  Enviamos un código de verificación a
                </p>
                <p className="font-semibold text-gray-900 mb-4">{email}</p>
                <p className="text-sm text-gray-500">
                  Revisa tu bandeja de entrada e ingresa el código que recibiste. Si no lo encuentras, revisa tu carpeta de spam.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{errors.general}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Código de verificación
                  </label>
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`email-otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={i === 0 ? handlePaste : undefined}
                        className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.otp ? 'border-red-500' : 'border-gray-300'
                        }`}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>
                  {errors.otp && (
                    <p className="mt-2 text-sm text-red-600 text-center">{errors.otp}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isValidating || otp.join('').length < 4}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  {isValidating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Verificando...
                    </>
                  ) : (
                    'Verificar'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center space-y-4">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isLoading}
                    className="text-primary-600 hover:text-primary-700 font-medium hover:underline disabled:opacity-50"
                  >
                    {isLoading ? 'Reenviando...' : 'Reenviar código'}
                  </button>
                ) : (
                  <p className="text-sm text-gray-600">
                    Podrás reenviar el código en{' '}
                    <span className="font-bold text-primary-600 tabular-nums">{countdown}s</span>
                  </p>
                )}
                <div className="pt-4 border-t border-gray-200">
                  <Link
                    to={ROUTES.HOME}
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    <HiOutlineArrowLeft className="w-4 h-4" />
                    Regresar al inicio
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <HiOutlineCheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">¡Correo verificado!</h2>
            <p className="text-gray-600 mb-6">
              Tu correo electrónico ha sido verificado correctamente. Serás redirigido en 5 segundos.
            </p>
            <p className="text-sm text-gray-500">Redirigiendo...</p>
          </motion.div>
        </div>
      )}
    </ProtectedRoute>
  );
};

export default VerificacionCorreoIngresarCodigo;
