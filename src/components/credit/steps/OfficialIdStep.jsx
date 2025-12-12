import React from 'react';
import { HiOutlineExclamationCircle, HiOutlineDocumentText } from 'react-icons/hi2';
import FileUploader from '../../common/FileUploader';
import { useCreditForm } from '../CreditWizard';

const OfficialIdStep = () => {
  const { formData, updateFormData } = useCreditForm();
  const officialIdData = formData.officialId || {};

  const handleFrontImageSelect = (file, imageUrl) => {
    updateFormData({
      officialId: {
        ...officialIdData,
        frontFile: file,
        frontUrl: imageUrl
      }
    });
  };

  const handleBackImageSelect = (file, imageUrl) => {
    updateFormData({
      officialId: {
        ...officialIdData,
        backFile: file,
        backUrl: imageUrl
      }
    });
  };

  const tips = [
    'Asegúrate de que todos los datos sean legibles',
    'Evita reflejos y sombras en el documento',
    'Toma la foto en un lugar bien iluminado',
    'El documento debe estar completo y sin cortes',
    'Verifica que la foto esté enfocada y nítida'
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Identificación Oficial
        </h2>
        <p className="text-gray-600">
          Sube la parte frontal y trasera de tu identificación. Asegúrate de que todos los datos sean legibles, evita rechazos por esto.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <HiOutlineExclamationCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-2 text-sm">
                Consejos para una foto legible
              </h3>
              <ul className="space-y-1">
                {tips.map((tip, index) => (
                  <li key={index} className="text-xs text-amber-800 flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <HiOutlineDocumentText className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">
                Parte frontal
              </h3>
            </div>
            <FileUploader
              onFileSelect={handleFrontImageSelect}
              currentFile={officialIdData.frontUrl}
              accept="image/*"
              maxSizeMB={5}
              label="Sube la foto"
              description="Arrastra y suelta o haz clic para seleccionar"
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <HiOutlineDocumentText className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">
                Parte trasera
              </h3>
            </div>
            <FileUploader
              onFileSelect={handleBackImageSelect}
              currentFile={officialIdData.backUrl}
              accept="image/*"
              maxSizeMB={5}
              label="Sube la foto"
              description="Arrastra y suelta o haz clic para seleccionar"
            />
          </div>
        </div>

        {officialIdData.frontUrl && officialIdData.backUrl && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <HiOutlineCheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm font-semibold text-green-800 leading-relaxed">
                Ambas partes de tu identificación han sido cargadas correctamente. Verifica que todos los datos sean legibles antes de continuar.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficialIdStep;

