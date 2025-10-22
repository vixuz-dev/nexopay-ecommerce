import React from 'react';
import { motion } from 'framer-motion';
import { HeroCTAs } from './HeroCTAs';

const HeroContent = () => {
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="text-white">
      <div className="mb-6">
        <motion.h1 
          className="text-5xl lg:text-6xl font-black leading-tight mb-6"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Compra hoy.
          </motion.div>
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <span className="text-highlight-500">Paga a tu ritmo.</span>
          </motion.div>
        </motion.h1>
        <motion.h2 
          className="text-lg font-light leading-relaxed mb-8"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        >
          Con NexoPay, obtienes una línea de crédito digital para comprar en tus tiendas favoritas y pagar en quincenas, sin buró y sin trámites complicados.
        </motion.h2>
      </div>
      
      <motion.div
        variants={textVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.8 }}
      >
        <HeroCTAs />
      </motion.div>
    </div>
  );
};

export { HeroContent };
