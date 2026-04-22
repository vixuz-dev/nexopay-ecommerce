import { useEffect } from 'react';
import { Outlet, useBlocker } from 'react-router-dom';
import nexopayLogo from '../assets/images/NexoPay-Logo.png';
import { ROUTES } from '../utils/routes';
import usePasswordResetStore from '../stores/passwordResetStore';

const LEAVE_CONFIRM_MESSAGE =
  'Si sales ahora, perderás el progreso de recuperación de contraseña y tendrás que empezar de nuevo. ¿Deseas salir?';

const BEFORE_UNLOAD_MESSAGE =
  '¿Seguro que deseas salir? Perderás el progreso de recuperación de contraseña.';

/**
 * Layout del flujo de recuperación: bloquea salidas fuera de `/actualizacion-contrasena/*` cuando el proceso ya avanzó.
 */
const PasswordResetFlowLayout = () => {
  const flowCommitted = usePasswordResetStore((s) => s.flowCommitted);
  const reset = usePasswordResetStore((s) => s.reset);

  const shouldBlock = flowCommitted;

  const blocker = useBlocker(
    ({ nextLocation }) =>
      shouldBlock && !nextLocation.pathname.startsWith(ROUTES.PASSWORD_RESET)
  );

  useEffect(() => {
    if (blocker.state !== 'blocked') return undefined;

    const proceed = () => {
      reset();
      blocker.proceed();
    };

    const cancel = () => {
      blocker.reset();
    };

    const timeoutId = window.setTimeout(() => {
      if (window.confirm(LEAVE_CONFIRM_MESSAGE)) {
        proceed();
      } else {
        cancel();
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [blocker, reset]);

  useEffect(() => {
    if (!shouldBlock) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = BEFORE_UNLOAD_MESSAGE;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [shouldBlock]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="w-full max-w-lg mx-auto px-6">
        <div className="text-center mb-6">
          <img src={nexopayLogo} alt="NexoPay Logo" className="h-12 mx-auto mb-4" />
          <p className="text-sm font-medium text-primary-600">Recuperar contraseña</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default PasswordResetFlowLayout;
