import React from 'react';
import { motion } from 'framer-motion';
import { StepItem } from './StepItem';
import step1Image from '../../assets/images/steps/step-1.png';
import step2Image from '../../assets/images/steps/step-2.png';
import step3Image from '../../assets/images/steps/step-3.png';

const HowItWorks = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-neutral-50 mt-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl lg:text-5xl font-medium text-primary-900 mb-4">
            Así de fácil es usar NexoPay
          </h2>
          <p className="text-lg text-primary-700 max-w-2xl mx-auto">
            Olvídate del papeleo. En NexoPay, todo es digital, rápido y transparente.
          </p>
        </motion.div>

        {/* Pasos */}
        <motion.div 
          className="max-w-6xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Paso 1 */}
          <StepItem
            stepNumber="1"
            title="Solicita tu crédito"
            description="Completa tu solicitud en minutos. Sin buró, sin requisitos imposibles."
            image={step1Image}
            imageAlt="Solicita tu crédito - Completa tu solicitud en minutos"
            layout="text-left"
          />

          {/* Paso 2 */}
          <StepItem
            stepNumber="2"
            title="Compra en comercios afiliados"
            description="Usa tu línea NexoPay para adquirir productos y servicios."
            image={step2Image}
            imageAlt="Compra en comercios afiliados con NexoPay"
            layout="text-right"
          />

          {/* Paso 3 */}
          <StepItem
            stepNumber="3"
            title="Paga en quincenas o semanas"
            description="Tú eliges el ritmo. Sin intereses ocultos ni sorpresas."
            image={step3Image}
            imageAlt="Paga en quincenas o semanas - Sin intereses ocultos"
            layout="text-left"
          />
        </motion.div>

        {/* CTA Final */}
        <motion.div 
          className="text-center mt-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.button 
            className="bg-highlight-500 hover:bg-highlight-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-glow-highlight hover:scale-105 hover:-translate-y-1"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Quiero probar NexoPay
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export { HowItWorks };
