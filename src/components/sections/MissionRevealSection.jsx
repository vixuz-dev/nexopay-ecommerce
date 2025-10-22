import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { HiOutlineHeart, HiOutlineShieldCheck, HiOutlineUsers } from 'react-icons/hi2';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const MissionRevealSection = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const introRef = useRef(null);
  const cardsRef = useRef([]);

  const missionCards = [
    {
      icon: HiOutlineHeart,
      title: "Inclusión",
      description: "Democratizamos el acceso al crédito para que todos puedan comprar lo que necesitan, sin importar su historial crediticio o situación económica.",
      cta: "Conoce más"
    },
    {
      icon: HiOutlineShieldCheck,
      title: "Transparencia",
      description: "Ofrecemos soluciones simples, seguras y transparentes que ayudan a las personas a cumplir sus metas sin sorpresas ni comisiones ocultas.",
      cta: "Conoce más"
    },
    {
      icon: HiOutlineUsers,
      title: "Crecimiento",
      description: "Ayudamos a los comercios a vender más y crecer, conectando a las personas con oportunidades reales de financiamiento.",
      cta: "Conoce más"
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const intro = introRef.current;
    const cards = cardsRef.current;

    if (!section || !header || !intro) return;

    // Create ScrollTrigger for animations
    ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => {
        // Animate header
        gsap.to(header, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out"
        });

        // Animate intro
        gsap.to(intro, {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
          delay: 0.3
        });

        // Animate cards
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.6
        });
      },
      onLeave: () => {
        // Reset animations when leaving
        gsap.set([header, intro, ...cards], {
          opacity: 0,
          y: 50
        });
      },
      onEnterBack: () => {
        // Re-animate when scrolling back up
        gsap.to(header, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out"
        });

        gsap.to(intro, {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
          delay: 0.3
        });

        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.6
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
    <section 
      ref={sectionRef}
      className="relative w-full min-h-screen bg-white py-20 lg:py-32"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h1 
            ref={headerRef}
            className="text-4xl lg:text-6xl font-bold text-primary-500 leading-tight mb-6 opacity-0"
            style={{ transform: 'translateY(50px)' }}
          >
            NUESTRA MISIÓN
          </h1>
          <p 
            ref={introRef}
            className="text-xl lg:text-2xl text-primary-600 max-w-4xl mx-auto leading-relaxed opacity-0"
            style={{ transform: 'translateY(30px)' }}
          >
            Democratizar el acceso al crédito en América Latina, ofreciendo soluciones simples, seguras y transparentes que ayuden a las personas a cumplir sus metas y a los comercios a vender más.
          </p>
        </div>

        {/* Mission Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {missionCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                ref={el => cardsRef.current[index] = el}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 opacity-0"
                style={{ transform: 'translateY(50px)' }}
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-primary-600 text-center mb-4">
                  {card.title}
                </h3>
                
                {/* Description */}
                <p className="text-primary-500 text-center leading-relaxed mb-6">
                  {card.description}
                </p>
                
                {/* CTA */}
                <div className="text-center">
                  <button className="text-primary-500 font-bold uppercase hover:text-primary-600 transition-colors duration-200">
                    {card.cta} →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export { MissionRevealSection };
