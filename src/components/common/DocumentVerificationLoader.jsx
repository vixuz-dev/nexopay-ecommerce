import React, { useState, useEffect } from 'react';

const VERIFICATION_MESSAGES = [
  'Analizando tu documento',
  'Obteniendo datos',
  'Espera un poco'
];

const MESSAGE_INTERVAL_MS = 2000;

function DocumentVerificationLoader() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % VERIFICATION_MESSAGES.length);
    }, MESSAGE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 py-12 px-4 min-h-[200px]">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-200 border-t-primary-600" />
      <p className="text-sm font-medium text-primary-700 transition-opacity duration-300">
        {VERIFICATION_MESSAGES[messageIndex]}
      </p>
    </div>
  );
}

export default DocumentVerificationLoader;
