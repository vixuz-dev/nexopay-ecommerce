import React, { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';
import { useCreditForm } from '../../../stores/creditFormStore';
import ImageUploader from '../../common/ImageUploader';

const IdentityVerificationStep = ({ setCustomNextHandler }) => {
  const { formData, updateFormData, goToNextStep } = useCreditForm();
  const identityData = formData.identityVerification || {};
  const [validationError, setValidationError] = useState('');

  const handleImageSelect = (file, imageUrl) => {
    updateFormData({
      identityVerification: {
        ...identityData,
        selfieFile: file,
        selfieUrl: imageUrl
      }
    });
    // Limpiar error de validación cuando se selecciona una imagen
    if (imageUrl) {
      setValidationError('');
    }
  };

  useEffect(() => {
    if (setCustomNextHandler) {
      setCustomNextHandler(() => {
        // Validar que haya una foto de selfie
        if (!identityData.selfieUrl || !identityData.selfieFile) {
          setValidationError('Debes subir una foto de tu rostro (selfie) para continuar');
          // Hacer scroll al error
          setTimeout(() => {
            const errorElement = document.getElementById('selfie-validation-error');
            if (errorElement) {
              errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
          return;
        }
        
        // Si hay foto, continuar al siguiente paso
        setValidationError('');
        goToNextStep();
      });
    }
  }, [setCustomNextHandler, identityData.selfieUrl, identityData.selfieFile, goToNextStep]);

  const requirements = [
    'Tu rostro debe estar completamente visible',
    'Buena iluminación (evita sombras en tu cara)',
    'Mira directamente a la cámara',
    'Sin lentes de sol o accesorios que cubran tu rostro',
    'Fondo claro y sin distracciones',
    'Foto nítida y enfocada'
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verificación de identidad
        </h2>
        <p className="text-gray-600">
          Sube una foto de tu rostro para verificar tu identidad. Es importante que la foto sea clara y legible.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-blue-50 px-6 py-4">
            <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <HiOutlineExclamationCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
              <h3 className="font-bold text-blue-900 text-lg">
                Requisitos para una foto legible
              </h3>
            </div>
          </div>
          <div className="p-6">
              <ul className="space-y-2.5">
                {requirements.map((req, index) => (
                  <li key={index} className="text-sm text-blue-800 flex items-start gap-3">
                    <HiOutlineCheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <label className="block text-base font-bold text-gray-900 mb-4">
            Foto de tu rostro (selfie) <span className="text-red-500">*</span>
          </label>
          <ImageUploader
            onImageSelect={handleImageSelect}
            currentImage={identityData.selfieUrl}
            accept="image/*"
            maxSizeMB={5}
          />
          {validationError && (
            <div id="selfie-validation-error" className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <HiOutlineXCircle className="w-5 h-5 text-red-600 mt-0.5" />
                </div>
                <p className="text-sm font-semibold text-red-800 leading-relaxed">
                  {validationError}
                </p>
              </div>
            </div>
          )}
        </div>

        {identityData.selfieUrl && !validationError && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <HiOutlineCheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm font-semibold text-green-800 leading-relaxed">
                Foto cargada correctamente. Verifica que tu rostro sea claramente visible antes de continuar.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdentityVerificationStep;


