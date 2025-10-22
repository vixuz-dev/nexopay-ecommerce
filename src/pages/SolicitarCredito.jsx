import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SEO } from '../components/common/SEO';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import SolicitarCreditoIntroSection from '../components/sections/SolicitarCreditoIntroSection';
import HowItWorksCreditoSection from '../components/sections/HowItWorksCreditoSection';
import BenefitsCreditoSection from '../components/sections/BenefitsCreditoSection';
import RequirementsCreditoSection from '../components/sections/RequirementsCreditoSection';
import SecurityCreditoSection from '../components/sections/SecurityCreditoSection';
import TestimonialsCreditoSection from '../components/sections/TestimonialsCreditoSection';
import FAQCreditoSection from '../components/sections/FAQCreditoSection';

gsap.registerPlugin(ScrollTrigger);

const SolicitarCredito = () => {
  const heroSectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const microcopyRef = useRef(null);

  useEffect(() => {
    const heroSection = heroSectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const cta = ctaRef.current;
    const microcopy = microcopyRef.current;

    if (heroSection && title && subtitle && cta && microcopy) {
      gsap.set([title, subtitle, cta, microcopy], { opacity: 0, y: 50 });

      ScrollTrigger.create({
        trigger: heroSection,
        start: "top 80%",
        onEnter: () => {
          gsap.to(title, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });
          gsap.to(subtitle, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.2 });
          gsap.to(cta, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.4 });
          gsap.to(microcopy, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.6 });
        },
        once: true,
      });
    }
  }, []);

  const keywords = [
    'crédito digital',
    'solicitar crédito',
    'compra a plazos',
    'fintech México',
    'crédito sin buró',
    'solicitar crédito en línea México',
    'crédito fácil sin buró',
    'compra ahora paga después',
    'crédito rápido digital'
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "NexoPay - Crédito Digital",
    "url": "https://www.nexopay.com/solicitar-credito",
    "description": "Obtén tu crédito digital con NexoPay y paga en quincenas sin buró ni papeleo. Rápido, seguro y 100% en línea.",
    "provider": {
      "@type": "Organization",
      "name": "NexoPay",
      "url": "https://www.nexopay.com"
    },
    "offers": {
      "@type": "Offer",
      "name": "Solicita tu crédito",
      "description": "Crédito digital sin buró, aprobación rápida, pago en quincenas",
      "url": "https://www.nexopay.com/solicitar-credito"
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Solicita tu crédito con NexoPay"
        description="Obtén tu crédito digital con NexoPay y paga en quincenas sin buró ni papeleo. Rápido, seguro y 100% en línea. Solicita tu crédito ahora."
        keywords={keywords}
        schema={schema}
      />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section 
          ref={heroSectionRef}
          className="relative w-full h-[calc(100vh-60px)] bg-primary-500 flex items-center justify-center text-center overflow-hidden"
        >
          <div className="container mx-auto px-6 py-16">
            <div className="max-w-4xl mx-auto">
              <h1 
                ref={titleRef}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
              >
                Tu crédito digital<br />está a un clic de distancia
              </h1>
              <p 
                ref={subtitleRef}
                className="text-xl md:text-2xl text-white opacity-90 leading-relaxed mb-8"
              >
                Sin buró, sin papeleo, sin complicaciones.<br />
                Solo necesitas tu teléfono y 5 minutos.
              </p>
              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
                <motion.a
                  href="/registro"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-600 px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  Solicitar mi crédito
                </motion.a>
              </div>
              <p ref={microcopyRef} className="text-sm text-white opacity-70">
                Aprobación en segundos • Sin compromisos
              </p>
            </div>
          </div>
        </section>
        
        {/* Bottom Curve */}
        <div className="relative w-full h-16 md:h-20 lg:h-24 overflow-hidden">
          <svg
            className="w-full h-16 md:h-20 lg:h-24"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block' }}
          >
            <path
              fill="#208eaa"
              fillOpacity="1"
              d="M0,128L120,138.7C240,149,480,171,720,165.3C960,160,1200,128,1320,112L1440,96L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"
            />
          </svg>
        </div>
        
            {/* Intro Section */}
            <SolicitarCreditoIntroSection />
            
            {/* How It Works Section */}
            <HowItWorksCreditoSection />
        
        {/* Benefits Section */}
        <BenefitsCreditoSection />
        
        {/* Requirements Section */}
        <RequirementsCreditoSection />
        
        {/* Security Section */}
        <SecurityCreditoSection />
        
        {/* Testimonials Section */}
        <TestimonialsCreditoSection />
        
        {/* FAQ Section */}
        <FAQCreditoSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default SolicitarCredito;
