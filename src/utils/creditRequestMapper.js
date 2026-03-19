/**
 * Utility to map formData from creditFormStore to backend API format
 */

/**
 * Convert file to base64 string with data URI prefix
 * @param {File} file - File object
 * @returns {Promise<string>} - Base64 string with data URI prefix
 */
const fileToBase64WithPrefix = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Backend expects: "image/png,<base64>,.png"
 * Converts data URL (data:image/png;base64,XXX) to backend format
 * @param {string} dataUrlOrBase64 - data:image/xxx;base64,... or raw base64
 * @returns {string} - "image/png,<base64>,.png"
 */
const toBackendImageFormat = (dataUrlOrBase64) => {
  if (!dataUrlOrBase64 || typeof dataUrlOrBase64 !== 'string') return '';
  const trimmed = dataUrlOrBase64.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('data:')) {
    const match = trimmed.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return trimmed;
    const mime = match[1];
    const base64 = match[2];
    const ext = mime === 'image/png' ? 'png' : mime === 'image/jpeg' || mime === 'image/jpg' ? 'jpg' : mime === 'image/webp' ? 'webp' : 'png';
    return `${mime},${base64},.${ext}`;
  }
  return `image/png,${trimmed},.png`;
};

/**
 * Map formData to backend credit request format
 * @param {object} formData - Form data from creditFormStore
 * @returns {Promise<object>} - Formatted request object for backend
 */
