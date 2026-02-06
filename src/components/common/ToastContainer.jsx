import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineInformationCircle, HiOutlineExclamationTriangle, HiOutlineXMark } from 'react-icons/hi2';
import useToastStore from '../../stores/toastStore';

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  const getToastConfig = (type) => {
    const configs = {
      success: {
        icon: HiOutlineCheckCircle,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        iconColor: 'text-green-600',
        textColor: 'text-green-800',
      },
      error: {
        icon: HiOutlineXCircle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconColor: 'text-red-600',
        textColor: 'text-red-800',
      },
      info: {
        icon: HiOutlineInformationCircle,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-600',
        textColor: 'text-blue-800',
      },
      warning: {
        icon: HiOutlineExclamationTriangle,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        iconColor: 'text-yellow-600',
        textColor: 'text-yellow-800',
      },
    };

    return configs[type] || configs.info;
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full sm:w-auto pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = getToastConfig(toast.type);
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg p-4 pointer-events-auto flex items-start gap-3`}
            >
              <Icon className={`${config.iconColor} w-5 h-5 flex-shrink-0 mt-0.5`} />
              
              <div className="flex-1 min-w-0">
                <p className={`${config.textColor} text-sm font-medium`}>
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className={`${config.textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
                aria-label="Cerrar notificación"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;

