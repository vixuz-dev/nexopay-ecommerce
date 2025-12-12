import React from 'react';

const ProductPlaceholder = ({ name, className = '' }) => {
  const initials = name
    ? name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'PR';

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 ${className}`}
    >
      <div className="text-center p-8">
        <div className="text-4xl font-bold text-gray-500 mb-2">{initials}</div>
        <div className="text-sm text-gray-600 font-medium">{name || 'Producto'}</div>
      </div>
    </div>
  );
};

export default ProductPlaceholder;