export const mapCreditRequestToBackend = async (formData) => {
  const personalAddress = formData.personalAddress || {};
  const location = formData.location || {};
  const identityVerification = formData.identityVerification || {};
  const personalReferences = formData.personalReferences || {};
  const eligibility = formData.eligibility || {};
  const officialId = formData.officialId || {};
  const emailCurp = formData.emailCurp || {};

  let selfieBase64 = '';
  if (identityVerification.selfieFile) {
    const dataUrl = await fileToBase64WithPrefix(identityVerification.selfieFile);
    selfieBase64 = toBackendImageFormat(dataUrl);
  } else if (identityVerification.selfieUrl) {
    selfieBase64 = toBackendImageFormat(identityVerification.selfieUrl);
  }

  const frontKycData = officialId.frontKycData || {};
  const backKycData = officialId.backKycData || {};
  const passportKycData = officialId.passportKycData || {};

  let birthdate = '';
  if (officialId.documentType === 'passport' && passportKycData.dateOfBirth) {
    birthdate = passportKycData.dateOfBirth;
  } else if (officialId.documentType === 'ine' && frontKycData.dateOfBirth) {
    birthdate = frontKycData.dateOfBirth;
  }

  const references = [];
  
  if (personalReferences.reference1) {
    const ref1 = personalReferences.reference1;
    references.push({
      name: ref1.nombres || '',
      paternalName: ref1.apellidoPaterno || '',
      maternalName: ref1.apellidoMaterno || '',
      phoneNumber: ref1.telefono || '',
      street: ref1.calle || '',
      externalNumber: ref1.numeroExterior || '',
      internalNumber: ref1.numeroInterior || '',
      neighborhood: ref1.colonia || '',
      city: ref1.ciudad || '',
      state: ref1.estado || '',
      zipCode: ref1.codigoPostal || '',
      requestReferences: ref1.referenciaUbicacion || ''
    });
  }

  if (personalReferences.reference2) {
    const ref2 = personalReferences.reference2;
    references.push({
      name: ref2.nombres || '',
      paternalName: ref2.apellidoPaterno || '',
      maternalName: ref2.apellidoMaterno || '',
      phoneNumber: ref2.telefono || '',
      street: ref2.calle || '',
      externalNumber: ref2.numeroExterior || '',
      internalNumber: ref2.numeroInterior || '',
      neighborhood: ref2.colonia || '',
      city: ref2.ciudad || '',
      state: ref2.estado || '',
      zipCode: ref2.codigoPostal || '',
      requestReferences: ref2.referenciaUbicacion || ''
    });
  }

  const approvedRequests = {
    last2Months: eligibility.solicitud_aprobada && eligibility.solicitud_aprobada_periodo === 'ultimos_2_meses',
    last3To4Months: eligibility.solicitud_aprobada && eligibility.solicitud_aprobada_periodo === '3_4_meses',
    last5To6Months: eligibility.solicitud_aprobada && eligibility.solicitud_aprobada_periodo === '5_6_meses'
  };

  const rejectedRequests = {
    last2Months: eligibility.solicitud_rechazada && eligibility.solicitud_rechazada_periodo === 'ultimos_2_meses',
    last3To4Months: eligibility.solicitud_rechazada && eligibility.solicitud_rechazada_periodo === '3_4_meses',
    last5To6Months: eligibility.solicitud_rechazada && eligibility.solicitud_rechazada_periodo === '5_6_meses'
  };

  let identificationFront = '';
  let identificationBack = '';
  if (officialId.frontFile) {
    const dataUrl = await fileToBase64WithPrefix(officialId.frontFile);
    identificationFront = toBackendImageFormat(dataUrl);
  } else if (officialId.frontUrl) {
    identificationFront = toBackendImageFormat(officialId.frontUrl);
  }
  if (officialId.backFile) {
    const dataUrl = await fileToBase64WithPrefix(officialId.backFile);
    identificationBack = toBackendImageFormat(dataUrl);
  } else if (officialId.backUrl) {
    identificationBack = toBackendImageFormat(officialId.backUrl);
  }
  if (officialId.passportFile) {
    const dataUrl = await fileToBase64WithPrefix(officialId.passportFile);
    identificationFront = toBackendImageFormat(dataUrl);
  } else if (officialId.passportUrl) {
    identificationFront = toBackendImageFormat(officialId.passportUrl);
  }

  const docType = officialId.documentType || 'ine';
  let identificationData = {};
  if (docType === 'ine') {
    identificationData = {
      ineFront: {
        documentType: frontKycData.documentType || 'ine',
        name: frontKycData.name || '',
        curp: frontKycData.curp || '',
        electorKey: frontKycData.electorKey || '',
        dateOfBirth: frontKycData.dateOfBirth || '',
        address: frontKycData.address || '',
        section: frontKycData.section || '',
        dateOfExpiry: frontKycData.dateOfExpiry || ''
      },
      ineBack: {
        documentType: backKycData.documentType || 'ine',
        mrzLine1: backKycData.mrzLine1 || '',
        mrzLine2: backKycData.mrzLine2 || '',
        mrzLine3: backKycData.mrzLine3 || ''
      }
    };
  } else if (docType === 'passport') {
    identificationData = {
      documentType: 'passport',
      issuingCountry: passportKycData.issuingCountry || '',
      documentNumber: passportKycData.documentNumber || '',
      lastName: passportKycData.lastName || passportKycData.last_name || '',
      firstName: passportKycData.firstName || passportKycData.names || '',
      nationality: passportKycData.nationality || '',
      dateOfBirth: passportKycData.dateOfBirth || '',
      sex: passportKycData.sex || '',
      dateOfExpiry: passportKycData.dateOfExpiry || '',
      mrzLine1: passportKycData.mrzLine1 || '',
      mrzLine2: passportKycData.mrzLine2 || ''
    };
  }

  const creditLineRequest = {
    email: emailCurp.email || '',
    curp: (emailCurp.curp || '').toUpperCase(),
    birthdate,
    street: personalAddress.calle || '',
    externalNumber: personalAddress.numeroExterior || '',
    internalNumber: personalAddress.numeroInterior || '',
    neighborhood: personalAddress.colonia || '',
    city: personalAddress.ciudad || '',
    state: personalAddress.estado || '',
    zipCode: personalAddress.codigoPostal || '',
    locationReferences: personalAddress.referencias || '',
    latitude: location.lat ? String(location.lat) : '',
    longitude: location.lng ? String(location.lng) : '',
    selfie: selfieBase64,
    identificationType: docType,
    identificationData,
    identificationFront,
    identificationBack
  };

  return {
    creditLineRequest,
    references,
    additionalInformation: {
      age: eligibility.edad || 0,
      countryResidence: eligibility.residencia_pais !== undefined ? eligibility.residencia_pais : false,
      monthlyIncome: eligibility.ingreso_mensual || 0,
      creditCardUsage: eligibility.uso_tarjeta_credito !== undefined ? eligibility.uso_tarjeta_credito : false,
      utilityDebitTransfer: eligibility.pago_servicios_debito_transferencia !== undefined ? eligibility.pago_servicios_debito_transferencia : false,
      employmentTenure: eligibility.antiguedad_laboral || 0,
      approvedRequests,
      rejectedRequests,
      total_purchase: eligibility.total_compra || 0
    }
  };
};

