import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const AfiliadosWhatIsSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const advantageRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const description = descriptionRef.current;
    const advantage = advantageRef.current;

    if (section && title && subtitle && description && advantage) {
      // Set initial states
      gsap.set([title, subtitle, description, advantage], {
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

          gsap.to(subtitle, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.2
          });

          gsap.to(description, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.4
          });

          gsap.to(advantage, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.6
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
        <div className="max-w-4xl mx-auto text-center">
          {/* Título principal */}
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-600 mb-8 opacity-0"
            style={{ transform: 'translateY(50px)' }}
          >
            ¿QUÉ ES NEXOPAY PARA LOS PROVEEDORES?
          </h2>

          {/* Subtítulo */}
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl lg:text-3xl text-gray-800 leading-relaxed mb-8 opacity-0"
            style={{ transform: 'translateY(50px)' }}
          >
            NexoPay es una plataforma tecnológica que te permite ofrecer pago a plazos sin complicarte.
          </p>

          {/* Descripción */}
          <p 
            ref={descriptionRef}
            className="text-lg md:text-xl text-gray-700 leading-relaxed mb-12 opacity-0"
            style={{ transform: 'translateY(50px)' }}
          >
            Tus clientes compran de inmediato, NexoPay se encarga de gestionar los pagos, y tú recibes tu dinero puntualmente.
          </p>

          {/* Ventaja principal */}
          <div 
            ref={advantageRef}
            className="bg-primary-50 border-l-4 border-primary-500 p-8 rounded-r-2xl opacity-0"
            style={{ transform: 'translateY(50px)' }}
          >
            <h3 className="text-xl md:text-2xl font-bold text-primary-600 mb-4">
              Ventaja principal:
            </h3>
            <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
              No eres tú quien da crédito, NexoPay administra todo el proceso: validación, cobranza y gestión de riesgo.<br />
              <span className="font-semibold text-primary-600">Tú solo te enfocas en vender más.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AfiliadosWhatIsSection;
