import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegistroForm } from '../forms/RegistroForm';
import { HiOutlineCheckCircle, HiOutlineArrowRight } from 'react-icons/hi2';

const SolicitarCreditoFlow = () => {
  const [currentStep, setCurrentStep] = useState('registro'); // 'registro', 'procesando', 'exito'
  const [userData, setUserData] = useState(null);

  const handleRegistroSuccess = (data) => {
    setUserData(data);
    setCurrentStep('procesando');
    
    // Simular procesamiento
    setTimeout(() => {
      setCurrentStep('exito');
    }, 3000);
  };

  const handleBackToRegistro = () => {
    setCurrentStep('registro');
    setUserData(null);
  };

  const handleContinuar = () => {
    // Aquí iría la lógica para continuar al siguiente paso del proceso
    console.log('Continuar con el proceso de crédito');
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <section id="proceso-registro" className="relative w-full bg-white py-20 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-600 leading-tight mb-6">
              Solicita tu crédito en 3 pasos
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Proceso rápido, seguro y 100% digital
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              {/* Step 1 - Registro */}
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'registro' 
                    ? 'bg-primary-500 text-white' 
                    : currentStep === 'procesando' || currentStep === 'exito'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep === 'registro' ? '1' : '✓'}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep === 'registro' ? 'text-primary-600' : 'text-gray-600'
                }`}>
                  Registro
                </span>
              </div>

              <div className={`w-16 h-0.5 ${
                currentStep === 'procesando' || currentStep === 'exito' ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>

              {/* Step 2 - Procesando */}
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'procesando' 
                    ? 'bg-primary-500 text-white' 
                    : currentStep === 'exito'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep === 'procesando' ? '2' : currentStep === 'exito' ? '✓' : '2'}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep === 'procesando' ? 'text-primary-600' : 'text-gray-600'
                }`}>
                  Evaluación
                </span>
              </div>

              <div className={`w-16 h-0.5 ${
                currentStep === 'exito' ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>

              {/* Step 3 - Éxito */}
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'exito' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep === 'exito' ? '✓' : '3'}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep === 'exito' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  Aprobación
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {currentStep === 'registro' && (
              <motion.div
                key="registro"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <RegistroForm 
                  onRegistroSuccess={handleRegistroSuccess}
                  onBack={() => window.history.back()}
                />
              </motion.div>
            )}

            {currentStep === 'procesando' && (
              <motion.div
                key="procesando"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="bg-white rounded-2xl shadow-xl p-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-6"></div>
                  <h3 className="text-2xl font-bold text-primary-600 mb-4">
                    Evaluando tu solicitud
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Estamos analizando tu información para determinar tu línea de crédito disponible.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>✓ Verificando identidad</p>
                    <p>✓ Analizando capacidad de pago</p>
                    <p>✓ Calculando monto disponible</p>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 'exito' && (
              <motion.div
                key="exito"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="bg-white rounded-2xl shadow-xl p-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <HiOutlineCheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary-600 mb-4">
                    ¡Cuenta creada exitosamente!
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Tu cuenta NexoPay ha sido creada. Ahora puedes acceder a tu línea de crédito digital.
                  </p>
                  
                  <div className="bg-primary-50 rounded-xl p-6 mb-8">
                    <h4 className="font-bold text-primary-700 mb-2">Próximos pasos:</h4>
                    <ul className="text-sm text-primary-600 space-y-1">
                      <li>• Completa tu perfil con información adicional</li>
                      <li>• Verifica tu identidad con tu INE</li>
                      <li>• Descubre tu línea de crédito disponible</li>
                      <li>• Comienza a comprar en comercios afiliados</li>
                    </ul>
                  </div>

                  <motion.button
                    onClick={handleContinuar}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center mx-auto gap-3"
                  >
                    Continuar al proceso
                    <HiOutlineArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default SolicitarCreditoFlow;
