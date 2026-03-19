import React from 'react';
import { 
  HiOutlineCheckCircle, 
  HiOutlineMapPin, 
  HiOutlineUser, 
  HiOutlineDocumentText,
  HiOutlineCreditCard,
  HiOutlineShoppingBag,
  HiOutlineCamera,
  HiOutlineEnvelope
} from 'react-icons/hi2';
import { useCreditForm } from '../../../stores/creditFormStore';

const ConfirmationStep = () => {
  const { formData } = useCreditForm();
  
  const personalAddress = formData.personalAddress || {};
  const identityVerification = formData.identityVerification || {};
  const officialId = formData.officialId || {};
  const emailCurp = formData.emailCurp || {};
  const personalReferences = formData.personalReferences || {};
  const eligibility = formData.eligibility || {};

  const formatCurrency = (amount) => {
    if (!amount) return 'No especificado';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatBoolean = (value) => {
    if (value === true) return 'Sí';
    if (value === false) return 'No';
    return 'No especificado';
  };

  const formatPeriod = (period) => {
    const periods = {
      'ultimos_2_meses': 'En los últimos 2 meses',
      '3_4_meses': 'Hace 3 a 4 meses',
      '5_6_meses': 'Hace 5 a 6 meses'
    };
    return periods[period] || 'No especificado';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 id="step-title-8" className="text-2xl font-bold text-gray-900 mb-2">
          Confirmación
        </h2>
        <p className="text-gray-600">
          Revisa y confirma tu solicitud. Verifica que toda la información sea correcta antes de continuar.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <HiOutlineCheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-green-800 leading-relaxed">
                Por favor, revisa cuidadosamente toda la información antes de confirmar tu solicitud. Una vez confirmada, procederemos con el análisis de tu perfil crediticio.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <HiOutlineMapPin className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Dirección personal</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Calle:</span>
                <p className="font-medium text-gray-900">{personalAddress.calle || 'No especificado'}</p>
              </div>
              <div>
                <span className="text-gray-500">Número exterior:</span>
                <p className="font-medium text-gray-900">{personalAddress.numeroExterior || 'No especificado'}</p>
              </div>
              <div>
                <span className="text-gray-500">Colonia:</span>
                <p className="font-medium text-gray-900">{personalAddress.colonia || 'No especificado'}</p>
              </div>
              <div>
                <span className="text-gray-500">Ciudad:</span>
                <p className="font-medium text-gray-900">{personalAddress.ciudad || 'No especificado'}</p>
              </div>
              <div>
                <span className="text-gray-500">Estado:</span>
                <p className="font-medium text-gray-900">{personalAddress.estado || 'No especificado'}</p>
              </div>
              <div>
                <span className="text-gray-500">Código postal:</span>
                <p className="font-medium text-gray-900">{personalAddress.codigoPostal || 'No especificado'}</p>
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <HiOutlineCamera className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Verificación de identidad</h3>
            </div>
            <div className="flex items-center gap-3">
              {identityVerification.selfieUrl ? (
                <>
                  <HiOutlineCheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Foto de rostro cargada</span>
                </>
              ) : (
                <span className="text-sm text-gray-500">No se ha cargado foto</span>
              )}
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <HiOutlineDocumentText className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Identificación Oficial</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {officialId.frontUrl ? (
                  <>
                    <HiOutlineCheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Parte frontal cargada</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">Parte frontal no cargada</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {officialId.backUrl ? (
                  <>
                    <HiOutlineCheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Parte trasera cargada</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">Parte trasera no cargada</span>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <HiOutlineEnvelope className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Datos complementarios</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Correo electrónico:</span>
                <p className="font-medium text-gray-900">{emailCurp.email || 'No especificado'}</p>
              </div>
              <div>
                <span className="text-gray-500">CURP:</span>
                <p className="font-medium text-gray-900">{emailCurp.curp || 'No especificado'}</p>
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <HiOutlineUser className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Referencias personales</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 text-sm">Primera referencia</h4>
                {personalReferences.reference1 ? (
                  <div className="pl-4 border-l-2 border-primary-200 space-y-1 text-sm">
                    <p><span className="text-gray-500">Nombre:</span> <span className="font-medium text-gray-900">
                      {personalReferences.reference1.nombres} {personalReferences.reference1.apellidoPaterno} {personalReferences.reference1.apellidoMaterno}
                    </span></p>
                    <p><span className="text-gray-500">Teléfono:</span> <span className="font-medium text-gray-900">{personalReferences.reference1.telefono || 'No especificado'}</span></p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 pl-4">No completada</p>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 text-sm">Segunda referencia</h4>
                {personalReferences.reference2 ? (
                  <div className="pl-4 border-l-2 border-primary-200 space-y-1 text-sm">
                    <p><span className="text-gray-500">Nombre:</span> <span className="font-medium text-gray-900">
                      {personalReferences.reference2.nombres} {personalReferences.reference2.apellidoPaterno} {personalReferences.reference2.apellidoMaterno}
                    </span></p>
                    <p><span className="text-gray-500">Teléfono:</span> <span className="font-medium text-gray-900">{personalReferences.reference2.telefono || 'No especificado'}</span></p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 pl-4">No completada</p>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <HiOutlineCreditCard className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Perfil crediticio</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Edad:</span>
                <p className="font-medium text-gray-900">{eligibility.edad ? `${eligibility.edad} años` : 'No especificado'}</p>
              </div>
              <div>
                <span className="text-gray-500">Reside en México:</span>
                <p className="font-medium text-gray-900">{formatBoolean(eligibility.residencia_pais)}</p>
              </div>
              <div>
                <span className="text-gray-500">Ingreso mensual:</span>
                <p className="font-medium text-gray-900">{formatCurrency(eligibility.ingreso_mensual)}</p>
              </div>
              <div>
                <span className="text-gray-500">Antigüedad laboral:</span>
                <p className="font-medium text-gray-900">{eligibility.antiguedad_laboral ? `${eligibility.antiguedad_laboral} meses` : 'No especificado'}</p>
              </div>
              <div>
                <span className="text-gray-500">Usa tarjeta de crédito:</span>
                <p className="font-medium text-gray-900">{formatBoolean(eligibility.uso_tarjeta_credito)}</p>
              </div>
              <div>
                <span className="text-gray-500">Paga servicios con débito/transferencia:</span>
                <p className="font-medium text-gray-900">{formatBoolean(eligibility.pago_servicios_debito_transferencia)}</p>
              </div>
              {eligibility.solicitud_aprobada && (
                <div>
                  <span className="text-gray-500">Última aprobación:</span>
                  <p className="font-medium text-gray-900">{formatPeriod(eligibility.solicitud_aprobada_periodo)}</p>
                </div>
              )}
              {eligibility.solicitud_rechazada && (
                <div>
                  <span className="text-gray-500">Último rechazo:</span>
                  <p className="font-medium text-gray-900">{formatPeriod(eligibility.solicitud_rechazada_periodo)}</p>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <HiOutlineShoppingBag className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Compra</h3>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Total de compra:</span>
              <p className="font-bold text-lg text-primary-600 mt-1">{formatCurrency(eligibility.total_compra)}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;

