import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineBuildingOffice, HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import { TopCurve } from '../common/TopCurve';
import { BottomCurve } from '../common/BottomCurve';

const AfiliadosFinalCTASection = () => {
  return (
    <>
      {/* Top Curve - White */}
      <TopCurve />
      
      {/* Main Section - Blue Background */}
      <section className="relative w-full bg-primary-500 py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Título */}
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8"
            >
              Comienza hoy a vender más con NexoPay.
            </motion.h2>

            {/* Texto */}
            <motion.p 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="text-xl md:text-2xl text-white opacity-90 leading-relaxed mb-12"
            >
              Únete a la red de comercios que ya están transformando la manera de vender.<br />
              Regístrate y empieza a ofrecer crédito digital sin riesgo.
            </motion.p>

            {/* Botones */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
            >
              {/* Botón principal */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto flex items-center gap-3"
              >
                <HiOutlineBuildingOffice className="w-6 h-6" />
                Registrarme como proveedor
              </motion.button>

              {/* Botón secundario */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300 w-full sm:w-auto flex items-center gap-3"
              >
                <HiOutlineChatBubbleLeftRight className="w-6 h-6" />
                Hablar con un asesor
              </motion.button>
            </motion.div>

            {/* Microcopy final */}
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
              className="text-white opacity-80 text-sm md:text-base"
            >
              Sin costos de entrada. Sin complicaciones. Solo crecimiento.
            </motion.p>
          </div>
        </div>
      </section>
      
      {/* Bottom Curve - Blue */}
      <BottomCurve />
    </>
  );
};

export default AfiliadosFinalCTASection;
