import React from 'react';
import { motion } from 'framer-motion';

const PartnerBrands = () => {
  const partnerLogos = [
    { 
      name: "Coppel", 
      category: "Retail",
      logo: "https://logowik.com/content/uploads/images/coppel4007.logowik.com.webp"
    },
    { 
      name: "Liverpool", 
      category: "Retail",
      logo: "https://www.tauro.mx/wp-content/uploads/2017/01/liverpool-logo.jpg"
    },
    { 
      name: "Palacio de Hierro", 
      category: "Retail",
      logo: "https://cdn.freebiesupply.com/logos/large/2x/el-palacio-de-hierro-logo-black-and-white.png"
    },
    { 
      name: "Sears", 
      category: "Retail",
      logo: "https://res.cloudinary.com/dffufplmy/image/upload/v1573150528/f50bzapkzpyaq0mezvzi.png"
    },
    { 
      name: "Farmacias Guadalajara", 
      category: "Farmacia",
      logo: "https://thepoint.com.mx/wp-content/uploads/2022/09/farmacia-guadalajara-e1663854661466.jpg"
    },
    { 
      name: "OXXO", 
      category: "Conveniencia",
      logo: "https://download.logo.wine/logo/OXXO/OXXO-Logo.wine.png"
    },
    { 
      name: "Walmart", 
      category: "Supermercado",
      logo: "https://1000marcas.net/wp-content/uploads/2020/02/Walmart-Logo.png"
    },
    { 
      name: "Soriana", 
      category: "Supermercado",
      logo: "https://images.seeklogo.com/logo-png/35/1/soriana-logo-png_seeklogo-355434.png"
    }
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
        staggerChildren: 0.1
      }
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.8 },
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
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-primary-900 mb-6">
            Donde ya puedes usar NexoPay
          </h2>
          <p className="text-lg text-primary-700 leading-relaxed max-w-3xl mx-auto">
            Estamos creciendo junto a cientos de comercios locales y nacionales.
            Encuentra NexoPay en tiendas de tecnología, muebles, motos, electrodomésticos y más.
          </p>
        </motion.div>

        {/* Partner Logos Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {partnerLogos.map((partner, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-lg p-4 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-neutral-200 flex flex-col items-center justify-center min-h-[100px]"
              variants={logoVariants}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <motion.img 
                src={partner.logo} 
                alt={`${partner.name} logo`}
                className="max-h-12 max-w-full object-contain mb-2"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.2 }
                }}
              />
              <div className="text-sm font-bold text-primary-900 mb-1" style={{display: 'none'}}>{partner.name}</div>
              <div className="text-xs text-primary-600">{partner.category}</div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* More Partners Indicator */}
        <motion.div 
          className="text-center mt-8"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div 
            className="bg-primary-100 rounded-lg p-4 inline-block"
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            <span className="text-primary-700 font-medium">+100 comercios más</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export { PartnerBrands };
