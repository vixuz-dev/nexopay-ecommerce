import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/sections/HeroSection';
import { HowItWorks } from '../components/sections/HowItWorks';
import { UserBenefits } from '../components/sections/UserBenefits';
import { ProviderBenefits } from '../components/sections/ProviderBenefits';
import { EducationalCTA } from '../components/sections/EducationalCTA';
import { PartnerBrands } from '../components/sections/PartnerBrands';
import { Testimonials } from '../components/sections/Testimonials';
import { FinalCTA } from '../components/sections/FinalCTA';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
        <UserBenefits />
        <ProviderBenefits />
        <EducationalCTA />
        <PartnerBrands />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
