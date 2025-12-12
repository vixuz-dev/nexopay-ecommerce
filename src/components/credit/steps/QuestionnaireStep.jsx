import React from 'react';

const QuestionnaireStep = ({ formData, updateFormData }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Cuestionario
        </h2>
        <p className="text-gray-600">
          Se debe resolver un cuestionario de una cierta cantidad de preguntas, las cuales usamos para el scoring de crédito, este determina si es aprobado o no el usuario, así como la cantidad que se puede solicitar.
        </p>
      </div>

      <div className="space-y-6">
        <p className="text-sm text-gray-500 italic">
          El cuestionario se agregará aquí
        </p>
      </div>
    </div>
  );
};

export default QuestionnaireStep;

