import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HiOutlineStar } from 'react-icons/hi2';
import { TopCurve } from '../common/TopCurve';
import { BottomCurve } from '../common/BottomCurve';

gsap.registerPlugin(ScrollTrigger);

const TestimonialsCreditoSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const testimonialsRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const testimonials = testimonialsRef.current;

    if (section && title && testimonials) {
      gsap.set([title, testimonials], { opacity: 0, y: 50 });

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => {
          gsap.to(title, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });
          gsap.to(testimonials, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.2 });
        },
        once: true,
      });
    }
  }, []);

  const testimonials = [
    {
      quote: "Fue facilísimo. Pedí mi crédito y en menos de 10 minutos ya podía comprar mi refri.",
      author: "María L., Guadalajara"
    },
    {
      quote: "Pagué mi celular en 6 quincenas, sin intereses ocultos ni llamadas molestas.",
      author: "David P., Morelia"
    }
  ];

  return (
    <>
      {/* Main Section - Blue Background */}
      <section 
        ref={sectionRef}
        className="relative w-full bg-primary-500 py-20 lg:py-32"
      >
        {/* Top Curve - White - Inside section at top */}
        <div className="absolute top-0 left-0 w-full">
          <TopCurve />
        </div>

        <div className="container mx-auto px-6 mt-28 xl:mt-48 lg:mt-32">
          <div className="max-w-6xl mx-auto">
            {/* Title */}
            <div ref={titleRef} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                Lo que nuestros usuarios dicen de NexoPay
              </h2>
            </div>

            {/* Testimonials Grid */}
            <div ref={testimonialsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.3 }}
                  className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-30 rounded-2xl p-8 text-center hover:bg-opacity-20 transition-all duration-300"
                >
                  {/* Star Rating */}
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <HiOutlineStar key={i} className="w-6 h-6 text-yellow-400 mx-1" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl text-white leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="text-white opacity-90 font-medium">
                    — {testimonial.author}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Curve - Blue */}
      <BottomCurve />
    </>
  );
};

export default TestimonialsCreditoSection;
