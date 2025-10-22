import React from 'react';

const Features = () => {
  const features = [
    {
      title: 'Secure Payments',
      description: 'Bank-level security with end-to-end encryption',
      icon: '🔒',
      color: 'primary',
    },
    {
      title: 'Fast Processing',
      description: 'Lightning-fast payment processing in seconds',
      icon: '⚡',
      color: 'secondary',
    },
    {
      title: 'Global Reach',
      description: 'Accept payments from customers worldwide',
      icon: '🌍',
      color: 'highlight',
    },
    {
      title: 'Easy Integration',
      description: 'Simple APIs and plugins for any platform',
      icon: '🔧',
      color: 'primary',
    },
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'text-primary-500';
      case 'secondary':
        return 'text-secondary-500';
      case 'highlight':
        return 'text-highlight-500';
      default:
        return 'text-primary-500';
    }
  };

  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">
            Why Choose NexoPay?
          </h2>
          <p className="text-xl font-light text-neutral-600 max-w-2xl mx-auto">
            We provide everything you need to accept payments and grow your business.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card text-center hover:shadow-lg transition duration-300">
              <div className={`text-4xl mb-4 ${getColorClasses(feature.color)}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                {feature.title}
              </h3>
              <p className="font-normal text-neutral-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Features };
