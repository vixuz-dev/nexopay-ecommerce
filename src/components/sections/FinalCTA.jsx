import React from 'react';
import { motion } from 'framer-motion';
import creditCtaImage from '../../assets/images/credit-cta.png';

const FinalCTA = () => {
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

  const slideInFromLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const slideInFromRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
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
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Background Gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      ></motion.div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 lg:p-12 shadow-2xl"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <motion.div 
              className="space-y-6"
              variants={slideInFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div 
                className="flex items-center gap-3 mb-4"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div 
                  className="w-8 h-8 bg-white rounded-lg flex items-center justify-center"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="w-4 h-4 bg-primary-500 rounded grid grid-cols-2 gap-0.5">
                    <div className="bg-white rounded-sm"></div>
                    <div className="bg-white rounded-sm"></div>
                    <div className="bg-white rounded-sm"></div>
                    <div className="bg-white rounded-sm"></div>
                  </div>
                </motion.div>
                <span className="text-sm font-medium text-white uppercase tracking-wider">
                  Comienza ahora
                </span>
              </motion.div>
              
              <motion.h2 
                className="text-3xl lg:text-4xl font-bold text-white mb-6"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.4 }}
              >
                Miles de personas ya confían en NexoPay.
                <motion.span 
                  className="block mt-2 text-highlight-500"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.6 }}
                >
                  ¿Qué esperas para unirte?
                </motion.span>
              </motion.h2>
              
              {/* Double CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-6"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.button 
                  className="bg-highlight-500 hover:bg-highlight-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-lg"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Solicita tu crédito ahora
                </motion.button>
                <motion.button 
                  className="bg-white text-primary-700 hover:bg-primary-50 font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-lg"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Registra tu negocio
                </motion.button>
              </motion.div>
              
              {/* Microcopy */}
              <motion.p 
                className="text-sm text-white opacity-90 leading-relaxed"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.8 }}
              >
                Compra sin complicaciones. Vende sin riesgos.
                <br />
                NexoPay te conecta con un futuro financiero más flexible.
              </motion.p>
            </motion.div>

            {/* Right Column - Image */}
            <motion.div 
              className="flex justify-center lg:justify-end"
              variants={slideInFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.img
                src={creditCtaImage}
                alt="NexoPay - Crédito digital y gestión financiera"
                className="w-full max-w-md h-auto"
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
              />
            </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export { FinalCTA };
