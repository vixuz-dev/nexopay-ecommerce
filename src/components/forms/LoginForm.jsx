import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlinePhone, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { authService } from '../../api/services/authService';
import { formatPhoneNumber } from '../../utils/format';
import { hashPassword } from '../../utils/passwordUtils';
import { setCookie } from '../../utils/cookieUtils';
import useUserStore from '../../stores/userStore';
import useProfileStore from '../../stores/profileStore';
import { ROUTES } from '../../utils/routes';

const LoginForm = ({ onLoginSuccess, onBack }) => {
  const setUser = useUserStore((state) => state.setUser);
  const [formData, setFormData] = useState({
    telefono: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.telefono) {
      newErrors.telefono = 'El número de teléfono es requerido';
    } else if (formData.telefono.length !== 10) {
      newErrors.telefono = 'El teléfono debe tener exactamente 10 dígitos';
    } else if (!/^[0-9]{10}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono solo debe contener números';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const phoneNumber = formData.telefono.trim();
      const password = formData.password.trim();
      const hashedPassword = hashPassword(password);
      
      const response = await authService.loginClient(phoneNumber, hashedPassword);
      
      if (response.body) {
        const { token, ...userData } = response.body;
        
        if (token) {
          setCookie('authToken', token, { expires: undefined });
        }
        
        setUser(userData);
        useProfileStore.getState().setClientFromLogin(userData);
        onLoginSuccess(response.body);
      }

    } catch (error) {
      console.error('Error en el login:', error);
      
      if (error.statusCode === 400) {
        const errorMessages = error.errors || [];
        if (errorMessages.length > 0) {
          setErrors({ general: errorMessages.join(', ') });
        } else {
          setErrors({ general: error.message || 'Ocurrió un error. Verifica los datos ingresados.' });
        }
      } else if (error.statusCode === 500) {
        setErrors({ general: error.message || 'Error del servidor. Por favor, intenta más tarde.' });
      } else if (error.statusCode === 200 && error.success === false) {
        setErrors({ general: error.message || 'Credenciales incorrectas. Verifica tu teléfono y contraseña.' });
      } else {
        setErrors({ general: error.message || 'Error al iniciar sesión. Por favor, intenta nuevamente.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8">

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error general */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Teléfono */}
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
              Número de teléfono
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlinePhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  setFormData({ ...formData, telefono: formatted });
                }}
                className={`input-field pl-10 ${errors.telefono ? 'border-red-500' : ''}`}
                placeholder="5512345678"
                maxLength="10"
              />
            </div>
            {errors.telefono && (
              <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Mínimo 8 caracteres"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <HiOutlineEyeSlash className="h-5 w-5 text-gray-400" />
                ) : (
                  <HiOutlineEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Botón principal */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </motion.button>
        </form>

        {/* Microcopy */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Al iniciar sesión, aceptas nuestros{' '}
            <Link to={ROUTES.TERMS} className="text-primary-600 hover:underline">
              Términos y Condiciones
            </Link>{' '}
            y{' '}
            <Link to={ROUTES.PRIVACY} className="text-primary-600 hover:underline">
              Aviso de Privacidad
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export { LoginForm };
