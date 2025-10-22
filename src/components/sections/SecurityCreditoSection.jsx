import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  HiOutlineShieldCheck, 
  HiOutlineLockClosed, 
  HiOutlineServer 
} from 'react-icons/hi2';

gsap.registerPlugin(ScrollTrigger);

const SecurityCreditoSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const securityBadgeRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const content = contentRef.current;
    const securityBadge = securityBadgeRef.current;

    if (section && title && content && securityBadge) {
      gsap.set([title, content, securityBadge], { opacity: 0, y: 50 });

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => {
          gsap.to(title, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });
          gsap.to(content, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.2 });
          gsap.to(securityBadge, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.4 });
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
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div ref={titleRef} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-600 leading-tight mb-6">
              Tu información, siempre protegida.
            </h2>
          </div>

          {/* Content */}
          <div ref={contentRef} className="text-center mb-12">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
              En NexoPay usamos tecnología de validación segura y encriptación avanzada para proteger tus datos.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Tus solicitudes son procesadas directamente dentro de la plataforma, sin intermediarios ni sistemas externos.
            </p>
          </div>

          {/* Security Visual */}
          <div ref={securityBadgeRef} className="flex flex-col items-center">
            {/* Security Icon */}
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
              <HiOutlineShieldCheck className="w-12 h-12 text-primary-600" />
            </div>

            {/* Security Badge */}
            <div className="bg-primary-500 text-white px-8 py-4 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3">
                <HiOutlineLockClosed className="w-6 h-6" />
                <span className="font-bold text-lg">
                  Plataforma certificada – Comunicación cifrada SSL
                </span>
              </div>
            </div>

            {/* Additional Security Icons */}
            <div className="flex items-center gap-8 mt-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <HiOutlineShieldCheck className="w-8 h-8 text-green-600" />
                </div>
                <span className="text-sm text-gray-600 font-medium">Validación segura</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <HiOutlineServer className="w-8 h-8 text-blue-600" />
                </div>
                <span className="text-sm text-gray-600 font-medium">Procesamiento directo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityCreditoSection;
