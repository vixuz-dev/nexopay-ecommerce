import React from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export const FutureVisionSection = () => {
  return (
    <section className="relative w-full bg-white py-20 lg:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Title */}
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-600 mb-8"
          >
            Mirando hacia el futuro
          </motion.h2>

          {/* Main message */}
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl lg:text-3xl text-gray-800 leading-relaxed mb-8"
          >
            Queremos construir un México donde el crédito sea una puerta, no una barrera.
          </motion.p>

          {/* Supporting text */}
          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8"
          >
            Seguiremos impulsando soluciones tecnológicas que hagan el financiamiento más justo, responsable y accesible.
          </motion.p>

          {/* Purpose statement */}
          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-700 leading-relaxed"
          >
            Cada paso que damos, lo hacemos con un propósito: darle poder a las personas y confianza a los negocios.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
