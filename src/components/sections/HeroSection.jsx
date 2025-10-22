import React from 'react';
import { HeroContent } from './HeroContent';
import { HeroImage } from './HeroImage';

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-primary-500 flex items-center py-8 lg:py-0 pt-24 relative">
      <div className="container mx-auto px-4 w-full">
        <div className="flex justify-center lg:justify-start lg:max-w-[50%]">
          <HeroContent />
        </div>
        <HeroImage />
      </div>
    </section>
  );
};

export { HeroSection };
