import React from 'react';

const AmountRequestedStep = ({ formData, updateFormData }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Cantidad Solicitada
        </h2>
        <p className="text-gray-600">
          Cuánto necesitas y cómo lo pagarás. El monto mínimo de solicitud es de $1,000 MXN.
        </p>
      </div>

      <div className="space-y-6">
        <p className="text-sm text-gray-500 italic">
          Los campos de monto y forma de pago se agregarán aquí
        </p>
      </div>
    </div>
  );
};

export default AmountRequestedStep;

