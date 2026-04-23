import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlinePhone, HiOutlineArrowLeft } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/routes';
import { otpService } from '../api/services/otpService';
import { authService } from '../api/services/authService';
import { OTP_TYPE_VERIFICATION } from '../constants/app';
import { hashPassword } from '../utils/passwordUtils';
import useToastStore from '../stores/toastStore';
import useRegisterDraftStore from '../stores/registerDraftStore';

const ValidateOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useToastStore((state) => state.showToast);
  const [hasHydratedDraft, setHasHydratedDraft] = useState(() =>
    useRegisterDraftStore.persist.hasHydrated()
  );

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(40);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [errors, setErrors] = useState({});

  const pendingOtpStep = useRegisterDraftStore((s) => s.pendingOtpStep);
  const storePhone = useRegisterDraftStore((s) => s.phoneNumber);
  const storeRegistrationData = useRegisterDraftStore((s) => s.registrationData);

  const { registrationData, phoneNumber } = useMemo(() => {
    const fromState = location.state || {};
    const phone =
      fromState.phoneNumber || (pendingOtpStep ? storePhone : '') || '';
    const reg =
      fromState.registrationData ?? (pendingOtpStep ? storeRegistrationData : null);
    return { phoneNumber: phone, registrationData: reg };
  }, [location.state, pendingOtpStep, storePhone, storeRegistrationData]);

  useEffect(() => {
    if (hasHydratedDraft) return undefined;
    const unsub = useRegisterDraftStore.persist.onFinishHydration(() => {
      setHasHydratedDraft(true);
    });
    return unsub;
  }, [hasHydratedDraft]);

  useEffect(() => {
    if (!hasHydratedDraft) return undefined;
    if (!registrationData || !phoneNumber) {
      showToast('Acceso no autorizado. Debes venir desde el registro.', 'error', 4000);
      const t = setTimeout(() => {
        navigate(ROUTES.REGISTER);
      }, 2000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [hasHydratedDraft, registrationData, phoneNumber, navigate, showToast]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    if (errors.otp) {
      setErrors({ ...errors, otp: '' });
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);

    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    const nextInput = document.getElementById(`otp-${lastFilledIndex + 1}`);
    if (nextInput) nextInput.focus();
  };

  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;

    setIsLoading(true);
    setErrors({});

    try {
      await otpService.insertOtp(phoneNumber, OTP_TYPE_VERIFICATION.PHONE_NUMBER);
      showToast('Código OTP reenviado exitosamente', 'success', 3000);
      setCountdown(40);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } catch (error) {
      console.error('Error al reenviar OTP:', error);
      if (error.statusCode === 400) {
        setErrors({ general: 'Error al reenviar el código. Verifica el número de teléfono.' });
      } else if (error.statusCode === 200 && error.success === false) {
        const msg = error.statusMessage || '';
        if (msg.includes('SMS no enviado')) {
          setErrors({ general: 'No se pudo enviar el código. Intenta más tarde.' });
        } else {
          setErrors({ general: msg || 'No se pudo reenviar el código. Intenta más tarde.' });
        }
      } else {
        setErrors({ general: error.message || 'Error al reenviar el código. Intenta nuevamente.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setErrors({ otp: 'El código OTP debe tener 6 dígitos' });
      return;
    }

    if (!registrationData || !phoneNumber) {
      showToast('Datos de registro no encontrados', 'error', 3000);
      navigate(ROUTES.REGISTER);
      return;
    }

    setIsValidating(true);
    setErrors({});

    try {
      await otpService.validateOtp(phoneNumber, otpString, OTP_TYPE_VERIFICATION.PHONE_NUMBER);

      const trimmedPassword = registrationData.password.trim();
      const hashedPassword = hashPassword(trimmedPassword);

      const registerResponse = await authService.registerClient(
        phoneNumber,
        hashedPassword,
        registrationData.name.trim(),
        registrationData.paternalLastname.trim(),
        registrationData.maternalLastname.trim()
      );

      showToast(
        registerResponse.statusMessage || 'Cliente registrado correctamente',
        'success',
        4000
      );

      useRegisterDraftStore.getState().clearRegistrationDraft();

      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 1500);

    } catch (error) {
      console.error('Error en la validación:', error);
      
      if (error.statusCode === 200) {
        if (error.statusMessage === 'OTP inválido' || error.statusMessage === 'OTP incorrecto') {
          setErrors({ otp: 'El código OTP ingresado es incorrecto. Verifica e intenta nuevamente.' });
          setOtp(['', '', '', '', '', '']);
          document.getElementById('otp-0')?.focus();
        } else if (error.statusMessage === 'OTP expirado') {
          setErrors({ otp: 'El código OTP ha expirado. Solicita uno nuevo.' });
          setOtp(['', '', '', '', '', '']);
          setCountdown(0);
          setCanResend(true);
        } else {
          setErrors({ otp: error.message || 'El código OTP ingresado es incorrecto' });
          setOtp(['', '', '', '', '', '']);
          document.getElementById('otp-0')?.focus();
        }
      } else if (error.statusCode === 400) {
        if (error.errors && Array.isArray(error.errors)) {
          const otpError = error.errors.find(err => err.includes('otp'));
          if (otpError) {
            setErrors({ otp: 'El código OTP debe tener 6 dígitos' });
          } else {
            setErrors({ general: error.message || 'Error en la validación' });
          }
        } else {
          setErrors({ general: error.message || 'Error en la validación' });
        }
      } else if (error.statusCode === 500) {
        setErrors({ general: error.message || 'Error del servidor. Intenta más tarde.' });
      } else {
        setErrors({ general: error.message || 'Error al validar el código OTP' });
      }
    } finally {
      setIsValidating(false);
    }
  };

  if (!hasHydratedDraft || !registrationData || !phoneNumber) {
    return null;
  }

  return (
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
                <HiOutlinePhone className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verifica tu número
              </h1>
              <p className="text-gray-600">
                Hemos enviado un código de verificación de 6 dígitos al número
              </p>
              <p className="text-gray-900 font-semibold mt-2">
                {phoneNumber}
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
                  Ingresa el código de verificación
                </label>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.otp ? 'border-red-500' : 'border-gray-300'
                      }`}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                {errors.otp && (
                  <p className="mt-2 text-sm text-red-600 text-center">{errors.otp}</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isValidating || otp.join('').length !== 6}
                whileHover={{ scale: isValidating ? 1 : 1.02 }}
                whileTap={{ scale: isValidating ? 1 : 0.98 }}
                className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                {isValidating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Validando...
                  </>
                ) : (
                  'Verificar código'
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <div>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-primary-600 hover:text-primary-700 font-medium hover:underline disabled:opacity-50"
                  >
                    {isLoading ? 'Reenviando...' : 'Reenviar código'}
                  </button>
                ) : (
                  <p className="text-sm text-gray-600">
                    Reenviar código en{' '}
                    <span className="font-semibold text-primary-600">{countdown}s</span>
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Link
                  to={ROUTES.REGISTER}
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
                >
                  <HiOutlineArrowLeft className="w-4 h-4" />
                  Volver al registro
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ValidateOtp;

