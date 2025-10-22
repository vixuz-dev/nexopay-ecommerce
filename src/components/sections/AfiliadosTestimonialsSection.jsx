import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineStar } from 'react-icons/hi2';

const AfiliadosTestimonialsSection = () => {
  const testimonials = [
    {
      text: "Desde que implementamos NexoPay, nuestras ventas aumentaron 35%. Los clientes compran más y nosotros cobramos sin retrasos.",
      author: "Ferretería López, Michoacán"
    },
    {
      text: "Ahora ofrecemos pago a plazos sin preocuparnos por la cobranza. Es una herramienta clave para nuestro crecimiento.",
      author: "Tienda de Muebles Ramírez, CDMX"
    }
  ];

  const stats = [
    { number: "+1,200", label: "comercios afiliados" },
    { number: "+10,000", label: "clientes activos" },
    { number: "92%", label: "de satisfacción" }
  ];

  return (
    <section className="relative w-full bg-white py-20 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Título */}
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-600 mb-16 text-center"
          >
            Lo que nuestros proveedores dicen
          </motion.h2>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 + (index * 0.2) }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Quote */}
                <div className="mb-6">
                  <svg className="w-8 h-8 text-primary-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    "{testimonial.text}"
                  </p>
                  <p className="text-primary-600 font-semibold">
                    — {testimonial.author}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            className="grid grid-cols-3 xs:grid-cols-1 gap-4 xs:gap-4"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl xs:text-2xl font-bold text-primary-600 mb-1">
                  {stat.number}
                </div>
                <div className="text-xs xs:text-sm text-gray-700">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AfiliadosTestimonialsSection;
