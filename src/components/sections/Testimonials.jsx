import React from 'react';
import { motion } from 'framer-motion';
import { HiStar, HiCheckBadge, HiShieldCheck, HiBuildingOffice } from 'react-icons/hi2';

const Testimonials = () => {
  const testimonials = [
    {
      text: "Con NexoPay compré mi refrigerador sin estrés. Pagué en 6 quincenas y todo fue transparente.",
      author: "María L.",
      location: "Guadalajara",
      role: "Usuario",
      rating: 5
    },
    {
      text: "Ahora mis clientes compran más gracias a NexoPay. Mis ventas crecieron 30%.",
      author: "Ferretería López",
      location: "Michoacán",
      role: "Proveedor",
      rating: 5
    }
  ];

  const stats = [
    { number: "4.9", label: "de satisfacción", icon: HiStar, color: "text-highlight-500" },
    { number: "+10,000", label: "usuarios felices", icon: HiCheckBadge, color: "text-primary-500" }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl lg:text-5xl font-medium text-primary-900 mb-4">
            Lo que nuestros usuarios dicen
          </h2>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8 mb-16 max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div 
                key={index} 
                className="text-center"
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div 
                  className="flex justify-center mb-1 md:mb-2"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <IconComponent className={`w-6 h-6 md:w-12 md:h-12 ${stat.color}`} />
                </motion.div>
                <div className="text-lg md:text-3xl lg:text-4xl font-bold text-primary-900 mb-1 md:mb-2">
                  {stat.number}
                </div>
                <div className="text-xs md:text-base text-primary-700 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300"
              variants={cardVariants}
              whileHover={{ 
                scale: 1.02, 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              {/* Rating */}
              <motion.div 
                className="flex items-center gap-1 mb-4"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.2 }}
              >
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                  >
                    <HiStar className="w-5 h-5 text-highlight-500" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Testimonial Text */}
              <blockquote className="text-primary-700 leading-relaxed mb-6">
                "{testimonial.text}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center"
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                >
                  <span className="text-primary-600 font-semibold text-sm">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </motion.div>
                <div>
                  <div className="font-semibold text-primary-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-primary-600">
                    {testimonial.location}
                  </div>
                  <div className="text-xs text-primary-500 uppercase tracking-wider">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div 
          className="text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-8 mb-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div 
              className="flex items-center gap-2 text-primary-600"
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <HiCheckBadge className="w-6 h-6 text-primary-500" />
              <span className="font-medium">Reseñas verificadas</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 text-primary-600"
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <HiCheckBadge className="w-6 h-6 text-secondary-500" />
              <span className="font-medium">Google Reviews</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 text-primary-600"
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <HiShieldCheck className="w-6 h-6 text-highlight-500" />
              <span className="font-medium">Seguridad bancaria</span>
            </motion.div>
          </motion.div>
          
          <motion.p 
            className="text-primary-600 text-sm"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2 }}
          >
            Todas las reseñas son verificadas y provienen de usuarios reales
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export { Testimonials };
