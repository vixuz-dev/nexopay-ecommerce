import React from 'react';
import androidIcon from '../../assets/images/android.png';

const HeroStats = () => {
  const stats = [
    {
      label: 'Usuarios activos',
      value: '5000+',
      color: 'text-white'
    },
    {
      label: 'Proveedores disponibles',
      value: '100+',
      color: 'text-white'
    }
  ];

  return (
    <div className="text-white relative">
      <div className="flex items-center justify-center gap-16">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <p className="text-sm font-light mb-2">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-8 border-t border-white/20">
        <p className="text-sm font-light leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
      
      <div className="absolute bottom-8 left-0 flex justify-start">
        <img src={androidIcon} alt="Android" className="w-32 h-32" />
      </div>
    </div>
  );
};

export { HeroStats };
