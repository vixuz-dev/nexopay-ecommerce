import React from 'react';
import { motion } from 'framer-motion';

const StepItem = ({ 
  stepNumber, 
  title, 
  description, 
  image, 
  imageAlt, 
  layout = 'text-left' // 'text-left' or 'text-right'
}) => {
  const isTextLeft = layout === 'text-left';
  
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
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
    <motion.div 
      className="mb-16 lg:mb-24"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
        isTextLeft ? '' : 'lg:grid-flow-col-dense'
      }`}>
        {/* Contenido de texto */}
        <motion.div 
          className={`${isTextLeft ? 'lg:order-1' : 'lg:order-2'}`}
          variants={isTextLeft ? slideInFromLeft : slideInFromRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="flex items-start gap-4 mb-6">
            <motion.div 
              className="flex-shrink-0"
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <span className="text-8xl font-black text-primary-500 opacity-20 ">{stepNumber}</span>
            </motion.div>
            <div className="flex-1">
              <motion.h3 
                className="text-2xl lg:text-3xl font-bold text-primary-900 mb-4"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.2 }}
              >
                {title}
              </motion.h3>
              <motion.div 
                className="text-primary-700 leading-relaxed"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.4 }}
              >
                {typeof description === 'string' ? (
                  <p>{description}</p>
                ) : (
                  description
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Imagen */}
        <motion.div 
          className={`${isTextLeft ? 'lg:order-2' : 'lg:order-1'}`}
          variants={isTextLeft ? slideInFromRight : slideInFromLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="relative">
            <motion.img
              src={image}
              alt={imageAlt}
              className="w-full h-auto max-w-xs mx-auto lg:max-w-md lg:mx-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export { StepItem };
