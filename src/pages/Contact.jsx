import React from 'react';
import { SEO } from '../components/common/SEO';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import ContactHeroSection from '../components/sections/ContactHeroSection';
import ContactProfileSection from '../components/sections/ContactProfileSection';
import { ContactForm } from '../components/forms/ContactForm';
import ContactFinalSection from '../components/sections/ContactFinalSection';
import { TopCurve } from '../components/common/TopCurve';
import { BottomCurve } from '../components/common/BottomCurve';

const Contact = () => {
  const keywords = [
    'contacto NexoPay',
    'soporte NexoPay',
    'ayuda crédito digital',
    'fintech México contacto',
    'atención al cliente NexoPay',
    'soporte para proveedores NexoPay',
    'contacto fintech México'
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contacto NexoPay",
    "url": "https://www.nexopay.com/contacto",
    "description": "¿Tienes dudas sobre tu crédito o negocio con NexoPay? Contáctanos por WhatsApp, correo o formulario. Atención personalizada en menos de 24 horas.",
    "mainEntity": {
      "@type": "Organization",
      "name": "NexoPay",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": "Spanish"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Contacto NexoPay"
        description="¿Tienes dudas sobre tu crédito o negocio con NexoPay? Contáctanos por WhatsApp, correo o formulario. Atención personalizada en menos de 24 horas."
        keywords={keywords}
        schema={schema}
      />
      <Header />
      
      <main>
        {/* Hero Section */}
        <ContactHeroSection />
        
        {/* Contact Profile Section */}
        <ContactProfileSection />
        
        {/* Contact Form Section */}
        <section className="relative w-full bg-primary-500 py-20 lg:py-32">
          {/* Top Curve - White */}
          <div className="absolute top-0 left-0 w-full">
            <TopCurve />
          </div>
          
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <ContactForm />
            </div>
          </div>
        </section>
        
        {/* Bottom Curve - Blue */}
        <BottomCurve />
        
        {/* Final Section - FAQ + CTA */}
        <ContactFinalSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
