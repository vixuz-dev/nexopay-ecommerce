import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineCreditCard, 
  HiOutlineBuildingOffice, 
  HiOutlineEnvelope, 
  HiOutlineChatBubbleLeftRight, 
  HiOutlinePhone, 
  HiOutlineClock 
} from 'react-icons/hi2';

const ContactProfileSection = () => {
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
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  return (
    <section className="relative w-full bg-gray-50 py-20 lg:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-600 leading-tight mb-6">
              Contacto según tu perfil
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Encuentra el canal de comunicación más adecuado para tu consulta
            </p>
          </motion.div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Usuarios Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <HiOutlineCreditCard className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-primary-600">
                  Usuarios
                </h3>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Si tienes dudas sobre tu crédito, pagos o registro:
              </p>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center">
                  <HiOutlineEnvelope className="w-5 h-5 text-primary-600 mr-3" />
                  <a 
                    href="mailto:soporte@nexopay.com"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    soporte@nexopay.com
                  </a>
                </div>

                {/* WhatsApp */}
                <div className="flex items-center">
                  <HiOutlineChatBubbleLeftRight className="w-5 h-5 text-green-600 mr-3" />
                  <a 
                    href="https://wa.me/525500000000"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    WhatsApp: +52 55 0000 0000
                  </a>
                </div>

                {/* Horario */}
                <div className="flex items-center">
                  <HiOutlineClock className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-gray-600">
                    Lunes a viernes, 9:00 a 18:00 hrs (CDMX)
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Proveedores Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mr-4">
                  <HiOutlineBuildingOffice className="w-8 h-8 text-secondary-600" />
                </div>
                <h3 className="text-2xl font-bold text-secondary-600">
                  Proveedores
                </h3>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Si deseas registrar tu negocio o ya eres parte de NexoPay:
              </p>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center">
                  <HiOutlineEnvelope className="w-5 h-5 text-secondary-600 mr-3" />
                  <a 
                    href="mailto:proveedores@nexopay.com"
                    className="text-secondary-600 hover:text-secondary-700 font-medium"
                  >
                    proveedores@nexopay.com
                  </a>
                </div>

                {/* Teléfono */}
                <div className="flex items-center">
                  <HiOutlinePhone className="w-5 h-5 text-secondary-600 mr-3" />
                  <a 
                    href="tel:+523300000000"
                    className="text-secondary-600 hover:text-secondary-700 font-medium"
                  >
                    Teléfono: +52 33 0000 0000
                  </a>
                </div>

                {/* Horario */}
                <div className="flex items-center">
                  <HiOutlineClock className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-gray-600">
                    Lunes a viernes, 9:00 a 18:00 hrs (CDMX)
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactProfileSection;
