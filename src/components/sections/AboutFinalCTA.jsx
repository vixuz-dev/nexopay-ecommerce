import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCreditCard, HiOutlineBuildingOffice } from 'react-icons/hi2';
import { TopCurve } from '../common/TopCurve';
import { BottomCurve } from '../common/BottomCurve';

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

const buttonVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const AboutFinalCTA = () => {
  return (
    <>
      <section className="relative w-full bg-primary-500 py-32 lg:py-48">
        {/* Top Curve - Inside section at top */}
        <div className="absolute top-0 left-0 w-full">
          <TopCurve />
        </div>
        
        <div className="container mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Main message */}
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 mt-32"
            >
              Miles de personas y comercios ya forman parte de la comunidad NexoPay.
            </motion.h2>

            {/* Question */}
            <motion.h3 
              variants={fadeInUp}
              className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-12"
            >
              ¿Y tú, qué esperas para unirte?
            </motion.h3>

            {/* CTA Buttons */}
            <motion.div 
              variants={staggerContainer}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              {/* Primary CTA */}
              <motion.button
                variants={buttonVariants}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto flex items-center gap-3"
              >
                <HiOutlineCreditCard className="w-6 h-6" />
                Solicita tu crédito ahora
              </motion.button>

              {/* Secondary CTA */}
              <motion.button
                variants={buttonVariants}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300 w-full sm:w-auto flex items-center gap-3"
              >
                <HiOutlineBuildingOffice className="w-6 h-6" />
                Registra tu negocio
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Bottom Curve */}
      <BottomCurve />
    </>
  );
};

export { AboutFinalCTA };
