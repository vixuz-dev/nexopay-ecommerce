import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import CreditWizard from '../components/credit/CreditWizard';
import { GoogleMapsProvider } from '../components/credit/GoogleMapsProvider';

const SolicitarCredito = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Solicitud de Crédito
              </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Completa los siguientes pasos para solicitar tu línea de crédito
          </p>
        </div>
        <GoogleMapsProvider>
          <CreditWizard />
        </GoogleMapsProvider>
      </div>
      <Footer />
    </div>
  );
};

export default SolicitarCredito;

