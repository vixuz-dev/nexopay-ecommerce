import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import { BottomCurve } from '../common/BottomCurve';

gsap.registerPlugin(ScrollTrigger);

const ContactHeroSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const cta = ctaRef.current;

    if (section && title && subtitle && cta) {
      // Set initial states with more dramatic positioning
      gsap.set([title, subtitle, cta], { 
        opacity: 0, 
        y: 80,
        scale: 0.9
      });

      // Create timeline for more control
      const tl = gsap.timeline();

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => {
          tl.to(title, { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 1.2, 
            ease: "power3.out" 
          })
          .to(subtitle, { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 1, 
            ease: "power2.out" 
          }, "-=0.8")
          .to(cta, { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 0.8, 
            ease: "back.out(1.7)" 
          }, "-=0.6");
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
            <motion.h1
              ref={titleRef}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 1.2, 
                ease: "power3.out",
                delay: 0.3
              }}
            >
              Estamos aquí para ayudarte.
            </motion.h1>
            <motion.p
              ref={subtitleRef}
              className="text-xl md:text-2xl text-white opacity-90 leading-relaxed mb-8"
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 1, 
                ease: "power2.out",
                delay: 0.6
              }}
            >
              ¿Tienes dudas sobre tu crédito o deseas registrar tu negocio en NexoPay?<br />
              Nuestro equipo te brindará atención personalizada y resolverá todas tus preguntas.
            </motion.p>
            
            <motion.div 
              ref={ctaRef}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: "back.out(1.7)",
                delay: 0.9
              }}
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ 
                  scale: 0.95,
                  transition: { duration: 0.1 }
                }}
                className="bg-white text-primary-600 px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center mx-auto gap-3"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <HiOutlineChatBubbleLeftRight className="w-6 h-6" />
                </motion.div>
                Enviar mensaje al equipo NexoPay
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Bottom Curve */}
      <BottomCurve />
    </>
  );
};

export default ContactHeroSection;
