import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineUserPlus, 
  HiOutlineShoppingBag, 
  HiOutlineCreditCard, 
  HiOutlineShieldCheck 
} from 'react-icons/hi2';
import { TopCurve } from '../common/TopCurve';
import { BottomCurve } from '../common/BottomCurve';


const AfiliadosHowItWorksSection = () => {

  const steps = [
    {
      icon: HiOutlineUserPlus,
      title: "Regístrate como proveedor",
      description: "Llena el formulario y activa tu cuenta."
    },
    {
      icon: HiOutlineShoppingBag,
      title: "Publica tus productos o servicios",
      description: "Añade precios, fotos y detalles en tu panel."
    },
    {
      icon: HiOutlineCreditCard,
      title: "Ofrece NexoPay como método de pago",
      description: "Tus clientes eligen pagar en quincenas o semanas."
    },
    {
      icon: HiOutlineShieldCheck,
      title: "Recibe tus pagos con seguridad",
      description: "Nosotros gestionamos los cobros y tú recibes tu dinero."
    }
  ];


  return (
    <>
      {/* Top Curve - Inside section at top */}
      <section className="relative w-full bg-primary-500 py-32 lg:py-48">
        <div className="absolute top-0 left-0 w-full">
          <TopCurve />
        </div>
        
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto xl:mt-48 lg:mt-32 mt-20">
            {/* Título */}
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 text-center"
            >
              Integrarte con NexoPay es tan simple como vender.
            </motion.h2>

            {/* Subtítulo */}
            <motion.p 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="text-xl md:text-2xl text-white opacity-90 text-center mb-16"
            >
              En pocos pasos puedes comenzar a ofrecer crédito a tus clientes, sin necesidad de tramitarlo tú.
            </motion.p>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 + (index * 0.3) }}
                    className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center relative ${
                      index >= 2 ? 'mt-16 md:mt-8 lg:mt-0' : 'mt-16 md:mt-0'
                    }`}
                  >
                    {/* Step Number - Top Left */}
                    <div className="absolute -top-12 left-4">
                      <span className="text-8xl font-bold text-white opacity-80 drop-shadow-lg">{index + 1}</span>
                    </div>
                    
                    {/* Icon */}
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 mt-8">
                      <IconComponent className="w-8 h-8 text-primary-600" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold text-primary-600 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Quiero ser proveedor NexoPay
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Bottom Curve */}
      <BottomCurve />
    </>
  );
};

export default AfiliadosHowItWorksSection;
