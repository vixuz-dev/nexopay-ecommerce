import React, { useState, useEffect } from 'react';
import { HiOutlineUser, HiOutlinePhone, HiOutlineMapPin, HiOutlineCheckCircle, HiOutlineArrowRight } from 'react-icons/hi2';
import Dropdown from '../../common/Dropdown';
import { useCreditForm } from '../CreditWizard';

const PersonalReferencesStep = ({ setCustomNextHandler }) => {
  const { formData, updateFormData, goToNextStep } = useCreditForm();
  const referencesData = formData.personalReferences || {};
  const [currentReference, setCurrentReference] = useState(1);

  const estados = [
    { value: 'Aguascalientes', label: 'Aguascalientes' },
    { value: 'Baja California', label: 'Baja California' },
    { value: 'Baja California Sur', label: 'Baja California Sur' },
    { value: 'Campeche', label: 'Campeche' },
    { value: 'Chiapas', label: 'Chiapas' },
    { value: 'Chihuahua', label: 'Chihuahua' },
    { value: 'Ciudad de México', label: 'Ciudad de México' },
    { value: 'Coahuila', label: 'Coahuila' },
    { value: 'Colima', label: 'Colima' },
    { value: 'Durango', label: 'Durango' },
    { value: 'Estado de México', label: 'Estado de México' },
    { value: 'Guanajuato', label: 'Guanajuato' },
    { value: 'Guerrero', label: 'Guerrero' },
    { value: 'Hidalgo', label: 'Hidalgo' },
    { value: 'Jalisco', label: 'Jalisco' },
    { value: 'Michoacán', label: 'Michoacán' },
    { value: 'Morelos', label: 'Morelos' },
    { value: 'Nayarit', label: 'Nayarit' },
    { value: 'Nuevo León', label: 'Nuevo León' },
    { value: 'Oaxaca', label: 'Oaxaca' },
    { value: 'Puebla', label: 'Puebla' },
    { value: 'Querétaro', label: 'Querétaro' },
    { value: 'Quintana Roo', label: 'Quintana Roo' },
    { value: 'San Luis Potosí', label: 'San Luis Potosí' },
    { value: 'Sinaloa', label: 'Sinaloa' },
    { value: 'Sonora', label: 'Sonora' },
    { value: 'Tabasco', label: 'Tabasco' },
    { value: 'Tamaulipas', label: 'Tamaulipas' },
    { value: 'Tlaxcala', label: 'Tlaxcala' },
    { value: 'Veracruz', label: 'Veracruz' },
    { value: 'Yucatán', label: 'Yucatán' },
    { value: 'Zacatecas', label: 'Zacatecas' }
  ];

  const ciudades = [
    { value: 'Ciudad de México', label: 'Ciudad de México' },
    { value: 'Guadalajara', label: 'Guadalajara' },
    { value: 'Monterrey', label: 'Monterrey' },
    { value: 'Puebla', label: 'Puebla' },
    { value: 'Tijuana', label: 'Tijuana' },
    { value: 'León', label: 'León' },
    { value: 'Juárez', label: 'Juárez' },
    { value: 'Torreón', label: 'Torreón' },
    { value: 'Querétaro', label: 'Querétaro' },
    { value: 'San Luis Potosí', label: 'San Luis Potosí' },
    { value: 'Mérida', label: 'Mérida' },
    { value: 'Mexicali', label: 'Mexicali' },
    { value: 'Aguascalientes', label: 'Aguascalientes' },
    { value: 'Tampico', label: 'Tampico' },
    { value: 'Culiacán', label: 'Culiacán' },
    { value: 'Zamora', label: 'Zamora' },
    { value: 'Morelia', label: 'Morelia' },
    { value: 'Chihuahua', label: 'Chihuahua' },
    { value: 'Saltillo', label: 'Saltillo' },
    { value: 'Hermosillo', label: 'Hermosillo' },
    { value: 'Jacona', label: 'Jacona' }
  ];

  const ReferenceForm = ({ referenceNumber, referenceData, onUpdate }) => {
    const handleChange = (e) => {
      onUpdate({
        ...referenceData,
        [e.target.name]: e.target.value
      });
    };


    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <HiOutlineUser className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg">
            Referencia {referenceNumber}
          </h3>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre(s) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombres"
                value={referenceData.nombres || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                placeholder="Nombre(s)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Apellido paterno <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="apellidoPaterno"
                value={referenceData.apellidoPaterno || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                placeholder="Apellido paterno"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Apellido materno <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="apellidoMaterno"
                value={referenceData.apellidoMaterno || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                placeholder="Apellido materno"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="telefono"
                value={referenceData.telefono || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                placeholder="Teléfono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineMapPin className="w-5 h-5 text-gray-400" />
              <h4 className="font-semibold text-gray-700 text-sm">Dirección</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Calle <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="calle"
                  value={referenceData.calle || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  placeholder="Calle"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Número exterior <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="numeroExterior"
                  value={referenceData.numeroExterior || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  placeholder="Número exterior"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Número interior
                </label>
                <input
                  type="text"
                  name="numeroInterior"
                  value={referenceData.numeroInterior || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  placeholder="Número interior (opcional)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Colonia <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="colonia"
                  value={referenceData.colonia || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  placeholder="Colonia"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ciudad <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  id={`ciudad-${referenceNumber}`}
                  name="ciudad"
                  options={ciudades}
                  value={referenceData.ciudad || ''}
                  onChange={handleChange}
                  placeholder="Selecciona una ciudad"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estado <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  id={`estado-${referenceNumber}`}
                  name="estado"
                  options={estados}
                  value={referenceData.estado || ''}
                  onChange={handleChange}
                  placeholder="Selecciona un estado"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Código postal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="codigoPostal"
                  value={referenceData.codigoPostal || ''}
                  onChange={handleChange}
                  maxLength="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  placeholder="00000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Referencia de ubicación <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="referenciaUbicacion"
                  value={referenceData.referenciaUbicacion || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  placeholder="Referencia de ubicación"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const updateReference1 = (data) => {
    updateFormData({
      personalReferences: {
        ...referencesData,
        reference1: data
      }
    });
  };

  const updateReference2 = (data) => {
    updateFormData({
      personalReferences: {
        ...referencesData,
        reference2: data
      }
    });
  };

  const handleNextReference = () => {
    if (currentReference === 1) {
      setCurrentReference(2);
    }
  };

  const handlePreviousReference = () => {
    if (currentReference === 2) {
      setCurrentReference(1);
    }
  };

  useEffect(() => {
    if (setCustomNextHandler) {
      if (currentReference === 1) {
        if (isReference1Complete()) {
          setCustomNextHandler(() => handleNextReference);
        } else {
          setCustomNextHandler(null);
        }
      } else if (currentReference === 2) {
        if (isReference2Complete()) {
          setCustomNextHandler(() => goToNextStep);
        } else {
          setCustomNextHandler(null);
        }
      }
    }
  }, [currentReference, referencesData, setCustomNextHandler, goToNextStep]);

  const isReference1Complete = () => {
    const ref1 = referencesData.reference1 || {};
    return ref1.nombres && ref1.apellidoPaterno && ref1.apellidoMaterno && 
           ref1.telefono && ref1.calle && ref1.numeroExterior && 
           ref1.colonia && ref1.ciudad && ref1.estado && 
           ref1.codigoPostal && ref1.referenciaUbicacion;
  };

  const isReference2Complete = () => {
    const ref2 = referencesData.reference2 || {};
    return ref2.nombres && ref2.apellidoPaterno && ref2.apellidoMaterno && 
           ref2.telefono && ref2.calle && ref2.numeroExterior && 
           ref2.colonia && ref2.ciudad && ref2.estado && 
           ref2.codigoPostal && ref2.referenciaUbicacion;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Referencias personales
        </h2>
        <p className="text-gray-600">
          Ingresa los datos de dos personas que puedan dar referencias sobre ti.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200 ${
              currentReference === 1 
                ? 'bg-primary-600 text-white ring-4 ring-primary-100' 
                : isReference1Complete()
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {isReference1Complete() && currentReference !== 1 ? (
                <HiOutlineCheckCircle className="w-6 h-6" />
              ) : (
                <span>1</span>
              )}
            </div>
            <span className={`font-semibold text-sm ${
              currentReference === 1 ? 'text-primary-600' : 'text-gray-500'
            }`}>
              Referencia 1
            </span>
          </div>

          <div className="h-px w-12 bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200 ${
              currentReference === 2 
                ? 'bg-primary-600 text-white ring-4 ring-primary-100' 
                : isReference2Complete()
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {isReference2Complete() && currentReference !== 2 ? (
                <HiOutlineCheckCircle className="w-6 h-6" />
              ) : (
                <span>2</span>
              )}
            </div>
            <span className={`font-semibold text-sm ${
              currentReference === 2 ? 'text-primary-600' : 'text-gray-500'
            }`}>
              Referencia 2
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {currentReference === 1 && (
          <div>
            <ReferenceForm
              referenceNumber={1}
              referenceData={referencesData.reference1 || {}}
              onUpdate={updateReference1}
            />
          </div>
        )}

        {currentReference === 2 && (
          <div>
            <div className="mb-4">
              <button
                type="button"
                onClick={handlePreviousReference}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
              >
                ← Volver a Referencia 1
              </button>
            </div>
            <ReferenceForm
              referenceNumber={2}
              referenceData={referencesData.reference2 || {}}
              onUpdate={updateReference2}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalReferencesStep;

