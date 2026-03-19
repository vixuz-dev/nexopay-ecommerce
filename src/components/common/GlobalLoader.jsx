import React from 'react';
import useUIStore from '../../stores/uiStore';

const GlobalLoader = () => {
  const isOpen = useUIStore((s) => s.isGlobalLoaderOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-xl bg-white px-8 py-6 shadow-xl">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-200 border-t-primary-600" />
        <p className="text-sm font-medium text-gray-700">Creando tu orden...</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
