import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImageTextSection } from '../common/ImageTextSection';
// Import specific images for each section
import inclusion1 from '../../assets/images/values/inclusion-1.jpg';
import inclusion2 from '../../assets/images/values/inclusion-2.jpg';
import crecimiento1 from '../../assets/images/values/crecimiento-1.jpg';
import crecimiento2 from '../../assets/images/values/crecimiento-2.jpg';
import bienestar1 from '../../assets/images/values/bienestar-1.jpg';
import bienestar2 from '../../assets/images/values/bienestar-2.jpg';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const ImpactCardsSection = () => {
  const sectionRef = useRef(null);
  const imageRefs = useRef([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Create scroll-triggered animations for each image pair
    imageRefs.current.forEach((imagePair, index) => {
      if (!imagePair) return;

      const [image1, image2] = imagePair;

      // Initial state: images separated
      gsap.set([image1, image2], {
        x: index % 2 === 0 ? -100 : 100, // Alternate direction
        opacity: 0.7,
        scale: 0.9
      });

      // ScrollTrigger for each image pair
      ScrollTrigger.create({
        trigger: imagePair[0].parentElement,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Calculate movement based on scroll progress
          const moveDistance = 100 * (1 - progress);
          const scaleValue = 0.9 + (0.1 * progress);
          const opacityValue = 0.7 + (0.3 * progress);
          
          // Animate images coming together
          gsap.to(image1, {
            x: index % 2 === 0 ? -moveDistance : moveDistance,
            scale: scaleValue,
            opacity: opacityValue,
            duration: 0.3,
            ease: "power2.out"
          });
          
          gsap.to(image2, {
            x: index % 2 === 0 ? moveDistance : -moveDistance,
            scale: scaleValue,
            opacity: opacityValue,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
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

  // Custom Impact Card Component with GSAP animations
  const AnimatedImpactCard = ({ title, description, reverse, index, image1, image2 }) => {
    const cardRef = useRef(null);
    const image1Ref = useRef(null);
    const image2Ref = useRef(null);

    useEffect(() => {
      if (!cardRef.current || !image1Ref.current || !image2Ref.current) return;

      // Store image refs for GSAP animation
      imageRefs.current[index] = [image1Ref.current, image2Ref.current];

      // Initial state: images separated
      gsap.set([image1Ref.current, image2Ref.current], {
        x: reverse ? 100 : -100,
        opacity: 0.7,
        scale: 0.9,
        rotation: reverse ? 5 : -5
      });

      // ScrollTrigger for this card
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Calculate movement based on scroll progress
          const moveDistance = 100 * (1 - progress);
          const scaleValue = 0.9 + (0.1 * progress);
          const opacityValue = 0.7 + (0.3 * progress);
          const rotationValue = (reverse ? 5 : -5) * (1 - progress);
          
          // Animate images coming together
          gsap.to(image1Ref.current, {
            x: reverse ? moveDistance : -moveDistance,
            scale: scaleValue,
            opacity: opacityValue,
            rotation: rotationValue,
            duration: 0.3,
            ease: "power2.out"
          });
          
          gsap.to(image2Ref.current, {
            x: reverse ? -moveDistance : moveDistance,
            scale: scaleValue,
            opacity: opacityValue,
            rotation: -rotationValue,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    }, [reverse, index]);

    return (
      <motion.div
        ref={cardRef}
        className={`grid grid-cols-1 md:flex md:flex-row items-center gap-8 md:gap-12 lg:gap-16 ${
          reverse ? 'md:flex-row-reverse' : ''
        }`}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Text Content */}
        <div className="flex-1 space-y-4 md:space-y-6 order-1">
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-600">
            {title}
          </h3>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-700">
            {description}
          </p>
        </div>

        {/* Images Container */}
        <div className="flex-1 relative order-2 md:order-none">
          <div className="relative w-full aspect-square max-w-sm md:max-w-md lg:max-w-lg mx-auto">
            {/* First Image */}
            <div 
              ref={image1Ref}
              className="absolute inset-0 w-3/4 h-3/4 rounded-2xl overflow-hidden shadow-2xl"
              style={{ zIndex: 2 }}
            >
              <img 
                src={image1} 
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Second Image */}
            <div 
              ref={image2Ref}
              className="absolute -bottom-8 -right-8 w-3/4 h-3/4 rounded-2xl overflow-hidden shadow-2xl"
              style={{ zIndex: 1 }}
            >
              <img 
                src={image2} 
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section ref={sectionRef} className="relative w-full bg-white py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="space-y-24">
          {/* Extra spacing between Crecimiento and Bienestar */}
          <style jsx>{`
            .crecimiento-section {
              margin-bottom: 8rem;
            }
            .bienestar-section {
              margin-top: 8rem;
            }
          `}</style>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <AnimatedImpactCard
              title="Inclusión"
              description="Personas que por primera vez acceden a crédito, rompiendo barreras financieras y abriendo nuevas oportunidades para cumplir sus metas y sueños."
              reverse={false}
              index={0}
              image1={inclusion1}
              image2={inclusion2}
            />

            <div className="crecimiento-section">
              <AnimatedImpactCard
                title="Crecimiento"
                description="Comercios locales que venden más y crecen, expandiendo su alcance y conectando con nuevos clientes a través de soluciones de pago flexibles."
                reverse={true}
                index={1}
                image1={crecimiento1}
                image2={crecimiento2}
              />
            </div>

            <div className="bienestar-section">
              <AnimatedImpactCard
                title="Bienestar"
                description="Familias que logran adquirir lo que necesitan, sin endeudarse de más, construyendo un futuro financiero más estable y próspero."
                reverse={false}
                index={2}
                image1={bienestar1}
                image2={bienestar2}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export { ImpactCardsSection };
