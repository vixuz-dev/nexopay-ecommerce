import React from 'react';

const Hero = () => {
  return (
    <section className="hero-gradient text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-black mb-6">
          Modern Payment Solutions
        </h1>
        <p className="text-xl font-light mb-8 max-w-2xl mx-auto">
          Secure, fast, and reliable payment processing for businesses of all sizes.
          Start accepting payments today with NexoPay.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-primary-500 font-semibold py-3 px-8 rounded-lg hover:bg-neutral-100 transition duration-200 shadow-glow">
            Get Started
          </button>
          <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-primary-500 transition duration-200">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export { Hero };
