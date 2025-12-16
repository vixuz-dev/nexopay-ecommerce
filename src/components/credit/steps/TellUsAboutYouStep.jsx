import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiOutlineInformationCircle, HiOutlineUser, HiOutlineCreditCard, HiOutlineDocumentText, HiOutlineShoppingBag } from 'react-icons/hi2';
import { useCreditForm } from '../../../stores/creditFormStore';
import { eligibilitySchema } from '../../../schemas/creditFormSchemas';

const TellUsAboutYouStep = ({ setCustomNextHandler }) => {
  const { formData, updateFormData, goToNextStep } = useCreditForm();
  const eligibilityData = formData.eligibility || {};

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger
  } = useForm({
    resolver: zodResolver(eligibilitySchema),
    mode: 'onChange',
    defaultValues: {
      edad: eligibilityData.edad || undefined,
      residencia_pais: eligibilityData.residencia_pais !== undefined ? eligibilityData.residencia_pais : undefined,
      ingreso_mensual: eligibilityData.ingreso_mensual || undefined,
      antiguedad_laboral: eligibilityData.antiguedad_laboral || undefined,
      uso_tarjeta_credito: eligibilityData.uso_tarjeta_credito !== undefined ? eligibilityData.uso_tarjeta_credito : undefined,
      pago_servicios_debito_transferencia: eligibilityData.pago_servicios_debito_transferencia !== undefined ? eligibilityData.pago_servicios_debito_transferencia : undefined,
      solicitud_aprobada: eligibilityData.solicitud_aprobada !== undefined ? eligibilityData.solicitud_aprobada : undefined,
      solicitud_aprobada_periodo: eligibilityData.solicitud_aprobada_periodo || undefined,
      solicitud_rechazada: eligibilityData.solicitud_rechazada !== undefined ? eligibilityData.solicitud_rechazada : undefined,
      solicitud_rechazada_periodo: eligibilityData.solicitud_rechazada_periodo || undefined,
      total_compra: eligibilityData.total_compra || undefined
    }
  });

  const solicitudAprobada = watch('solicitud_aprobada');
  const solicitudRechazada = watch('solicitud_rechazada');

  useEffect(() => {
    if (setCustomNextHandler) {
      setCustomNextHandler(() => {
        handleSubmit(
          (data) => {
            // Guardar en el store solo cuando el formulario es válido y se avanza
            updateFormData({
              eligibility: data
            });
            goToNextStep();
          },
          () => {
            trigger();
          }
        )();
      });
    }
  }, [isValid, handleSubmit, goToNextStep, setCustomNextHandler, trigger]);

  const handleBooleanChange = (field, value) => {
    const boolValue = value === 'Si';
    setValue(field, boolValue, { shouldValidate: true });
    
    // Limpiar periodos cuando se cambia a false
    if (field === 'solicitud_aprobada' && boolValue === false) {
      setValue('solicitud_aprobada_periodo', undefined, { shouldValidate: true });
    }
    if (field === 'solicitud_rechazada' && boolValue === false) {
      setValue('solicitud_rechazada_periodo', undefined, { shouldValidate: true });
    }
  };

  const handlePeriodoChange = (field, value) => {
    setValue(field, value, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(() => {})}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Conozcámonos mejor
        </h2>
        <p className="text-gray-600">
          Para ofrecerte un crédito que realmente se adapte a ti, necesitamos hacerte algunas preguntas rápidas.
        </p>
        <p className="text-gray-600 mt-2">
          Tus respuestas nos ayudan a calcular el monto y las condiciones que mejor se ajustan a tu perfil.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <HiOutlineInformationCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-800 leading-relaxed">
                Tus respuestas son importantes para el análisis de tu perfil crediticio y nos garantizan poder brindarte la línea de crédito más adecuada para ti.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <HiOutlineUser className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Datos del usuario</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="edad" className="block text-sm font-semibold text-gray-700 mb-2">
                  ¿Cuántos años tienes? <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="edad"
                  min="18"
                  max="100"
                {...register('edad')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                    errors.edad ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa tu edad"
                />
                {errors.edad && (
                  <p className="mt-1 text-sm text-red-600">{errors.edad.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ¿Actualmente resides en México? <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="residencia_pais"
                      checked={watch('residencia_pais') === true}
                      onChange={() => handleBooleanChange('residencia_pais', 'Si')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="residencia_pais"
                      checked={watch('residencia_pais') === false}
                      onChange={() => handleBooleanChange('residencia_pais', 'No')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
                {errors.residencia_pais && (
                  <p className="mt-1 text-sm text-red-600">{errors.residencia_pais.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="ingreso_mensual" className="block text-sm font-semibold text-gray-700 mb-2">
                  ¿Cuál es tu ingreso mensual aproximado? (MXN) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="ingreso_mensual"
                  min="0"
                {...register('ingreso_mensual')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                    errors.ingreso_mensual ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa tu ingreso mensual"
                />
                {errors.ingreso_mensual && (
                  <p className="mt-1 text-sm text-red-600">{errors.ingreso_mensual.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="antiguedad_laboral" className="block text-sm font-semibold text-gray-700 mb-2">
                  ¿Cuánto tiempo llevas en tu trabajo actual? <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="antiguedad_laboral"
                    min="0"
                    {...register('antiguedad_laboral')}
                    className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      errors.antiguedad_laboral ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Número de meses"
                  />
                  <span className="text-sm text-gray-500 whitespace-nowrap">meses</span>
                </div>
                {errors.antiguedad_laboral && (
                  <p className="mt-1 text-sm text-red-600">{errors.antiguedad_laboral.message}</p>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <HiOutlineCreditCard className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Comportamiento financiero</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ¿Usas tarjeta de crédito actualmente? <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="uso_tarjeta_credito"
                      checked={watch('uso_tarjeta_credito') === true}
                      onChange={() => handleBooleanChange('uso_tarjeta_credito', 'Si')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="uso_tarjeta_credito"
                      checked={watch('uso_tarjeta_credito') === false}
                      onChange={() => handleBooleanChange('uso_tarjeta_credito', 'No')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
                {errors.uso_tarjeta_credito && (
                  <p className="mt-1 text-sm text-red-600">{errors.uso_tarjeta_credito.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ¿Pagas servicios (luz/agua/internet/renta) con débito o transferencia? <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pago_servicios_debito_transferencia"
                      checked={watch('pago_servicios_debito_transferencia') === true}
                      onChange={() => handleBooleanChange('pago_servicios_debito_transferencia', 'Si')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pago_servicios_debito_transferencia"
                      checked={watch('pago_servicios_debito_transferencia') === false}
                      onChange={() => handleBooleanChange('pago_servicios_debito_transferencia', 'No')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
                {errors.pago_servicios_debito_transferencia && (
                  <p className="mt-1 text-sm text-red-600">{errors.pago_servicios_debito_transferencia.message}</p>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <HiOutlineDocumentText className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Historial de solicitudes (últimos 6 meses)</h3>
            </div>

            <div className="space-y-8">
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ¿En los últimos 6 meses te han aprobado alguna solicitud de crédito? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="solicitud_aprobada"
                        checked={watch('solicitud_aprobada') === true}
                        onChange={() => handleBooleanChange('solicitud_aprobada', 'Si')}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Sí</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="solicitud_aprobada"
                        checked={watch('solicitud_aprobada') === false}
                        onChange={() => handleBooleanChange('solicitud_aprobada', 'No')}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                  {errors.solicitud_aprobada && (
                    <p className="mt-1 text-sm text-red-600">{errors.solicitud_aprobada.message}</p>
                  )}
                </div>

                {solicitudAprobada === true && (
                  <div className="mt-4 pl-4 border-l-4 border-primary-200 bg-primary-50 rounded-r-lg p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ¿En qué periodo ocurrió la aprobación más reciente? <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'ultimos_2_meses', label: 'En los últimos 2 meses' },
                        { value: '3_4_meses', label: 'Hace 3 a 4 meses' },
                        { value: '5_6_meses', label: 'Hace 5 a 6 meses' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handlePeriodoChange('solicitud_aprobada_periodo', option.value)}
                          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                            watch('solicitud_aprobada_periodo') === option.value
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'bg-white border border-gray-300 text-gray-700 hover:border-primary-400'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    {errors.solicitud_aprobada_periodo && (
                      <p className="mt-1 text-sm text-red-600">{errors.solicitud_aprobada_periodo.message}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ¿En los últimos 6 meses te han rechazado alguna solicitud de crédito? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="solicitud_rechazada"
                        checked={watch('solicitud_rechazada') === true}
                        onChange={() => handleBooleanChange('solicitud_rechazada', 'Si')}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Sí</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="solicitud_rechazada"
                        checked={watch('solicitud_rechazada') === false}
                        onChange={() => handleBooleanChange('solicitud_rechazada', 'No')}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                  {errors.solicitud_rechazada && (
                    <p className="mt-1 text-sm text-red-600">{errors.solicitud_rechazada.message}</p>
                  )}
                </div>

                {solicitudRechazada === true && (
                  <div className="mt-4 pl-4 border-l-4 border-primary-200 bg-primary-50 rounded-r-lg p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ¿En qué periodo ocurrió el rechazo más reciente? <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'ultimos_2_meses', label: 'En los últimos 2 meses' },
                        { value: '3_4_meses', label: 'Hace 3 a 4 meses' },
                        { value: '5_6_meses', label: 'Hace 5 a 6 meses' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handlePeriodoChange('solicitud_rechazada_periodo', option.value)}
                          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                            watch('solicitud_rechazada_periodo') === option.value
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'bg-white border border-gray-300 text-gray-700 hover:border-primary-400'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    {errors.solicitud_rechazada_periodo && (
                      <p className="mt-1 text-sm text-red-600">{errors.solicitud_rechazada_periodo.message}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <HiOutlineShoppingBag className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Compra</h3>
            </div>

            <div>
              <label htmlFor="total_compra" className="block text-sm font-semibold text-gray-700 mb-2">
                ¿Cuál es el total del producto que deseas comprar en NexoPay? (MXN) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="total_compra"
                min="0"
                {...register('total_compra')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                  errors.total_compra ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ingresa el total de tu compra"
              />
              {errors.total_compra && (
                <p className="mt-1 text-sm text-red-600">{errors.total_compra.message}</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </form>
  );
};

export default TellUsAboutYouStep;

