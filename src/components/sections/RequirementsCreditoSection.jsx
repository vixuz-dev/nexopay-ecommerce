import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  HiOutlineCheckCircle, 
  HiOutlineUser, 
  HiOutlineIdentification, 
  HiOutlinePhone, 
  HiOutlineMapPin 
} from 'react-icons/hi2';

gsap.registerPlugin(ScrollTrigger);

const RequirementsCreditoSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const requirementsRef = useRef(null);
  const clarificationRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const requirements = requirementsRef.current;
    const clarification = clarificationRef.current;

    if (section && title && requirements && clarification) {
      gsap.set([title, requirements, clarification], { opacity: 0, y: 50 });

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => {
          gsap.to(title, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });
          gsap.to(requirements, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.2 });
          gsap.to(clarification, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.4 });
        },
        once: true,
      });
    }
  }, []);

  const requirements = [
    {
      icon: HiOutlineUser,
      title: "Ser mayor de edad",
      description: "18 años o más"
    },
    {
      icon: HiOutlineIdentification,
      title: "Identificación oficial",
      description: "INE o pasaporte"
    },
    {
      icon: HiOutlinePhone,
      title: "Contacto activo",
      description: "Teléfono y correo electrónico"
    },
    {
      icon: HiOutlineMapPin,
      title: "Residir en México",
      description: "Ubicación en territorio nacional"
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white py-20 lg:py-32"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div ref={titleRef} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-600 leading-tight mb-6">
              ¿Qué necesitas para solicitar tu crédito?
            </h2>
          </div>

          {/* Requirements Grid */}
          <div ref={requirementsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {requirements.map((requirement, index) => {
              const IconComponent = requirement.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.2 }}
                  className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300"
                >
                  {/* Check Icon */}
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <HiOutlineCheckCircle className="w-8 h-8 text-green-600" />
                  </div>

                  {/* Requirement Icon */}
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-primary-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-primary-600 mb-3">
                    {requirement.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {requirement.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Clarification Text */}
          <div ref={clarificationRef} className="text-center">
            <div className="bg-primary-50 border-l-4 border-primary-500 p-8 rounded-lg">
              <p className="text-lg md:text-xl text-primary-700 leading-relaxed mb-4">
                <span className="font-bold">No necesitas buró, comprobantes de ingresos ni avales.</span>
              </p>
              <p className="text-md md:text-lg text-gray-700 leading-relaxed">
                En NexoPay creemos que el acceso al crédito debe ser simple y justo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequirementsCreditoSection;
