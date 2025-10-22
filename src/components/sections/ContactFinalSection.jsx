import React from 'react';
import { motion } from 'framer-motion';
import { FAQ } from '../common/FAQ';
import { HiOutlineCreditCard, HiOutlineBuildingOffice } from 'react-icons/hi2';

const ContactFinalSection = () => {
  const faqs = [
    {
      question: "¿Qué es NexoPay y cómo funciona?",
      answer: "NexoPay es una plataforma de crédito digital que te permite comprar lo que necesitas hoy y pagarlo a tu ritmo. Simplemente te registras, solicitas tu línea de crédito, compras en comercios afiliados y pagas en quincenas o semanas."
    },
    {
      question: "¿Necesito tener historial crediticio para usar NexoPay?",
      answer: "No, NexoPay no consulta el buró de crédito tradicional. Utilizamos tecnología avanzada y datos alternativos para evaluar tu capacidad de pago, haciendo el crédito accesible para más personas."
    },
    {
      question: "¿Cuáles son los comercios afiliados donde puedo comprar?",
      answer: "Tenemos una red creciente de comercios afiliados incluyendo tiendas de electrónicos, muebles, ropa, farmacias y más. Puedes ver la lista completa en nuestra app o sitio web."
    },
    {
      question: "¿Cuánto tiempo tarda la aprobación de mi crédito?",
      answer: "La aprobación es instantánea en la mayoría de los casos. Nuestro sistema evalúa tu solicitud en tiempo real y te da una respuesta inmediata, sin esperas ni trámites largos."
    },
    {
      question: "¿Qué pasa si no puedo pagar a tiempo?",
      answer: "Entendemos que pueden surgir imprevistos. Si tienes dificultades para pagar, contáctanos inmediatamente. Trabajamos contigo para encontrar una solución que se ajuste a tu situación, sin afectar tu historial."
    },
    {
      question: "¿Es seguro usar NexoPay?",
      answer: "Sí, utilizamos la misma tecnología de seguridad que los bancos tradicionales. Tus datos están protegidos con encriptación de extremo a extremo y cumplimos con todas las normativas de protección financiera en México."
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
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <section className="relative w-full bg-white py-20 lg:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          {/* FAQ Section */}
          <motion.div variants={fadeInUp} className="mb-16">
            <FAQ 
              faqs={faqs}
              title="¿Tienes dudas sobre NexoPay?"
              subtitle="Resolvemos las preguntas más comunes sobre nuestro servicio de crédito digital"
            />
          </motion.div>

          {/* CTA Section */}
          <motion.div
            variants={fadeInUp}
            className="bg-primary-500 rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl md:text-2xl text-white opacity-90 leading-relaxed mb-10">
              Únete a miles de usuarios que ya confían en NexoPay
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="/solicitar-credito"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 w-full sm:w-auto justify-center"
              >
                <HiOutlineCreditCard className="w-6 h-6" />
                Solicita tu crédito ahora
              </motion.a>
              
              <motion.a
                href="/proveedores"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300 flex items-center gap-3 w-full sm:w-auto justify-center"
              >
                <HiOutlineBuildingOffice className="w-6 h-6" />
                Registra tu negocio
              </motion.a>
            </div>
            
            <p className="text-sm text-white opacity-70 mt-6">
              Sin compromisos • Respuesta en 24 horas • Proceso 100% digital
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactFinalSection;
