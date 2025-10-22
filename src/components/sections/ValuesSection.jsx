import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HiOutlineHeart, HiOutlineLightBulb, HiOutlineUsers, HiOutlineShieldCheck } from 'react-icons/hi2';
import ninoComprandoImage from '../../assets/images/valores.jpg';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const ValuesSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const valuesRef = useRef([]);

  const values = [
    {
      icon: HiOutlineHeart,
      title: "Confianza",
      description: "Operamos con transparencia y responsabilidad. Queremos que nuestros usuarios comprendan cada paso de su crédito."
    },
    {
      icon: HiOutlineLightBulb,
      title: "Innovación",
      description: "Usamos tecnología para simplificar procesos y crear experiencias financieras más humanas."
    },
    {
      icon: HiOutlineUsers,
      title: "Inclusión",
      description: "Construimos un modelo donde todos pueden acceder a crédito, sin importar su historial."
    },
    {
      icon: HiOutlineShieldCheck,
      title: "Responsabilidad",
      description: "Actuamos con ética y claridad, protegiendo los datos y el bienestar de nuestros usuarios."
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const valueCards = valuesRef.current;

    if (!section || !title || !subtitle) return;

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

        // Animate value cards
        gsap.to(valueCards, {
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
        gsap.set([title, subtitle, ...valueCards], {
          opacity: 0,
          y: 50
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

        gsap.to(valueCards, {
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
      className="relative w-full min-h-screen bg-white"
    >
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Image (50%) - Hidden on mobile */}
        <div className="hidden lg:block w-full lg:w-1/2 h-96 lg:h-auto relative flex-1 overflow-hidden">
          <svg viewBox="0 0 600 530" width="100%" height="100%" className="absolute inset-0">
            <defs>
              <clipPath id="stripeMask" clipPathUnits="userSpaceOnUse">
                <path d="M0,0 H240 a40,40 0 0 1 40,40 a40,40 0 0 1 -40,40 H0 Z" />
                <path d="M0,90 H390 a40,40 0 0 1 40,40 a40,40 0 0 1 -40,40 H0 Z" />
                <path d="M0,180 H540 a40,40 0 0 1 40,40 a40,40 0 0 1 -40,40 H0 Z" />
                <path d="M0,270 H440 a40,40 0 0 1 40,40 a40,40 0 0 1 -40,40 H0 Z" />
                <path d="M0,360 H490 a40,40 0 0 1 40,40 a40,40 0 0 1 -40,40 H0 Z" />
                <path d="M0,450 H340 a40,40 0 0 1 40,40 a40,40 0 0 1 -40,40 H0 Z" />
              </clipPath>
            </defs>
            <image
              href={ninoComprandoImage}
              width="600"
              height="530"
              clipPath="url(#stripeMask)"
              preserveAspectRatio="xMidYMid slice"
              className="transform scale-100 hover:scale-95 transition-transform duration-700"
            />
          </svg>
        </div>

        {/* Right Side - Content (50%) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 lg:p-12">
          {/* Header */}
          <div className="mb-8 lg:mb-12 text-left">
            <h2 
              ref={titleRef}
              className="text-4xl lg:text-5xl font-bold text-primary-500 leading-tight mb-6 opacity-0"
              style={{ transform: 'translateY(50px)' }}
            >
              Nuestros Valores
            </h2>
            <p 
              ref={subtitleRef}
              className="text-xl lg:text-2xl text-gray-700 leading-relaxed opacity-0"
              style={{ transform: 'translateY(30px)' }}
            >
              En NexoPay, cada decisión se guía por principios que nos definen:
            </p>
          </div>

          {/* Values Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  ref={el => valuesRef.current[index] = el}
                  className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 opacity-0 aspect-square flex flex-col items-center justify-center text-center"
                  style={{ transform: 'translateY(50px)' }}
                >
                  {/* Icon */}
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary-500 rounded-full flex items-center justify-center mb-3 lg:mb-4">
                    <IconComponent className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg lg:text-xl font-bold text-primary-500 mb-2 lg:mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-xs lg:text-sm">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export { ValuesSection };
