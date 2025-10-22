import React from 'react';
import { motion } from 'framer-motion';
// import nexopayAppHand from '../../assets/images/nexopay-app-hand.png';
import nexopayAppHand from '../../assets/images/app-free-hand.png';

const HeroImage = () => {
  const imageVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut",
        delay: 1.2 // Delay después de que aparezca el texto
      }
    }
  };

  return (
    <div className="hidden lg:block absolute right-0 bottom-0 z-10">
      <motion.img
        src={nexopayAppHand}
        alt="NexoPay App - Compra y paga a tu ritmo"
        className="max-w-full h-auto drop-shadow-2xl"
        style={{ 
          height: 'calc(100vh - 120px)',
          maxWidth: '50vw'
        }}
        variants={imageVariants}
        initial="hidden"
        animate="visible"
      />
    </div>
  );
};

export { HeroImage };
