import React from 'react';
import Dropdown from '../../common/Dropdown';

const PersonalAddressStep = ({ formData, updateFormData }) => {
  const addressData = formData.personalAddress || {};

  const handleChange = (e) => {
    updateFormData({
      personalAddress: {
        ...addressData,
        [e.target.name]: e.target.value
      }
    });
  };

  const estados = [
    { value: '', label: 'Selecciona un estado' },
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
    { value: '', label: 'Selecciona una ciudad' },
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
    { value: 'Hermosillo', label: 'Hermosillo' }
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Dirección personal
        </h2>
        <p className="text-gray-600">
          Queremos conocerte un poco más, asegúrate de que la información sea correcta, ya que es la que usaremos para tu solicitud.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="calle" className="block text-sm font-semibold text-gray-700 mb-2">
              Calle
            </label>
            <input
              type="text"
              id="calle"
              name="calle"
              value={addressData.calle || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              placeholder="Ingresa el nombre de la calle"
            />
          </div>

          <div>
            <label htmlFor="numeroExterior" className="block text-sm font-semibold text-gray-700 mb-2">
              Número exterior
            </label>
            <input
              type="text"
              id="numeroExterior"
              name="numeroExterior"
              value={addressData.numeroExterior || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              placeholder="Número exterior"
            />
          </div>

          <div>
            <label htmlFor="numeroInterior" className="block text-sm font-semibold text-gray-700 mb-2">
              Número interior
            </label>
            <input
              type="text"
              id="numeroInterior"
              name="numeroInterior"
              value={addressData.numeroInterior || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              placeholder="Número interior (opcional)"
            />
          </div>

          <div>
            <label htmlFor="colonia" className="block text-sm font-semibold text-gray-700 mb-2">
              Colonia
            </label>
            <input
              type="text"
              id="colonia"
              name="colonia"
              value={addressData.colonia || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              placeholder="Nombre de la colonia"
            />
          </div>

          <Dropdown
            id="ciudad"
            name="ciudad"
            label="Ciudad"
            value={addressData.ciudad || ''}
            onChange={handleChange}
            options={ciudades}
            placeholder="Selecciona una ciudad"
          />

          <Dropdown
            id="estado"
            name="estado"
            label="Estado"
            value={addressData.estado || ''}
            onChange={handleChange}
            options={estados}
            placeholder="Selecciona un estado"
          />
        </div>

        <div>
          <label htmlFor="codigoPostal" className="block text-sm font-semibold text-gray-700 mb-2">
            Código postal
          </label>
          <input
            type="text"
            id="codigoPostal"
            name="codigoPostal"
            value={addressData.codigoPostal || ''}
            onChange={handleChange}
            maxLength="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            placeholder="00000"
          />
        </div>

        <div>
          <label htmlFor="referencias" className="block text-sm font-semibold text-gray-700 mb-2">
            Referencias de ubicación
          </label>
          <textarea
            id="referencias"
            name="referencias"
            value={addressData.referencias || ''}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-none"
            placeholder="Ej: Cerca del parque, entre calles X y Y, edificio de color..."
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalAddressStep;


