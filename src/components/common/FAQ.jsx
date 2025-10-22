import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi2';

const FAQ = ({ faqs, title = "Preguntas Frecuentes", subtitle = "Resolvemos las dudas más comunes", showCTA = false, ctaText = "Ver todas las preguntas frecuentes" }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-600 leading-tight mb-6">
          {title}
        </h2>
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
          {subtitle}
        </p>
      </motion.div>

      {/* FAQ Items */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="space-y-4"
      >
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
            >
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 pr-4">
                {faq.question}
              </h3>
              <div className="flex-shrink-0">
                {openIndex === index ? (
                  <HiOutlineChevronUp className="w-6 h-6 text-primary-600" />
                ) : (
                  <HiOutlineChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </div>
            </button>
            
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      {/* Optional CTA */}
      {showCTA && (
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-transparent border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-600 hover:text-white transition-all duration-300"
          >
            {ctaText}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export { FAQ };
