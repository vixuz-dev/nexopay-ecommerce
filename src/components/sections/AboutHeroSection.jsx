import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HiOutlineLightBulb } from 'react-icons/hi2';
import { BottomCurve } from '../common/BottomCurve';

gsap.registerPlugin(ScrollTrigger);

const AboutHeroSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const description = descriptionRef.current;
    const cta = ctaRef.current;

    if (section && title && subtitle && description && cta) {
      gsap.set([title, subtitle, description, cta], { opacity: 0, y: 50 });

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => {
          gsap.to(title, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });
          gsap.to(subtitle, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.2 });
          gsap.to(description, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.4 });
          gsap.to(cta, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.6 });
        },
        once: true,
      });
    }
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full h-[calc(100vh-60px)] bg-primary-500 flex items-center justify-center text-center overflow-hidden"
      >
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <h1
              ref={titleRef}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            >
              Creamos el crédito del futuro.
            </h1>
            <p
              ref={subtitleRef}
              className="text-xl md:text-2xl text-white opacity-90 leading-relaxed mb-8"
            >
              En NexoPay, creemos que todos merecen la oportunidad de comprar lo que necesitan y pagar a su ritmo — sin estrés, sin trámites y sin exclusión.
            </p>
            <p
              ref={descriptionRef}
              className="text-lg md:text-xl text-white opacity-80 leading-relaxed mb-10"
            >
              Somos una fintech mexicana que impulsa la inclusión financiera mediante tecnología, datos y empatía. Conectamos a las personas y a los comercios con un sistema de crédito más justo, accesible y humano.
            </p>
            
            <div ref={ctaRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center mx-auto gap-3"
              >
                <HiOutlineLightBulb className="w-6 h-6" />
                Descubre cómo funciona NexoPay
              </motion.button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bottom Curve */}
      <BottomCurve />
    </>
  );
};

export default AboutHeroSection;
