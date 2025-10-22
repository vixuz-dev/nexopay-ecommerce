import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineShieldCheck, HiOutlineClock, HiOutlineCreditCard, HiOutlineShoppingBag, HiOutlineLockClosed } from 'react-icons/hi2';

const UserBenefits = () => {
  const benefits = [
    {
      icon: HiOutlineShieldCheck,
      title: "Sin buró ni historial previo",
      description: "No necesitas historial crediticio. Aprobamos tu solicitud basándonos en tu capacidad de pago actual."
    },
    {
      icon: HiOutlineClock,
      title: "Aprobación en minutos",
      description: "Recibe respuesta en minutos, no días. Todo el proceso es digital y sin papeleo."
    },
    {
      icon: HiOutlineCreditCard,
      title: "Pagos flexibles y visibles desde tu panel",
      description: "Paga en quincenas sin intereses ocultos. Total transparencia en cada pago."
    },
    {
      icon: HiOutlineShoppingBag,
      title: "Más de 500+ comercios afiliados",
      description: "Usa tu crédito en miles de tiendas y servicios. Desde supermercados hasta restaurantes."
    },
    {
      icon: HiOutlineLockClosed,
      title: "100% seguro y respaldado tecnológicamente",
      description: "Tus datos están protegidos con la mejor tecnología de seguridad bancaria."
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl lg:text-5xl font-medium text-primary-900 mb-4">
            Tu crédito, sin complicaciones.
          </h2>
          <p className="text-lg text-primary-700 max-w-3xl mx-auto">
            Con NexoPay, tienes el control. Te damos una línea de crédito digital para comprar sin estrés y pagar poco a poco, con total transparencia.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto"
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
                className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300"
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="space-y-4">
                  <motion.div 
                    className="text-4xl text-primary-500"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <IconComponent />
                  </motion.div>
                  <h3 className="text-xl font-medium text-primary-900 leading-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-primary-700 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.button 
            className="bg-highlight-500 hover:bg-highlight-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-glow-highlight hover:scale-105 hover:-translate-y-1 text-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Solicita tu crédito ahora
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export { UserBenefits };
