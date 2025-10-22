import React from 'react';
import { SEO } from '../components/common/SEO';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import AboutHeroSection from '../components/sections/AboutHeroSection';
import { MissionRevealSection } from '../components/sections/MissionRevealSection';
import { VisionRevealSection } from '../components/sections/VisionRevealSection';
import { ValuesSection } from '../components/sections/ValuesSection';
import { ImpactSection } from '../components/sections/ImpactSection';
import { ImpactCardsSection } from '../components/sections/ImpactCardsSection';
import { HistorySection } from '../components/sections/HistorySection';
import { FutureVisionSection } from '../components/sections/FutureVisionSection';
import { AboutFinalCTA } from '../components/sections/AboutFinalCTA';

const About = () => {
  const keywords = [
    'fintech mexicana',
    'crédito digital',
    'pago a plazos',
    'inclusión financiera',
    'crédito sin buró',
    'empresa fintech México',
    'crédito responsable',
    'tecnología financiera para comercios',
    'innovación en pagos México'
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': 'Sobre NexoPay',
    'description': 'Conoce NexoPay, la fintech mexicana que impulsa el acceso al crédito responsable con tecnología, datos y empatía.',
    'mainEntity': {
      '@type': 'Organization',
      'name': 'NexoPay',
      'url': 'https://nexopay.com',
      'logo': 'https://nexopay.com/logo.png',
      'sameAs': [
        'https://www.facebook.com/',
        'https://www.linkedin.com/',
        'https://twitter.com/'
      ],
      'founder': [{ '@type': 'Person', 'name': 'Founder Name' }],
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
    <div className="min-h-screen bg-white">
      <SEO
        title="NexoPay | Sobre nosotros"
        description="Conoce NexoPay, la fintech mexicana que impulsa el acceso al crédito responsable con tecnología, datos y empatía. Compra hoy, paga a tu ritmo."
        keywords={keywords}
        schema={schema}
      />
      <Header />
      <main>
        {/* Hero Section */}
        <AboutHeroSection />

        {/* Mission Reveal Section */}
        <MissionRevealSection />

        {/* Vision Reveal Section */}
        <VisionRevealSection />

        {/* Values Section */}
        <ValuesSection />

        {/* Impact Section */}
        <ImpactSection />

        {/* Impact Cards Section */}
        <ImpactCardsSection />

        {/* History Section */}
        <HistorySection />

        {/* Future Vision Section */}
        <FutureVisionSection />

        {/* Final CTA Section */}
        <AboutFinalCTA />

  
      </main>
      <Footer />
    </div>
  );
};

export default About;
