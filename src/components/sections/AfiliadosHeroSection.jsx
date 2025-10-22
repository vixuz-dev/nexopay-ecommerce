import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const AfiliadosHeroSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const microcopyRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const cta = ctaRef.current;
    const microcopy = microcopyRef.current;

    if (section && title && subtitle && cta && microcopy) {
      // Set initial states
      gsap.set([title, subtitle, cta, microcopy], {
        opacity: 0,
        y: 50
      });

      // Create timeline
      const tl = gsap.timeline();

      tl.to(title, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
      })
      .to(subtitle, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.5")
      .to(cta, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.3")
      .to(microcopy, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.2");
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

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-primary-500"
      style={{ height: 'calc(100vh - 60px)' }}
    >
      <div className="container mx-auto px-6 h-full flex items-center">
        <div className="max-w-4xl mx-auto text-center">
          {/* Título principal */}
          <h1 
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-8 opacity-0"
            style={{ transform: 'translateY(50px)' }}
          >
            Vende más.<br />
            Cobra sin riesgo.
          </h1>

          {/* Subtítulo */}
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl lg:text-3xl text-white opacity-90 leading-relaxed mb-12 opacity-0"
            style={{ transform: 'translateY(50px)' }}
          >
            Con NexoPay, tus clientes compran al instante y pagan en quincenas.
            Tú recibes tus pagos seguros, sin preocuparte por la cobranza.
          </p>

          {/* CTA Button */}
          <div 
            ref={ctaRef}
            className="mb-8 opacity-0"
            style={{ transform: 'translateY(50px)' }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Registra tu negocio
            </motion.button>
          </div>

          {/* Microcopy */}
          <div 
            ref={microcopyRef}
            className="text-white opacity-80 text-sm md:text-base opacity-0"
            style={{ transform: 'translateY(50px)' }}
          >
            Sin comisiones ocultas | Pagos garantizados | Integración rápida
          </div>
        </div>
      </div>
    </section>
  );
};

export default AfiliadosHeroSection;
