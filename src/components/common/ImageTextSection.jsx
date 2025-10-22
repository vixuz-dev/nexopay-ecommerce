import React from 'react';
import { motion } from 'framer-motion';

const ImageTextSection = ({ 
  title, 
  description, 
  image1, 
  image2, 
  reverse = false,
  className = "",
  titleColor = "text-primary-600",
  descriptionColor = "text-gray-700"
}) => {
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

  return (
    <section className={`py-16 lg:py-24 ${className}`}>
      <div className="container mx-auto px-4">
        <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-16`}>
          {/* Images Section */}
          <div className="w-full lg:w-1/2">
            <motion.div 
              className="relative"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {/* First Image */}
              <div className="relative">
                <img 
                  src={image1} 
                  alt={title}
                  className="w-full aspect-square object-cover rounded-2xl shadow-lg"
                />
              </div>
              
              {/* Second Image - Overlapping */}
              <div className="absolute -bottom-8 -right-8 w-3/4 aspect-square">
                <img 
                  src={image2} 
                  alt={title}
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
              </div>
            </motion.div>
          </div>

          {/* Text Section */}
          <div className="w-full lg:w-1/2">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.h2 
                className={`text-3xl lg:text-5xl font-bold ${titleColor} leading-tight mb-6`}
                variants={fadeInUp}
              >
                {title}
              </motion.h2>
              
              <motion.p 
                className={`text-lg lg:text-xl ${descriptionColor} leading-relaxed`}
                variants={fadeInUp}
              >
                {description}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { ImageTextSection };
