import React from 'react';
import { motion } from 'framer-motion';

const EducationalCTA = () => {
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
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 lg:p-12 shadow-2xl"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Content */}
              <motion.div 
                className="text-white"
                variants={slideInFromLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.h2 
                  className="text-3xl lg:text-4xl font-bold mb-6"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.2 }}
                >
                  Educación financiera para todos.
                </motion.h2>
                <motion.p 
                  className="text-lg text-primary-100 leading-relaxed mb-8"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.4 }}
                >
                  Aprende cómo mejorar tus finanzas, construir historial y aprovechar el crédito responsablemente. 
                  Descubre las mejores prácticas financieras con NexoPay.
                </motion.p>
              </motion.div>
              
              {/* CTA Button */}
              <motion.div 
                className="flex justify-center lg:justify-end"
                variants={slideInFromRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.button 
                  className="bg-white text-primary-700 font-semibold py-4 px-8 rounded-xl hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Visita nuestro blog
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export { EducationalCTA };
