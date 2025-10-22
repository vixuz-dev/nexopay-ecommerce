import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  HiOutlineArrowTrendingUp, 
  HiOutlineShieldCheck, 
  HiOutlineDocumentText, 
  HiOutlineChartBar, 
  HiOutlineUserGroup 
} from 'react-icons/hi2';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const AfiliadosBenefitsSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const benefitsRef = useRef([]);

  const benefits = [
    {
      icon: HiOutlineArrowTrendingUp,
      title: "Aumenta tus ventas",
      description: "tus clientes compran más cuando pueden pagar en plazos."
    },
    {
      icon: HiOutlineShieldCheck,
      title: "Cobra sin riesgo",
      description: "NexoPay te paga directamente; nosotros asumimos la gestión del crédito."
    },
    {
      icon: HiOutlineDocumentText,
      title: "Simplifica tus procesos",
      description: "todo es digital, sin papeleo."
    },
    {
      icon: HiOutlineChartBar,
      title: "Control total",
      description: "accede a tu panel de proveedor con reportes, ventas y seguimiento en tiempo real."
    },
    {
      icon: HiOutlineUserGroup,
      title: "Soporte personalizado",
      description: "nuestro equipo te acompaña en la integración y capacitación."
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const benefitCards = benefitsRef.current.filter(Boolean);

    if (section && title && benefitCards.length > 0) {
      // Set initial states
      gsap.set([title, ...benefitCards], {
        opacity: 0,
        y: 50
      });

      // Create scroll trigger
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => {
          gsap.to(title, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
          });

          gsap.to(benefitCards, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            delay: 0.3
          });
        }
      });
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-white py-20 lg:py-32"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Título */}
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-600 mb-16 text-center opacity-0"
            style={{ transform: 'translateY(50px)' }}
          >
            Crece con la confianza de NexoPay
          </h2>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={index}
                  ref={el => benefitsRef.current[index] = el}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 opacity-0 border border-gray-100"
                  style={{ transform: 'translateY(50px)' }}
                >
                  {/* Icon */}
                  <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-primary-600 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary-600 hover:text-white transition-all duration-300"
            >
              Conoce nuestros planes para comercios
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AfiliadosBenefitsSection;
