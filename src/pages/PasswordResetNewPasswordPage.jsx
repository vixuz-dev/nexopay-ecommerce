import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { Navigate, useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/routes';
import { authService } from '../api/services/authService';
import { hashPassword } from '../utils/passwordUtils';
import usePasswordResetStore from '../stores/passwordResetStore';
import useToastStore from '../stores/toastStore';

/**
 * Paso 3: nueva contraseña tras OTP válido.
 */
const PasswordResetNewPasswordPage = () => {
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.showToast);
  const phoneNumber = usePasswordResetStore((s) => s.phoneNumber);
  const flowCommitted = usePasswordResetStore((s) => s.flowCommitted);
  const otpValidated = usePasswordResetStore((s) => s.otpValidated);
  const tokenResetPassword = usePasswordResetStore((s) => s.tokenResetPassword);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  if (!flowCommitted || !phoneNumber || !otpValidated || !tokenResetPassword) {
    return <Navigate to={ROUTES.PASSWORD_RESET} replace />;
  }

  const validateForm = () => {
    const next = {};
    if (!password) {
      next.password = 'La contraseña es requerida';
    } else if (password.length < 8) {
      next.password = 'Mínimo 8 caracteres';
    }
    if (!confirmPassword) {
      next.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      next.confirmPassword = 'Las contraseñas no coinciden';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const hashed = hashPassword(password.trim());
      const data = await authService.updateClientPassword(phoneNumber, hashed, tokenResetPassword);
      showToast(data.statusMessage || 'Contraseña actualizada. Ya puedes iniciar sesión.', 'success', 4500);
      navigate(ROUTES.LOGIN, { replace: true });
      // Limpiar el store después de navegar: si `reset()` va antes, el guard de esta página redirige a PASSWORD_RESET antes de llegar a login.
      queueMicrotask(() => {
        usePasswordResetStore.getState().reset();
      });
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      if (error.statusCode === 400) {
        if (error.errors?.length) {
          setErrors({ general: error.errors.join(', ') });
        } else {
          setErrors({ general: error.message || 'Revisa los datos.' });
        }
      } else if (error.statusCode === 200 && error.success === false) {
        setErrors({ general: error.message || 'No se pudo actualizar la contraseña.' });
      } else if (error.statusCode === 500) {
        setErrors({ general: error.message || 'Error del servidor. Intenta más tarde.' });
      } else {
        setErrors({ general: 'No se pudo actualizar la contraseña. Intenta de nuevo.' });
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
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1">Paso 3 de 3</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nueva contraseña</h1>
        <p className="text-gray-600 text-sm mb-6">
          Elige una contraseña segura que no uses en otros sitios. La usarás con tu número{' '}
          <span className="font-medium text-gray-900">{phoneNumber}</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <div>
            <label htmlFor="reset-new-password" className="block text-sm font-medium text-gray-700 mb-2">
              Nueva contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="reset-new-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <HiOutlineEyeSlash className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="reset-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="reset-confirm-password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                }}
                className={`input-field pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Repite la contraseña"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirm ? <HiOutlineEyeSlash className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg transition-all flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Guardando…
              </>
            ) : (
              'Guardar contraseña'
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default PasswordResetNewPasswordPage;
