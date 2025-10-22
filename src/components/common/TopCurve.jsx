import React from 'react';

const TopCurve = () => {
  return (
    <div className="w-full overflow-hidden">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1440 320"
        className="w-full h-auto"
        style={{ display: 'block' }}
      >
        <path 
          fill="#ffffff" 
          fillOpacity="1" 
          d="M0,128L120,138.7C240,149,480,171,720,165.3C960,160,1200,128,1320,112L1440,96L1440,0L1320,0C1200,0,960,0,720,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
      </svg>
    </div>
  );
};

export { TopCurve };
