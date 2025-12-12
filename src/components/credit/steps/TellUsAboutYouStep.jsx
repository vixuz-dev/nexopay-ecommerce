import React, { useState } from 'react';
import { HiOutlineInformationCircle, HiOutlineUser, HiOutlineCreditCard, HiOutlineDocumentText, HiOutlineShoppingBag } from 'react-icons/hi2';
import { useCreditForm } from '../CreditWizard';

const TellUsAboutYouStep = () => {
  const { formData, updateFormData } = useCreditForm();
  const eligibilityData = formData.eligibility || {};

  const handleChange = (field, value) => {
    const newData = { ...eligibilityData, [field]: value };
    
    if (field === 'solicitud_aprobada' && value === false) {
      newData.solicitud_aprobada_periodo = '';
      newData.solicitud_aprobada_ultimos_2_meses = false;
      newData.solicitud_aprobada_ultimos_3_4_meses = false;
      newData.solicitud_aprobada_ultimos_5_6_meses = false;
    }
    
    if (field === 'solicitud_aprobada_periodo') {
      newData.solicitud_aprobada_ultimos_2_meses = value === 'ultimos_2_meses';
      newData.solicitud_aprobada_ultimos_3_4_meses = value === '3_4_meses';
      newData.solicitud_aprobada_ultimos_5_6_meses = value === '5_6_meses';
    }
    
    if (field === 'solicitud_rechazada' && value === false) {
      newData.solicitud_rechazada_periodo = '';
      newData.solicitud_rechazada_ultimos_2_meses = false;
      newData.solicitud_rechazada_ultimos_3_4_meses = false;
      newData.solicitud_rechazada_ultimos_5_6_meses = false;
    }
    
    if (field === 'solicitud_rechazada_periodo') {
      newData.solicitud_rechazada_ultimos_2_meses = value === 'ultimos_2_meses';
      newData.solicitud_rechazada_ultimos_3_4_meses = value === '3_4_meses';
      newData.solicitud_rechazada_ultimos_5_6_meses = value === '5_6_meses';
    }
    
    updateFormData({ eligibility: newData });
  };

  const handleBooleanChange = (field, value) => {
    handleChange(field, value === 'Si');
  };

  const handleNumberChange = (field, value) => {
    const numValue = value === '' ? '' : parseInt(value, 10);
    if (!isNaN(numValue) || value === '') {
      handleChange(field, value === '' ? '' : numValue);
    }
  };

  return (
    <div>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ¿Cuántos años tienes? <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={eligibilityData.edad || ''}
                  onChange={(e) => handleNumberChange('edad', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  placeholder="Ingresa tu edad"
                />
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
                      checked={eligibilityData.residencia_pais === true}
                      onChange={() => handleBooleanChange('residencia_pais', 'Si')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="residencia_pais"
                      checked={eligibilityData.residencia_pais === false}
                      onChange={() => handleBooleanChange('residencia_pais', 'No')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ¿Cuál es tu ingreso mensual aproximado? (MXN) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={eligibilityData.ingreso_mensual || ''}
                  onChange={(e) => handleNumberChange('ingreso_mensual', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  placeholder="Ingresa tu ingreso mensual"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ¿Cuánto tiempo llevas en tu trabajo actual? <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={eligibilityData.antiguedad_laboral || ''}
                    onChange={(e) => handleNumberChange('antiguedad_laboral', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                    placeholder="Número de meses"
                  />
                  <span className="text-sm text-gray-500 whitespace-nowrap">meses</span>
                </div>
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
                      checked={eligibilityData.uso_tarjeta_credito === true}
                      onChange={() => handleBooleanChange('uso_tarjeta_credito', 'Si')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="uso_tarjeta_credito"
                      checked={eligibilityData.uso_tarjeta_credito === false}
                      onChange={() => handleBooleanChange('uso_tarjeta_credito', 'No')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
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
                      checked={eligibilityData.pago_servicios_debito_transferencia === true}
                      onChange={() => handleBooleanChange('pago_servicios_debito_transferencia', 'Si')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pago_servicios_debito_transferencia"
                      checked={eligibilityData.pago_servicios_debito_transferencia === false}
                      onChange={() => handleBooleanChange('pago_servicios_debito_transferencia', 'No')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
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
                        checked={eligibilityData.solicitud_aprobada === true}
                        onChange={() => handleBooleanChange('solicitud_aprobada', 'Si')}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Sí</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="solicitud_aprobada"
                        checked={eligibilityData.solicitud_aprobada === false}
                        onChange={() => handleBooleanChange('solicitud_aprobada', 'No')}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                {eligibilityData.solicitud_aprobada === true && (
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
                          onClick={() => handleChange('solicitud_aprobada_periodo', option.value)}
                          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                            eligibilityData.solicitud_aprobada_periodo === option.value
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'bg-white border border-gray-300 text-gray-700 hover:border-primary-400'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
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
                        checked={eligibilityData.solicitud_rechazada === true}
                        onChange={() => handleBooleanChange('solicitud_rechazada', 'Si')}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Sí</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="solicitud_rechazada"
                        checked={eligibilityData.solicitud_rechazada === false}
                        onChange={() => handleBooleanChange('solicitud_rechazada', 'No')}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                {eligibilityData.solicitud_rechazada === true && (
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
                          onClick={() => handleChange('solicitud_rechazada_periodo', option.value)}
                          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                            eligibilityData.solicitud_rechazada_periodo === option.value
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'bg-white border border-gray-300 text-gray-700 hover:border-primary-400'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ¿Cuál es el total de tu compra? (MXN) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={eligibilityData.total_compra || ''}
                onChange={(e) => handleNumberChange('total_compra', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                placeholder="Ingresa el total de tu compra"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TellUsAboutYouStep;

