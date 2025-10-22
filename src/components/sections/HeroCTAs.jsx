import React from 'react';
import { motion } from 'framer-motion';

const HeroCTAs = () => {
  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const microcopyVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button 
          className="bg-highlight-500 hover:bg-highlight-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-glow-highlight hover:shadow-glow-highlight hover:scale-105 hover:-translate-y-1"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Solicita tu crédito
        </motion.button>
        <motion.button 
          className="bg-white text-primary-500 hover:bg-neutral-100 font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Soy proveedor
        </motion.button>
      </div>
      
      {/* Microcopy */}
      <motion.div 
        className="text-center sm:text-left"
        variants={microcopyVariants}
        initial="hidden"
        animate="visible"
      >
        <p className="text-sm text-white opacity-80">
          100% digital | Sin comisiones ocultas | Respuesta en minutos
        </p>
      </motion.div>
    </div>
  );
};

export { HeroCTAs };
