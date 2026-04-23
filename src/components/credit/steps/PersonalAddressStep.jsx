import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreditForm } from '../../../stores/creditFormStore';
import { personalAddressSchema } from '../../../schemas/credit';
import { CIUDADES_MEXICO } from '../../../constants/app';
import AddressAutocomplete from '../../common/AddressAutocomplete';
import Dropdown from '../../common/Dropdown';
import { getGoogleMapsBrowserKey } from '../../../utils/loadGoogleMapsPlaces';

const PersonalAddressStep = ({ setCustomNextHandler }) => {
  const { formData, updateFormData, goToNextStep, setIsCurrentStepValid } = useCreditForm();
  const addressData = formData.personalAddress || {};

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger
  } = useForm({
    resolver: zodResolver(personalAddressSchema),
    mode: 'onChange',
    defaultValues: {
      calle: addressData.calle || '',
      numeroExterior: addressData.numeroExterior || '',
      numeroInterior: addressData.numeroInterior || '',
      colonia: addressData.colonia || '',
      ciudad: addressData.ciudad || '',
      estado: addressData.estado || '',
      codigoPostal: addressData.codigoPostal || '',
      referencias: addressData.referencias || ''
    }
  });

  useEffect(() => {
    setIsCurrentStepValid(isValid);
  }, [isValid, setIsCurrentStepValid]);

  useEffect(() => {
    const subscription = watch((value) => {
      updateFormData({
        personalAddress: value
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateFormData]);

  useEffect(() => {
    if (setCustomNextHandler) {
      setCustomNextHandler(() => {
        handleSubmit(
          () => {
            goToNextStep();
          },
          () => {
            trigger();
          }
        )();
      });
    }
  }, [isValid, handleSubmit, goToNextStep, setCustomNextHandler, trigger]);

  const handleChange = (e) => {
    setValue(e.target.name, e.target.value, { shouldValidate: true });
  };

  const handleDropdownChange = (e) => {
    const { name, value } = e.target;
    setValue(name, value, { shouldValidate: true });
  };

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

  const ciudades = CIUDADES_MEXICO.map((ciudad) => ({
    value: ciudad,
    label: ciudad,
  }));

  const hasGoogleMapsKey = Boolean(getGoogleMapsBrowserKey());

  return (
    <div>
      <div className="mb-6">
        <h2 id="step-title-1" className="text-2xl font-bold text-gray-900 mb-2">
          Dirección personal
        </h2>
        <p className="text-gray-600">
          Queremos conocerte un poco más, asegúrate de que la información sea correcta, ya que es la que usaremos para tu solicitud.
        </p>
      </div>

      <form onSubmit={handleSubmit(() => {})} className="space-y-6">
        {hasGoogleMapsKey ? (
          <AddressAutocomplete
            onResolved={(patch) => {
              Object.entries(patch).forEach(([key, val]) => {
                if (val === undefined || val === null) return;
                setValue(key, val, { shouldValidate: true, shouldDirty: true });
              });
              trigger();
            }}
            hint="Escribe y elige una sugerencia para llenar calle, números, colonia y código postal. Ciudad y estado deben coincidir con el catálogo; si no, elígelos manualmente abajo."
          />
        ) : (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            Configura <code className="text-xs">VITE_GOOGLE_MAP_KEY</code> para habilitar la búsqueda de direcciones. Mientras tanto, completa los campos manualmente.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="calle" className="block text-sm font-semibold text-gray-700 mb-2">
              Calle <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="calle"
              {...register('calle')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                errors.calle ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ingresa el nombre de la calle"
            />
            {errors.calle && (
              <p className="mt-1 text-sm text-red-600">{errors.calle.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="numeroExterior" className="block text-sm font-semibold text-gray-700 mb-2">
              Número exterior <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="numeroExterior"
              {...register('numeroExterior')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                errors.numeroExterior ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Número exterior"
            />
            {errors.numeroExterior && (
              <p className="mt-1 text-sm text-red-600">{errors.numeroExterior.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="numeroInterior" className="block text-sm font-semibold text-gray-700 mb-2">
              Número interior
            </label>
            <input
              type="text"
              id="numeroInterior"
              {...register('numeroInterior')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                errors.numeroInterior ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Número interior (opcional)"
            />
            {errors.numeroInterior && (
              <p className="mt-1 text-sm text-red-600">{errors.numeroInterior.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="colonia" className="block text-sm font-semibold text-gray-700 mb-2">
              Colonia <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="colonia"
              {...register('colonia')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                errors.colonia ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nombre de la colonia"
            />
            {errors.colonia && (
              <p className="mt-1 text-sm text-red-600">{errors.colonia.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ciudad" className="block text-sm font-semibold text-gray-700 mb-2">
              Ciudad <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="ciudad"
              name="ciudad"
              value={watch('ciudad') || ''}
              onChange={(e) => {
                setValue('ciudad', e.target.value, { shouldValidate: true });
              }}
              options={ciudades}
              placeholder="Selecciona una ciudad"
              error={errors.ciudad?.message}
            />
          </div>

          <div>
            <label htmlFor="estado" className="block text-sm font-semibold text-gray-700 mb-2">
              Estado <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="estado"
              name="estado"
              value={watch('estado') || ''}
              onChange={(e) => {
                setValue('estado', e.target.value, { shouldValidate: true });
              }}
              options={estados}
              placeholder="Selecciona un estado"
              error={errors.estado?.message}
            />
          </div>
        </div>

        <div>
          <label htmlFor="codigoPostal" className="block text-sm font-semibold text-gray-700 mb-2">
            Código postal <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="codigoPostal"
            {...register('codigoPostal')}
            maxLength="5"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors.codigoPostal ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="00000"
          />
          {errors.codigoPostal && (
            <p className="mt-1 text-sm text-red-600">{errors.codigoPostal.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="referencias" className="block text-sm font-semibold text-gray-700 mb-2">
            Referencias de ubicación <span className="text-gray-500 font-normal">(opcional)</span>
          </label>
          <textarea
            id="referencias"
            {...register('referencias')}
            rows="3"
            maxLength={250}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-none ${
              errors.referencias ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Opcional. Ej: Cerca del parque, entre calles X y Y..."
          />
          <div className="mt-1 text-xs text-gray-500 text-right">
            {watch('referencias')?.length || 0}/250 caracteres
          </div>
          {errors.referencias && (
            <p className="mt-1 text-sm text-red-600">{errors.referencias.message}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default PersonalAddressStep;


