import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TopCurve } from '../common/TopCurve';
import { ImageTextSection } from '../common/ImageTextSection';
import { AnimatedCounter } from '../common/AnimatedCounter';
import inclusionImage from '../../assets/images/inclusion.jpg';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const ImpactSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const statsRef = useRef([]);
  const storiesRef = useRef([]);

  const stats = [
    {
      number: "+10,000",
      label: "usuarios activos"
    },
    {
      number: "+1,200",
      label: "comercios afiliados"
    },
    {
      number: "92%",
      label: "de satisfacción"
    },
    {
      number: "0%",
      label: "comisiones ocultas"
    }
  ];

  const stories = [
    "Personas que por primera vez acceden a crédito.",
    "Comercios locales que venden más y crecen.",
    "Familias que logran adquirir lo que necesitan, sin endeudarse de más."
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const description = descriptionRef.current;
    const statCards = statsRef.current;
    const storyItems = storiesRef.current;

    if (!section || !title || !subtitle || !description) return;

    // Create ScrollTrigger for animations
    ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => {
        // Animate title
        gsap.to(title, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out"
        });

        // Animate subtitle
        gsap.to(subtitle, {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
          delay: 0.3
        });

        // Animate description
        gsap.to(description, {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
          delay: 0.6
        });

        // Animate story items
        gsap.to(storyItems, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.9
        });

        // Animate stat cards
        gsap.to(statCards, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)",
          delay: 1.2
        });
      },
      onLeave: () => {
        // Reset animations when leaving
        gsap.set([title, subtitle, description, ...storyItems, ...statCards], {
          opacity: 0,
          y: 50,
          scale: 0.8
        });
      },
      onEnterBack: () => {
        // Re-animate when scrolling back up
        gsap.to(title, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out"
        });

        gsap.to(subtitle, {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
          delay: 0.3
        });

        gsap.to(description, {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
          delay: 0.6
        });

        gsap.to(storyItems, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.9
        });

        gsap.to(statCards, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)",
          delay: 1.2
        });
      }
    });

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
    <>
    <section 
      ref={sectionRef}
      className="relative w-full min-h-screen bg-primary-500 py-20 lg:py-32"
    >
      <div className="absolute top-0 left-0 w-full">
        <TopCurve />
      </div>
      <div className="container mx-auto px-4 pt-52">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 
            ref={titleRef}
            className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6 opacity-0"
            style={{ transform: 'translateY(50px)' }}
          >
            NUESTRO IMPACTO
          </h2>
          <p 
            ref={subtitleRef}
            className="text-xl lg:text-2xl text-white opacity-90 max-w-4xl mx-auto leading-relaxed"
            style={{ transform: 'translateY(30px)', opacity: 0 }}
          >
            Cada transacción con NexoPay representa una historia real de inclusión financiera y crecimiento.
          </p>
        </div>



     

        {/* Quote Section */}
        <div 
          ref={descriptionRef}
          className="text-center mb-16 opacity-0"
          style={{ transform: 'translateY(30px)' }}
        >
          <div className="max-w-5xl mx-auto">
            <blockquote className="text-3xl lg:text-5xl text-white font-bold italic tracking-wider" style={{ lineHeight: '1.2' }}>
              "Estamos creando un ecosistema donde la tecnología y la confianza se unen para abrir oportunidades."
            </blockquote>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              ref={el => statsRef.current[index] = el}
              className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white border-opacity-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-3xl lg:text-4xl font-bold text-primary-500 mb-2">
                <AnimatedCounter 
                  end={parseInt(stat.number.replace(/[^\d]/g, ''))} 
                  suffix={stat.number.includes('%') ? '%' : stat.number.includes('+') ? '+' : ''}
                  duration={2}
                />
              </div>
              <div className="text-primary-600 font-semibold text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Gradient overlay at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-500 to-transparent"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0)',
          mask: 'linear-gradient(to bottom, transparent 0%, transparent 10%, black 35%, black 100%)'
        }}
      ></div>
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

export { ImpactSection };
