import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlinePhone, HiOutlineArrowLeft } from 'react-icons/hi2';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/routes';
import { OTP_TYPE_VERIFICATION } from '../constants/app';
import { otpService } from '../api/services/otpService';
import { formatPhoneNumber } from '../utils/format';
import usePasswordResetStore from '../stores/passwordResetStore';

/**
 * Paso 1: capturar teléfono y solicitar OTP para recuperación de contraseña.
 */
const PasswordResetPhonePage = () => {
  const navigate = useNavigate();
  const phoneNumber = usePasswordResetStore((s) => s.phoneNumber);
  const flowCommitted = usePasswordResetStore((s) => s.flowCommitted);
  const setPhoneAndCommitFlow = usePasswordResetStore((s) => s.setPhoneAndCommitFlow);

  const [telefono, setTelefono] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (phoneNumber && flowCommitted) {
      setTelefono(phoneNumber);
    }
  }, [phoneNumber, flowCommitted]);

  const validateForm = () => {
    const newErrors = {};
    if (!telefono) {
      newErrors.telefono = 'El número de teléfono es requerido';
    } else if (telefono.length !== 10) {
      newErrors.telefono = 'El teléfono debe tener exactamente 10 dígitos';
    } else if (!/^[0-9]{10}$/.test(telefono)) {
      newErrors.telefono = 'El teléfono solo debe contener números';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const trimmed = telefono.trim();
      await otpService.insertOtp(trimmed, OTP_TYPE_VERIFICATION.RESET_PASSWORD);
      setPhoneAndCommitFlow(trimmed);
      navigate(ROUTES.PASSWORD_RESET_OTP);
    } catch (error) {
      console.error('Error al solicitar OTP de recuperación:', error);

      if (error.statusCode === 400) {
        if (error.errors && Array.isArray(error.errors)) {
          const fieldErrors = {};
          error.errors.forEach((err) => {
            if (err.includes('personalPhonenumber') || err.includes('personal_phonenumber')) {
              fieldErrors.telefono = 'El número de teléfono es inválido';
            }
          });
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
          } else {
            setErrors({ general: error.message || 'Verifica los datos ingresados.' });
          }
        } else {
          setErrors({ general: error.message || 'Verifica los datos ingresados.' });
        }
      } else if (error.statusCode === 200 && error.success === false) {
        const msg = error.statusMessage || '';
        if (msg.includes('usuario no existe') || msg.includes('esta eliminado') || msg.includes('está eliminado')) {
          setErrors({
            general:
              'No encontramos una cuenta activa con este número. Verifica el teléfono o regístrate.',
          });
        } else if (msg.includes('SMS no enviado')) {
          setErrors({ general: 'No se pudo enviar el código por SMS. Intenta más tarde.' });
        } else {
          setErrors({ general: msg || 'No se pudo enviar el código. Intenta más tarde.' });
        }
      } else if (error.statusCode === 500) {
        setErrors({ general: error.message || 'Error del servidor. Intenta más tarde.' });
      } else {
        setErrors({ general: 'No se pudo enviar el código. Intenta de nuevo.' });
      }
    } finally {
      setIsLoading(false);
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
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1">Paso 1 de 3</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ingresa tu teléfono</h1>
        <p className="text-gray-600 text-sm mb-6">
          Te enviaremos un código por SMS para confirmar que eres titular de la cuenta. Solo números a 10
          dígitos.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <div>
            <label htmlFor="reset-telefono" className="block text-sm font-medium text-gray-700 mb-2">
              Número de teléfono
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlinePhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="reset-telefono"
                name="telefono"
                value={telefono}
                onChange={(e) => {
                  setTelefono(formatPhoneNumber(e.target.value));
                  if (errors.telefono) setErrors({ ...errors, telefono: '' });
                }}
                className={`input-field pl-10 ${errors.telefono ? 'border-red-500' : ''}`}
                placeholder="5512345678"
                maxLength={10}
                autoComplete="tel"
              />
            </div>
            {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Enviando código…
              </>
            ) : (
              'Enviar código por SMS'
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PasswordResetPhonePage;
