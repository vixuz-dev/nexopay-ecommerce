import React from 'react';
import { motion } from 'framer-motion';
import { TopCurve } from '../common/TopCurve';
import { BottomCurve } from '../common/BottomCurve';

const AfiliadosWhyChooseSection = () => {
  return (
    <>
      {/* Main Section - Blue Background */}
      <section className="relative w-full bg-primary-500 py-20 lg:py-32">
        {/* Top Curve - White - Inside section at top */}
        <div className="absolute top-0 left-0 w-full">
          <TopCurve />
        </div>
        <div className="container mx-auto px-6 xl:mt-48 lg:mt-32 mt-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Título */}
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8"
            >
              ¿POR QUÉ ELEGIR NEXOPAY?
            </motion.h2>

            {/* Descripción */}
            <motion.p 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="text-xl md:text-2xl text-white opacity-90 leading-relaxed mb-12"
            >
              Porque no somos un banco ni una financiera tradicional.<br />
              Somos tu socio tecnológico de confianza, enfocado en que tu negocio crezca mientras tus clientes disfrutan de crédito responsable.
            </motion.p>

            {/* Mensaje de marca destacado */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20"
            >
              <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
                En NexoPay, tú vendes tranquilo.<br />
                Nosotros nos encargamos del resto.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Bottom Curve - Blue */}
      <BottomCurve />
    </>
  );
};

export default AfiliadosWhyChooseSection;
