import React from 'react';
import { FAQ } from '../common/FAQ';

const FAQCreditoSection = () => {
  const faqs = [
    {
      question: "¿Cuánto puedo solicitar en mi primera línea de crédito?",
      answer: "Depende de tu evaluación inicial. Comienza con un monto accesible y aumenta conforme pagues puntualmente."
    },
    {
      question: "¿Qué pasa si me atraso en un pago?",
      answer: "Contamos con recordatorios automáticos y opciones de regularización. La transparencia es clave."
    },
    {
      question: "¿Puedo usar mi crédito en cualquier tienda?",
      answer: "Solo en los comercios afiliados a NexoPay, disponibles en la app o plataforma."
    },
    {
      question: "¿Cuánto tarda la aprobación?",
      answer: "Generalmente menos de 10 minutos."
    }
  ];

  return (
    <section className="relative w-full bg-white py-20 lg:py-32">
      <div className="container mx-auto px-6">
        <FAQ 
          faqs={faqs}
          title="Antes de solicitar, quizá te preguntes…"
          subtitle="Resolvemos las dudas más comunes sobre solicitar tu crédito con NexoPay"
          showCTA={true}
          ctaText="Ver todas las preguntas frecuentes"
        />
      </div>
    </section>
  );
};

export default FAQCreditoSection;
