import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HiOutlineCreditCard } from 'react-icons/hi2';

gsap.registerPlugin(ScrollTrigger);

const SolicitarCreditoIntroSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);
  const microcopyRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const description = descriptionRef.current;
    const cta = ctaRef.current;
    const microcopy = microcopyRef.current;

    if (section && title && subtitle && description && cta && microcopy) {
      gsap.set([title, subtitle, description, cta, microcopy], { opacity: 0, y: 50 });

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => {
          gsap.to(title, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });
          gsap.to(subtitle, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.2 });
          gsap.to(description, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.4 });
          gsap.to(cta, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.6 });
          gsap.to(microcopy, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.8 });
        },
        once: true,
      });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white py-20 lg:py-32"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-600 leading-tight mb-6"
          >
            Compra hoy.<br />Paga a tu ritmo.
          </h2>
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8"
          >
            Con NexoPay, obtienes una línea de crédito digital para comprar en tus tiendas favoritas y pagar en quincenas, sin buró y sin trámites complicados.
          </p>
          <p
            ref={descriptionRef}
            className="text-lg md:text-xl text-gray-700 leading-relaxed mb-10"
          >
            Todo el proceso se realiza dentro de nuestra plataforma: rápido, seguro y 100% en línea.<br />
            No necesitas tarjeta, aval ni integraciones externas.
          </p>
          <div ref={ctaRef} className="mb-6">
            <motion.a
              href="/registro"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center mx-auto gap-2 max-w-xs"
            >
              <HiOutlineCreditCard className="w-5 h-5" />
              Comenzar mi solicitud
            </motion.a>
          </div>
          <p ref={microcopyRef} className="text-sm text-gray-600">
            Respuesta en minutos | Sin buró | 100% digital
          </p>
        </div>
      </div>
    </section>
  );
};

export default SolicitarCreditoIntroSection;
