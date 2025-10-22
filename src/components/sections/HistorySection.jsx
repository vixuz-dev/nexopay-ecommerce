import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TopCurve } from '../common/TopCurve';
import { BottomCurve } from '../common/BottomCurve';
import { BiSolidQuoteLeft, BiSolidQuoteRight } from 'react-icons/bi';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const HistorySection = () => {
  const sectionRef = useRef(null);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const fadeInUpDelayed = {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1.2, ease: "easeOut", delay: 0.8 }
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

  useEffect(() => {
    // Cleanup function for ScrollTrigger
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
    <section 
      ref={sectionRef}
      className="relative w-full min-h-screen bg-primary-500 py-20 lg:py-32"
    >
      {/* Top Curve */}
      <div className="absolute top-0 left-0 w-full">
        <TopCurve />
      </div>
      
      <div className="container mx-auto px-4 flex flex-col items-center justify-center h-[50vh] xl:mt-80  mt-32 lg:mt-56">
        {/* Content Section - Text Left, Video Right */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center justify-center max-w-7xl mx-auto text-center lg:text-left h-full flex flex-col lg:grid"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Text Content - Left Side */}
          <div className="space-y-8 flex flex-col justify-center">
            {/* Header */}
            <div>
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
                Nuestra Historia
              </h2>
              <p className="text-xl lg:text-2xl text-white opacity-90 leading-relaxed mb-8">
                NexoPay nació con una idea simple: que el crédito no debería ser un privilegio, sino una herramienta accesible para todos.
              </p>
            </div>
            
            <p className="text-lg lg:text-xl xl:text-2xl text-white opacity-80 font-medium leading-relaxed">
              En 2012, comenzamos como una plataforma de crédito digital enfocada en compras locales. Hoy seguimos creciendo para conectar a miles de personas con oportunidades reales de financiamiento y ayudar a los negocios a expandirse sin riesgo.
            </p>
          </div>

          {/* Video Container - Right Side */}
          <motion.div 
            className="flex justify-center items-center relative"
            variants={fadeInUpDelayed}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Background Shapes */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-secondary-400 rounded-full opacity-20 blur-sm"></div>
            <div className="absolute -bottom-12 -left-8 w-24 h-24 bg-primary-300 rounded-full opacity-30 blur-sm"></div>
            <div className="absolute top-1/2 -left-4 w-16 h-16 bg-white rounded-full opacity-10 blur-sm"></div>
            <div className="absolute -top-4 left-1/2 w-20 h-20 bg-secondary-500 rounded-full opacity-25 blur-sm"></div>
            
            <div className="relative w-full max-w-4xl aspect-video bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl border border-white border-opacity-20 overflow-hidden z-10">
              {/* Video */}
              <video 
                className="w-full h-full object-cover"
                autoPlay 
                muted 
                loop 
                playsInline
              >
                <source src="/src/assets/videos/mujer-comprando.mp4" type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
              
              {/* Video Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
    
    {/* Bottom Curve */}
    <div className="w-full">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#208eaa" fillOpacity="1" d="M0,128L120,138.7C240,149,480,171,720,165.3C960,160,1200,128,1320,112L1440,96L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"></path>
      </svg>
    </div>
    </>
  );
};

export { HistorySection };