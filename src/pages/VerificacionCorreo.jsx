import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineEnvelope, HiOutlineArrowLeft } from 'react-icons/hi2';
import { ROUTES } from '../utils/routes';
import { emailVerificationService } from '../api/services/emailVerificationService';
import useUserStore from '../stores/userStore';
import useToastStore from '../stores/toastStore';
import ProtectedRoute from '../components/common/ProtectedRoute';

const VerificacionCorreo = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const showToast = useToastStore((state) => state.showToast);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const email = user?.email || 'roger.vazquez14@gmail.com';

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !user?.client_id) {
      setError('No se encontró tu información. Inicia sesión nuevamente.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await emailVerificationService.addEmailVerification(user.client_id, email);
      showToast('Código enviado a tu correo', 'success', 3000);
      navigate(ROUTES.EMAIL_VERIFICATION_ENTER_CODE, {
        state: { email },
      });
    } catch (err) {
      setError(err.message || 'Error al enviar el código. Intenta más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

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
                  Verifica tu correo electrónico
                </h1>
                <p className="text-gray-600 mb-4">
                  Enviaremos un código de verificación a tu correo para confirmar tu identidad.
                </p>
                <div className="bg-gray-100 rounded-lg px-4 py-3">
                  <p className="font-semibold text-gray-900 text-center">{email || 'Cargando...'}</p>
                </div>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Enviando...
                    </>
                  ) : (
                    'Verificar'
                  )}
                </button>

                <Link
                  to={ROUTES.HOME}
                  className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors py-2"
                >
                  <HiOutlineArrowLeft className="w-4 h-4" />
                  Regresar al inicio
                </Link>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default VerificacionCorreo;
