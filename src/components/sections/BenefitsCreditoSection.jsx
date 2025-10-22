import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  HiOutlineCreditCard, 
  HiOutlineBolt, 
  HiOutlineDocumentText, 
  HiOutlineShieldCheck, 
  HiOutlineDevicePhoneMobile 
} from 'react-icons/hi2';
import { TopCurve } from '../common/TopCurve';
import { BottomCurve } from '../common/BottomCurve';

gsap.registerPlugin(ScrollTrigger);

const BenefitsCreditoSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const benefitsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const benefits = benefitsRef.current;
    const cta = ctaRef.current;

    if (section && title && benefits && cta) {
      gsap.set([title, benefits, cta], { opacity: 0, y: 50 });

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => {
          gsap.to(title, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });
          gsap.to(benefits, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.2 });
          gsap.to(cta, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.4 });
        },
        once: true,
      });
    }
  }, []);

  const benefits = [
    {
      icon: HiOutlineCreditCard,
      title: "Sin buró ni historial previo",
      description: "Todos pueden acceder a NexoPay."
    },
    {
      icon: HiOutlineBolt,
      title: "Aprobación rápida",
      description: "En minutos, sin papeleo."
    },
    {
      icon: HiOutlineDocumentText,
      title: "Pagos flexibles",
      description: "Tú eliges cómo y cuándo pagar."
    },
    {
      icon: HiOutlineShieldCheck,
      title: "Transparencia total",
      description: "Sin letras pequeñas ni cargos sorpresa."
    },
    {
      icon: HiOutlineDevicePhoneMobile,
      title: "Todo desde tu cuenta",
      description: "Solicita, compra y paga desde un solo lugar."
    }
  ];

  return (
    <>
      {/* Main Section - Blue Background */}
      <section 
        ref={sectionRef}
        className="relative w-full bg-primary-500 py-20 lg:py-32"
      >
        {/* Top Curve - White - Inside section at top */}
        <div className="absolute top-0 left-0 w-full">
          <TopCurve />
        </div>

        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto mt-28 xl:mt-48 lg:mt-32">
            {/* Title */}
            <div ref={titleRef} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                Tu crédito, sin complicaciones.
              </h2>
            </div>

            {/* Benefits Grid */}
            <div ref={benefitsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.2 }}
                    className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-30 rounded-2xl p-8 text-center hover:bg-opacity-20 transition-all duration-300"
                  >
                    {/* Icon */}
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-4">
                      {benefit.title}
                    </h3>
                    <p className="text-white opacity-90 leading-relaxed">
                      {benefit.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <div ref={ctaRef} className="text-center">
              <motion.a
                href="/registro"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-block"
              >
                Solicitar crédito ahora
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Curve - Blue */}
      <BottomCurve />
    </>
  );
};

export default BenefitsCreditoSection;
