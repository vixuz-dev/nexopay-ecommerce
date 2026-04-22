import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlinePhone, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash, HiOutlineHome, HiOutlineUser } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';
import { OTP_TYPE_VERIFICATION, TERMS_AND_CONDITIONS_URL } from '../../constants/app';
import { otpService } from '../../api/services/otpService';
import { formatPhoneNumber } from '../../utils/format';
const RegisterForm = ({ onRegisterSuccess, onBack }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    telefono: '',
    password: '',
    name: '',
    paternalLastname: '',
    maternalLastname: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
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
    } else if (formData.password.trim().length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formData.name) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.paternalLastname) {
      newErrors.paternalLastname = 'El apellido paterno es requerido';
    } else if (formData.paternalLastname.trim().length < 3) {
      newErrors.paternalLastname = 'El apellido paterno debe tener al menos 3 caracteres';
    }

    if (!formData.maternalLastname) {
      newErrors.maternalLastname = 'El apellido materno es requerido';
    } else if (formData.maternalLastname.trim().length < 3) {
      newErrors.maternalLastname = 'El apellido materno debe tener al menos 3 caracteres';
    }

    if (!acceptedTerms) {
      newErrors.acceptedTerms = 'Debes aceptar los términos y condiciones para continuar';
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

      await otpService.insertOtp(phoneNumber, OTP_TYPE_VERIFICATION.PHONE_NUMBER);

      const registrationData = {
        password: formData.password,
        name: formData.name.trim(),
        paternalLastname: formData.paternalLastname.trim(),
        maternalLastname: formData.maternalLastname.trim(),
      };

      navigate(ROUTES.VALIDATE_OTP, {
        state: {
          phoneNumber,
          registrationData,
        },
      });

    } catch (error) {
      console.error('Error al enviar OTP:', error);

      if (error.statusCode === 400) {
        if (error.errors && Array.isArray(error.errors)) {
          const fieldErrors = {};
          error.errors.forEach(err => {
            if (err.includes('personalPhonenumber') || err.includes('personal_phonenumber')) {
              fieldErrors.telefono = 'El número de teléfono es inválido';
            }
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: error.message || 'Ocurrió un error, verifica los datos ingresados.' });
        }
      } else if (error.statusCode === 200 && error.success === false) {
        const msg = error.statusMessage || '';
        if (msg.includes('ya esta ligado a una cuenta') || msg.includes('ya está ligado a una cuenta')) {
          setErrors({ telefono: 'Este número ya está asociado a una cuenta.' });
        } else if (msg.includes('SMS no enviado')) {
          setErrors({ general: 'No se pudo enviar el código de verificación. Intenta más tarde.' });
        } else if (msg.includes('usuario no existe') || msg.includes('esta eliminado') || msg.includes('está eliminado')) {
          setErrors({ general: 'No se pudo completar la verificación. Verifica tus datos e intenta de nuevo.' });
        } else {
          setErrors({ general: msg || 'No se pudo enviar el código de verificación. Intenta más tarde.' });
        }
      } else if (error.statusCode === 500) {
        setErrors({ general: error.message || 'Se produjo un error con el servidor. Inténtalo más tarde.' });
      } else {
        setErrors({ general: 'Hubo un error al enviar el código de verificación. Inténtalo de nuevo.' });
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input-field pl-10 ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Tu nombre"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="paternalLastname" className="block text-sm font-medium text-gray-700 mb-2">
              Apellido Paterno
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="paternalLastname"
                name="paternalLastname"
                value={formData.paternalLastname}
                onChange={handleChange}
                className={`input-field pl-10 ${errors.paternalLastname ? 'border-red-500' : ''}`}
                placeholder="Tu apellido paterno"
              />
            </div>
            {errors.paternalLastname && (
              <p className="mt-1 text-sm text-red-600">{errors.paternalLastname}</p>
            )}
          </div>

          <div>
            <label htmlFor="maternalLastname" className="block text-sm font-medium text-gray-700 mb-2">
              Apellido Materno
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="maternalLastname"
                name="maternalLastname"
                value={formData.maternalLastname}
                onChange={handleChange}
                className={`input-field pl-10 ${errors.maternalLastname ? 'border-red-500' : ''}`}
                placeholder="Tu apellido materno"
              />
            </div>
            {errors.maternalLastname && (
              <p className="mt-1 text-sm text-red-600">{errors.maternalLastname}</p>
            )}
          </div>

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
                placeholder="55 1234 5678"
                maxLength="10"
              />
            </div>
            {errors.telefono && (
              <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
            )}
          </div>

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

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                id="register-accept-terms"
                checked={acceptedTerms}
                onChange={(e) => {
                  setAcceptedTerms(e.target.checked);
                  if (errors.acceptedTerms) {
                    setErrors((prev) => ({ ...prev, acceptedTerms: '' }));
                  }
                }}
                disabled={isLoading}
                className="w-5 h-5 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600 leading-snug">
                He leído y acepto los{' '}
                <a
                  href={TERMS_AND_CONDITIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline font-medium"
                >
                  Términos y Condiciones
                </a>
                .
              </span>
            </label>
            {errors.acceptedTerms && (
              <p className="mt-2 text-sm text-red-600">{errors.acceptedTerms}</p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading || !acceptedTerms}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creando cuenta...
              </>
            ) : (
              'Crear mi cuenta'
            )}
          </motion.button>
        </form>

        <div className="mt-4 text-center">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
          >
            <HiOutlineHome className="w-4 h-4" />
            Ir al inicio
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export { RegisterForm };
