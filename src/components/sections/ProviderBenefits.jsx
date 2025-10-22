import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineArrowTrendingUp, HiOutlineShieldCheck, HiOutlineBolt, HiOutlineChartBar } from 'react-icons/hi2';

const ProviderBenefits = () => {
  const benefits = [
    {
      icon: HiOutlineArrowTrendingUp,
      title: "Incrementa tus ventas y alcanza nuevos clientes",
      description: "Atrae más clientes ofreciendo pago a plazos. Aumenta tu ticket promedio y fideliza a tus compradores."
    },
    {
      icon: HiOutlineShieldCheck,
      title: "Recibe tus pagos sin riesgo",
      description: "Recibe tus pagos de forma segura y puntual. NexoPay se encarga del cobro, tú te enfocas en vender."
    },
    {
      icon: HiOutlineBolt,
      title: "Integra NexoPay fácilmente a tu punto de venta",
      description: "Conecta tu tienda en minutos. API simple y documentación clara para implementar fácilmente."
    },
    {
      icon: HiOutlineChartBar,
      title: "Accede a un panel con reportes y estadísticas en tiempo real",
      description: "Monitorea tus ventas, comisiones y métricas clave desde una plataforma intuitiva y completa."
    }
  ];

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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
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

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Content */}
          <motion.div 
            className="lg:sticky lg:top-8 lg:self-start"
            variants={slideInFromLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="space-y-6">
              <div>
                <motion.h2 
                  className="text-3xl lg:text-5xl font-bold text-primary-900 mb-6"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <motion.div 
                    className="mb-2"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: 0.1 }}
                  >
                    Ayudamos a tu
                  </motion.div>
                  <motion.div 
                    className="mb-2"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: 0.2 }}
                  >
                    negocio a vender
                  </motion.div>
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: 0.3 }}
                  >
                    más.
                  </motion.div>
                </motion.h2>
                <motion.p 
                  className="text-lg text-primary-700 leading-relaxed mb-8"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.4 }}
                >
                  Con NexoPay, tus clientes pueden comprar de inmediato y pagar después. Tú recibes tus pagos seguros, sin preocuparte por la cobranza.
                </motion.p>
              </div>
              
              {/* Stats */}
              {/* <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-primary-500 rounded-full border-2 border-white"></div>
                  <div className="w-10 h-10 bg-secondary-500 rounded-full border-2 border-white"></div>
                  <div className="w-10 h-10 bg-highlight-500 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-primary-900 font-medium">500+ Proveedores activos</span>
              </div> */}
            </div>
          </motion.div>

          {/* Right Column - Benefits Cards */}
          <motion.div 
            className="space-y-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div 
                  key={index} 
                  className="bg-neutral-50 rounded-lg p-6 hover:shadow-md transition-all duration-300"
                  variants={cardVariants}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <IconComponent className="text-white text-xl" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-primary-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-primary-700 leading-relaxed mb-3">
                        {benefit.description}
                      </p>
                      <motion.a 
                        href="#" 
                        className="text-primary-500 font-medium hover:text-primary-600 transition-colors"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        Conoce más
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div 
          className="text-center mt-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.button 
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:scale-105 hover:-translate-y-1 text-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Registra tu negocio
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export { ProviderBenefits };
