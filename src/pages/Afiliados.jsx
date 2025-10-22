import React from 'react';
import { SEO } from '../components/common/SEO';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import AfiliadosHeroSection from '../components/sections/AfiliadosHeroSection';
import AfiliadosWhatIsSection from '../components/sections/AfiliadosWhatIsSection';
import AfiliadosBenefitsSection from '../components/sections/AfiliadosBenefitsSection';
import AfiliadosHowItWorksSection from '../components/sections/AfiliadosHowItWorksSection';
import AfiliadosToolsSection from '../components/sections/AfiliadosToolsSection';
import AfiliadosWhyChooseSection from '../components/sections/AfiliadosWhyChooseSection';
import AfiliadosTestimonialsSection from '../components/sections/AfiliadosTestimonialsSection';
import AfiliadosFinalCTASection from '../components/sections/AfiliadosFinalCTASection';
import AfiliadosBottomCurve from '../components/common/AfiliadosBottomCurve';

const Afiliados = () => {
  const keywords = [
    'proveedores NexoPay',
    'fintech para comercios',
    'pago a plazos',
    'crédito digital México',
    'vender con NexoPay',
    'aumentar ventas con fintech',
    'crédito para clientes México',
    'solución BNPL para negocios',
    'método de pago a plazos México'
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'NexoPay',
    'description': 'Plataforma de crédito digital para comercios en México',
    'url': 'https://nexopay.com/proveedores',
    'logo': 'https://nexopay.com/logo.png',
    'sameAs': [
      'https://www.facebook.com/',
      'https://www.linkedin.com/',
      'https://twitter.com/'
    ],
    'offers': {
      '@type': 'Offer',
      'name': 'Solución de pago a plazos para comercios',
      'description': 'Permite a tus clientes comprar en quincenas mientras tú recibes tus pagos seguros',
      'category': 'Fintech para comercios'
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Proveedores NexoPay"
        description="Con NexoPay, tus clientes compran en quincenas y tú recibes tus pagos seguros. Sin riesgo, sin buró y sin comisiones ocultas. Registra tu negocio hoy."
        keywords={keywords}
        schema={schema}
      />
      <Header />
      
      <main>
        {/* Hero Section */}
        <AfiliadosHeroSection />
        
        {/* Bottom Curve */}
        <AfiliadosBottomCurve />
        
        {/* What is NexoPay Section */}
        <AfiliadosWhatIsSection />
        
        {/* Benefits Section */}
        <AfiliadosBenefitsSection />
        
        {/* How It Works Section */}
        <AfiliadosHowItWorksSection />
        
        {/* Tools Section */}
        <AfiliadosToolsSection />
        
        {/* Why Choose Section */}
        <AfiliadosWhyChooseSection />
        
        {/* Testimonials Section */}
        <AfiliadosTestimonialsSection />
        
        {/* Final CTA Section */}
        <AfiliadosFinalCTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Afiliados;
