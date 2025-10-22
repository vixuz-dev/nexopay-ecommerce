import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  HiOutlineDocumentText, 
  HiOutlineCreditCard, 
  HiOutlineShoppingBag, 
  HiOutlineCalendar 
} from 'react-icons/hi2';

gsap.registerPlugin(ScrollTrigger);

const HowItWorksCreditoSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const stepsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const steps = stepsRef.current;
    const cta = ctaRef.current;

    if (section && title && steps && cta) {
      gsap.set([title, steps, cta], { opacity: 0, y: 50 });

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => {
          gsap.to(title, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });
          gsap.to(steps, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.2 });
          gsap.to(cta, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.4 });
        },
        once: true,
      });
    }
  }, []);

  const steps = [
    {
      icon: HiOutlineDocumentText,
      title: "Completa tu solicitud en línea",
      description: "Solo necesitas tus datos básicos y una identificación oficial."
    },
    {
      icon: HiOutlineCreditCard,
      title: "Recibe tu línea de crédito digital",
      description: "En minutos conocerás tu monto disponible para comprar."
    },
    {
      icon: HiOutlineShoppingBag,
      title: "Compra en comercios afiliados",
      description: "Usa tu crédito NexoPay para adquirir productos o servicios."
    },
    {
      icon: HiOutlineCalendar,
      title: "Paga poco a poco",
      description: "Elige tus plazos: semanal o quincenal, sin comisiones ocultas."
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white py-20 lg:py-32"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div ref={titleRef} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-600 leading-tight mb-6">
              Así de fácil es solicitar y usar tu crédito.
            </h2>
          </div>

          {/* Steps Grid */}
          <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                const colors = [
                  'from-primary-500 to-primary-600',
                  'from-secondary-500 to-secondary-600', 
                  'from-highlight-500 to-highlight-600',
                  'from-primary-400 to-primary-500'
                ];
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.2 }}
                    className="relative text-center"
                  >
                    {/* Step Icon with Gradient */}
                    <div className={`w-20 h-20 bg-gradient-to-br ${colors[index]} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>

                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-primary-500 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-sm font-bold text-primary-600">{index + 1}</span>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
          </div>

          {/* CTA */}
          <div ref={ctaRef} className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-600 hover:text-white transition-all duration-300"
            >
              Ver comercios afiliados
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksCreditoSection;
