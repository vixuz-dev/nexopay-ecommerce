import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiOutlineUser, HiOutlinePhone, HiOutlineMapPin, HiOutlineCheckCircle, HiOutlineArrowRight } from 'react-icons/hi2';
import Dropdown from '../../common/Dropdown';
import { useCreditForm } from '../../../stores/creditFormStore';
import { referenceSchema } from '../../../schemas/credit';

const PersonalReferencesStep = ({ setCustomNextHandler }) => {
  const { formData, updateFormData, goToNextStep, setIsCurrentStepValid, referenceValidationErrors } = useCreditForm();
  const [currentReference, setCurrentReference] = useState(1);
  
  const reference1Data = formData.personalReferences?.reference1 || {};
  const reference2Data = formData.personalReferences?.reference2 || {};

  const form1 = useForm({
    resolver: zodResolver(referenceSchema),
    mode: 'onChange',
    defaultValues: {
      nombres: reference1Data.nombres || '',
      apellidoPaterno: reference1Data.apellidoPaterno || '',
      apellidoMaterno: reference1Data.apellidoMaterno || '',
      telefono: reference1Data.telefono || '',
      calle: reference1Data.calle || '',
      numeroExterior: reference1Data.numeroExterior || '',
      numeroInterior: reference1Data.numeroInterior || '',
      colonia: reference1Data.colonia || '',
      ciudad: reference1Data.ciudad || '',
      estado: reference1Data.estado || '',
      codigoPostal: reference1Data.codigoPostal || '',
      referenciaUbicacion: reference1Data.referenciaUbicacion || ''
    }
  });

  const form2 = useForm({
    resolver: zodResolver(referenceSchema),
    mode: 'onChange',
    defaultValues: {
      nombres: reference2Data.nombres || '',
      apellidoPaterno: reference2Data.apellidoPaterno || '',
      apellidoMaterno: reference2Data.apellidoMaterno || '',
      telefono: reference2Data.telefono || '',
      calle: reference2Data.calle || '',
      numeroExterior: reference2Data.numeroExterior || '',
      numeroInterior: reference2Data.numeroInterior || '',
      colonia: reference2Data.colonia || '',
      ciudad: reference2Data.ciudad || '',
      estado: reference2Data.estado || '',
      codigoPostal: reference2Data.codigoPostal || '',
      referenciaUbicacion: reference2Data.referenciaUbicacion || ''
    }
  });

  const currentForm = currentReference === 1 ? form1 : form2;
  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue, trigger } = currentForm;
  const form1Valid = form1.formState.isValid;
  const form2Valid = form2.formState.isValid;

  const isStepValid = currentReference === 1 ? form1Valid : (form1Valid && form2Valid);
  useEffect(() => {
    setIsCurrentStepValid(isStepValid);
  }, [isStepValid, setIsCurrentStepValid]);

  useEffect(() => {
    const hasPersistedRef1 = reference1Data.nombres != null && reference1Data.nombres !== '';
    const hasPersistedRef2 = reference2Data.nombres != null && reference2Data.nombres !== '';
    if (hasPersistedRef1) {
      form1.reset({
        nombres: reference1Data.nombres ?? '',
        apellidoPaterno: reference1Data.apellidoPaterno ?? '',
        apellidoMaterno: reference1Data.apellidoMaterno ?? '',
        telefono: reference1Data.telefono ?? '',
        calle: reference1Data.calle ?? '',
        numeroExterior: reference1Data.numeroExterior ?? '',
        numeroInterior: reference1Data.numeroInterior ?? '',
        colonia: reference1Data.colonia ?? '',
        ciudad: reference1Data.ciudad ?? '',
        estado: reference1Data.estado ?? '',
        codigoPostal: reference1Data.codigoPostal ?? '',
        referenciaUbicacion: reference1Data.referenciaUbicacion ?? ''
      });
    }
    if (hasPersistedRef2) {
      form2.reset({
        nombres: reference2Data.nombres ?? '',
        apellidoPaterno: reference2Data.apellidoPaterno ?? '',
        apellidoMaterno: reference2Data.apellidoMaterno ?? '',
        telefono: reference2Data.telefono ?? '',
        calle: reference2Data.calle ?? '',
        numeroExterior: reference2Data.numeroExterior ?? '',
        numeroInterior: reference2Data.numeroInterior ?? '',
        colonia: reference2Data.colonia ?? '',
        ciudad: reference2Data.ciudad ?? '',
        estado: reference2Data.estado ?? '',
        codigoPostal: reference2Data.codigoPostal ?? '',
        referenciaUbicacion: reference2Data.referenciaUbicacion ?? ''
      });
    }
    let cancelled = false;
    if (hasPersistedRef1 || hasPersistedRef2) {
      Promise.all([form1.trigger(), form2.trigger()]).then(([r1, r2]) => {
        if (!cancelled && setIsCurrentStepValid) {
          setIsCurrentStepValid(currentReference === 1 ? r1 : (r1 && r2));
        }
      });
    }
    return () => { cancelled = true; };
  }, [formData.personalReferences]);

  const saveCurrentReference = useCallback((referenceNum) => {
    const form = referenceNum === 1 ? form1 : form2;
    const formValues = form.getValues();
    const currentReferences = formData.personalReferences || {};
    
    if (referenceNum === 1) {
      updateFormData({
        personalReferences: {
          ...currentReferences,
          reference1: formValues
        }
      });
    } else {
      updateFormData({
        personalReferences: {
          ...currentReferences,
          reference2: formValues
        }
      });
    }
  }, [form1, form2, formData.personalReferences, updateFormData]);

  const handleNextReference = useCallback(() => {
    saveCurrentReference(1);
    setCurrentReference(2);
  }, [saveCurrentReference]);

  const handlePreviousReference = useCallback(() => {
    saveCurrentReference(2);
    setCurrentReference(1);
  }, [saveCurrentReference]);

  useEffect(() => {
    if (setCustomNextHandler) {
      setCustomNextHandler(() => {
        saveCurrentReference(currentReference);
        handleSubmit(
          () => {
            if (currentReference === 1) {
              handleNextReference();
            } else {
              goToNextStep();
            }
          },
          () => {
            trigger();
          }
        )();
      });
    }
  }, [currentReference, isValid, handleSubmit, goToNextStep, setCustomNextHandler, trigger, saveCurrentReference, handleNextReference]);

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

  const isReference1Complete = reference1Data.nombres && 
    reference1Data.apellidoPaterno && 
    reference1Data.apellidoMaterno && 
    reference1Data.telefono && 
    reference1Data.calle && 
    reference1Data.numeroExterior && 
    reference1Data.colonia && 
    reference1Data.ciudad && 
    reference1Data.estado && 
    reference1Data.codigoPostal && 
    reference1Data.referenciaUbicacion;

  const isReference2Complete = reference2Data.nombres && 
    reference2Data.apellidoPaterno && 
    reference2Data.apellidoMaterno && 
    reference2Data.telefono && 
    reference2Data.calle && 
    reference2Data.numeroExterior && 
    reference2Data.colonia && 
    reference2Data.ciudad && 
    reference2Data.estado && 
    reference2Data.codigoPostal && 
    reference2Data.referenciaUbicacion;

  const externalErrors = currentReference === 1 
    ? (referenceValidationErrors?.reference1 || {})
    : (referenceValidationErrors?.reference2 || {});

  const renderForm = (formNumber) => {
    const form = formNumber === 1 ? form1 : form2;
    const { register: reg, formState: { errors: formErrors }, watch: formWatch, setValue: formSetValue } = form;
    const refData = formNumber === 1 ? reference1Data : reference2Data;
    const extErrors = formNumber === 1 
      ? (referenceValidationErrors?.reference1 || {})
      : (referenceValidationErrors?.reference2 || {});

    return (
      <form onSubmit={handleSubmit(() => {})}>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <HiOutlineUser className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg">
              {formNumber === 1 ? 'Primera referencia' : 'Segunda referencia'}
          </h3>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor={`nombres-${formNumber}`} className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre(s) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                  id={`nombres-${formNumber}`}
                  {...reg('nombres')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                    (formErrors.nombres || extErrors.nombres) ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Nombre(s)"
              />
                {(formErrors.nombres || extErrors.nombres) && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.nombres?.message || (Array.isArray(extErrors.nombres) ? extErrors.nombres[0] : extErrors.nombres)}
                  </p>
                )}
            </div>

            <div>
                <label htmlFor={`apellidoPaterno-${formNumber}`} className="block text-sm font-semibold text-gray-700 mb-2">
                Apellido paterno <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                  id={`apellidoPaterno-${formNumber}`}
                  {...reg('apellidoPaterno')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                    (formErrors.apellidoPaterno || extErrors.apellidoPaterno) ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Apellido paterno"
              />
                {(formErrors.apellidoPaterno || extErrors.apellidoPaterno) && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.apellidoPaterno?.message || (Array.isArray(extErrors.apellidoPaterno) ? extErrors.apellidoPaterno[0] : extErrors.apellidoPaterno)}
                  </p>
                )}
            </div>

            <div>
                <label htmlFor={`apellidoMaterno-${formNumber}`} className="block text-sm font-semibold text-gray-700 mb-2">
                Apellido materno <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                  id={`apellidoMaterno-${formNumber}`}
                  {...reg('apellidoMaterno')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                    (formErrors.apellidoMaterno || extErrors.apellidoMaterno) ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Apellido materno"
              />
                {(formErrors.apellidoMaterno || extErrors.apellidoMaterno) && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.apellidoMaterno?.message || (Array.isArray(extErrors.apellidoMaterno) ? extErrors.apellidoMaterno[0] : extErrors.apellidoMaterno)}
                  </p>
                )}
            </div>

            <div>
                <label htmlFor={`telefono-${formNumber}`} className="block text-sm font-semibold text-gray-700 mb-2">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                  id={`telefono-${formNumber}`}
                  {...reg('telefono')}
                  maxLength="10"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                    (formErrors.telefono || extErrors.telefono) ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Teléfono"
              />
                {(formErrors.telefono || extErrors.telefono) && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.telefono?.message || (Array.isArray(extErrors.telefono) ? extErrors.telefono[0] : extErrors.telefono)}
                  </p>
                )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineMapPin className="w-5 h-5 text-gray-400" />
              <h4 className="font-semibold text-gray-700 text-sm">Dirección</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label htmlFor={`calle-${formNumber}`} className="block text-sm font-semibold text-gray-700 mb-2">
                  Calle <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                    id={`calle-${formNumber}`}
                    {...reg('calle')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      (formErrors.calle || extErrors.calle) ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Calle"
                />
                  {(formErrors.calle || extErrors.calle) && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.calle?.message || (Array.isArray(extErrors.calle) ? extErrors.calle[0] : extErrors.calle)}
                    </p>
                  )}
              </div>

              <div>
                  <label htmlFor={`numeroExterior-${formNumber}`} className="block text-sm font-semibold text-gray-700 mb-2">
                  Número exterior <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                    id={`numeroExterior-${formNumber}`}
                    {...reg('numeroExterior')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      (formErrors.numeroExterior || extErrors.numeroExterior) ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Número exterior"
                />
                  {(formErrors.numeroExterior || extErrors.numeroExterior) && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.numeroExterior?.message || (Array.isArray(extErrors.numeroExterior) ? extErrors.numeroExterior[0] : extErrors.numeroExterior)}
                    </p>
                  )}
              </div>

              <div>
                  <label htmlFor={`numeroInterior-${formNumber}`} className="block text-sm font-semibold text-gray-700 mb-2">
                  Número interior
                </label>
                <input
                  type="text"
                    id={`numeroInterior-${formNumber}`}
                    {...reg('numeroInterior')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      (formErrors.numeroInterior || extErrors.numeroInterior) ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Número interior (opcional)"
                />
                  {(formErrors.numeroInterior || extErrors.numeroInterior) && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.numeroInterior?.message || (Array.isArray(extErrors.numeroInterior) ? extErrors.numeroInterior[0] : extErrors.numeroInterior)}
                    </p>
                  )}
              </div>

              <div>
                  <label htmlFor={`colonia-${formNumber}`} className="block text-sm font-semibold text-gray-700 mb-2">
                  Colonia <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                    id={`colonia-${formNumber}`}
                    {...reg('colonia')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      (formErrors.colonia || extErrors.colonia) ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Colonia"
                />
                  {(formErrors.colonia || extErrors.colonia) && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.colonia?.message || (Array.isArray(extErrors.colonia) ? extErrors.colonia[0] : extErrors.colonia)}
                    </p>
                  )}
              </div>

              <div>
                  <label htmlFor={`estado-${formNumber}`} className="block text-sm font-semibold text-gray-700 mb-2">
                    Estado <span className="text-red-500">*</span>
                </label>
                <Dropdown
                    id={`estado-${formNumber}`}
                    name="estado"
                    value={formWatch('estado') || ''}
                    onChange={(e) => {
                      formSetValue('estado', e.target.value, { shouldValidate: true });
                    }}
                    options={estados}
                    placeholder="Selecciona un estado"
                    error={formErrors.estado?.message || (Array.isArray(extErrors.estado) ? extErrors.estado[0] : extErrors.estado)}
                />
              </div>

              <div>
                  <label htmlFor={`ciudad-${formNumber}`} className="block text-sm font-semibold text-gray-700 mb-2">
                    Ciudad <span className="text-red-500">*</span>
                </label>
                  <input
                    type="text"
                    id={`ciudad-${formNumber}`}
                    {...reg('ciudad')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      (formErrors.ciudad || extErrors.ciudad) ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ciudad"
                  />
                  {(formErrors.ciudad || extErrors.ciudad) && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.ciudad?.message || (Array.isArray(extErrors.ciudad) ? extErrors.ciudad[0] : extErrors.ciudad)}
                    </p>
                  )}
              </div>

              <div>
                  <label htmlFor={`codigoPostal-${formNumber}`} className="block text-sm font-semibold text-gray-700 mb-2">
                  Código postal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                    id={`codigoPostal-${formNumber}`}
                    {...reg('codigoPostal')}
                  maxLength="5"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      (formErrors.codigoPostal || extErrors.codigoPostal) ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="00000"
                />
                  {(formErrors.codigoPostal || extErrors.codigoPostal) && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.codigoPostal?.message || (Array.isArray(extErrors.codigoPostal) ? extErrors.codigoPostal[0] : extErrors.codigoPostal)}
                    </p>
                  )}
              </div>

              <div>
                  <label htmlFor={`referenciaUbicacion-${formNumber}`} className="block text-sm font-semibold text-gray-700 mb-2">
                  Referencia de ubicación <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                    id={`referenciaUbicacion-${formNumber}`}
                    {...reg('referenciaUbicacion')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      (formErrors.referenciaUbicacion || extErrors.referenciaUbicacion) ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Referencia de ubicación"
                />
                  {(formErrors.referenciaUbicacion || extErrors.referenciaUbicacion) && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.referenciaUbicacion?.message || (Array.isArray(extErrors.referenciaUbicacion) ? extErrors.referenciaUbicacion[0] : extErrors.referenciaUbicacion)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 id="step-title-5" className="text-2xl font-bold text-gray-900 mb-2">
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
                : isReference1Complete
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {isReference1Complete && currentReference !== 1 ? (
                <HiOutlineCheckCircle className="w-6 h-6" />
              ) : (
                <span>1</span>
              )}
            </div>
            <span className={`font-semibold text-sm ${
              currentReference === 1 ? 'text-primary-600' : 'text-gray-500'
            }`}>
              Primera referencia
            </span>
          </div>

          <div className="h-px w-12 bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200 ${
              currentReference === 2 
                ? 'bg-primary-600 text-white ring-4 ring-primary-100' 
                : isReference2Complete
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {isReference2Complete && currentReference !== 2 ? (
                <HiOutlineCheckCircle className="w-6 h-6" />
              ) : (
                <span>2</span>
              )}
            </div>
            <span className={`font-semibold text-sm ${
              currentReference === 2 ? 'text-primary-600' : 'text-gray-500'
            }`}>
              Segunda referencia
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {currentReference === 1 && (
          <div key="reference-1">
            {renderForm(1)}
          </div>
        )}

        {currentReference === 2 && (
          <div key="reference-2">
            <div className="mb-4">
              <button
                type="button"
                onClick={handlePreviousReference}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
              >
                ← Volver a primera referencia
              </button>
            </div>
            {renderForm(2)}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalReferencesStep;
