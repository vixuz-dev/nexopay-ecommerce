import React, { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle, HiOutlineDocumentText, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineLockClosed, HiOutlineArrowPath, HiOutlineIdentification } from 'react-icons/hi2';
import FileUploader from '../../common/FileUploader';
import DocumentVerificationLoader from '../../common/DocumentVerificationLoader';
import { useCreditForm } from '../../../stores/creditFormStore';
import { kycService } from '../../../api/services/kycService';
import { fileToBase64 } from '../../../utils/imageUtils';

const OfficialIdStep = ({ setCustomNextHandler }) => {
  const { formData, updateFormData, goToNextStep, setIsCurrentStepValid } = useCreditForm();
  const officialIdData = formData.officialId || {};
  const [documentType, setDocumentType] = useState(officialIdData.documentType || null);
  const [validationError, setValidationError] = useState('');
  const [isProcessingFront, setIsProcessingFront] = useState(false);
  const [isProcessingBack, setIsProcessingBack] = useState(false);
  const [isProcessingPassport, setIsProcessingPassport] = useState(false);
  const [processingErrorFront, setProcessingErrorFront] = useState('');
  const [processingErrorBack, setProcessingErrorBack] = useState('');
  const [processingErrorPassport, setProcessingErrorPassport] = useState('');
  const [retryCountFront, setRetryCountFront] = useState(0);
  const [retryCountBack, setRetryCountBack] = useState(0);
  const [retryCountPassport, setRetryCountPassport] = useState(0);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);

  const MAX_RETRIES = 3;

  const requiredFrontFields = [
    'documentType',
    'name',
    'curp',
    'electorKey',
    'dateOfBirth',
    'address',
    'section',
    'dateOfExpiry'
  ];

  const requiredBackFields = [
    'documentType',
    'mrzLine1',
    'mrzLine2',
    'mrzLine3',
  ];

  const requiredPassportFields = [
    'documentType',
    'issuingCountry',
    'documentNumber',
    'lastName',
    'firstName',
    'nationality',
    'dateOfBirth',
    'sex',
    'dateOfExpiry',
    'mrzLine1',
    'mrzLine2'
  ];

  const validateFrontKycData = (kycData) => {
    if (!kycData || kycData.documentType !== 'ine') {
      return { valid: false, missingFields: ['Tipo de documento debe ser INE'] };
    }

    const missingFields = [];
    requiredFrontFields.forEach(field => {
      if (!kycData[field] || String(kycData[field]).trim() === '') {
        missingFields.push(field);
      }
    });

    return {
      valid: missingFields.length === 0,
      missingFields
    };
  };

  const validateBackKycData = (kycData) => {
    if (!kycData || kycData.documentType !== 'ine') {
      return { valid: false, missingFields: ['Tipo de documento debe ser INE'] };
    }

    const missingFields = [];
    requiredBackFields.forEach(field => {
      if (!kycData[field] || String(kycData[field]).trim() === '') {
        missingFields.push(field);
      }
    });

    return {
      valid: missingFields.length === 0,
      missingFields
    };
  };

  const validatePassportKycData = (kycData) => {
    if (!kycData || kycData.documentType !== 'passport') {
      return { valid: false, missingFields: ['Tipo de documento debe ser pasaporte'] };
    }

    const missingFields = [];
    requiredPassportFields.forEach(field => {
      if (!kycData[field] || String(kycData[field]).trim() === '') {
        missingFields.push(field);
      }
    });

    return {
      valid: missingFields.length === 0,
      missingFields
    };
  };

  const handleDocumentTypeSelect = (type) => {
    setDocumentType(type);
    updateFormData({
      officialId: {
        documentType: type,
        frontFile: null,
        frontUrl: null,
        frontKycData: null,
        frontValidated: false,
        backFile: null,
        backUrl: null,
        backKycData: null,
        backValidated: false,
        passportFile: null,
        passportUrl: null,
        passportKycData: null,
        passportValidated: false,
      }
    });
    setValidationError('');
    setProcessingErrorFront('');
    setProcessingErrorBack('');
    setProcessingErrorPassport('');
    setRetryCountFront(0);
    setRetryCountBack(0);
    setRetryCountPassport(0);
  };

  const processPassportImage = async (file, imageUrl, isRetry = false) => {
    if (!file || !imageUrl) return;

    setIsProcessingPassport(true);
    setProcessingErrorPassport('');

    try {
      const base64 = await fileToBase64(file);
      const kycData = await kycService.evaluateDocument(base64, 'passport');
      
      const validation = validatePassportKycData(kycData);
      
      if (!validation.valid) {
        const currentRetries = isRetry ? retryCountPassport + 1 : retryCountPassport;
        
        if (currentRetries >= MAX_RETRIES) {
          setProcessingErrorPassport('No se pudo analizar correctamente la imagen después de varios intentos. Por favor, usa otra imagen más clara y completa.');
          setRetryCountPassport(MAX_RETRIES);
          updateFormData({
            officialId: {
              ...officialIdData,
              passportFile: file,
              passportUrl: imageUrl,
              passportKycData: null,
              passportValidated: false,
            }
          });
        } else {
          setProcessingErrorPassport('No se pudo analizar correctamente la imagen. Intenta nuevamente.');
          setRetryCountPassport(currentRetries);
          updateFormData({
            officialId: {
              ...officialIdData,
              passportFile: file,
              passportUrl: imageUrl,
              passportKycData: null,
              passportValidated: false,
            }
          });
        }
      } else {
        updateFormData({
          officialId: {
            ...officialIdData,
            passportFile: file,
            passportUrl: imageUrl,
            passportKycData: {
              ...kycData,
              position: 'passport'
            },
            passportValidated: true,
          }
        });
        setRetryCountPassport(0);
      }
    } catch (error) {
      console.error('Error procesando pasaporte:', error);
      
      // Error de formato no cuenta como retry, es un error de validación
      if (error.isFormatError) {
        setProcessingErrorPassport(error.message || 'Formato de imagen no válido. Solo se permiten PNG, JPG, JPEG y WEBP.');
        setRetryCountPassport(0);
        updateFormData({
          officialId: {
            ...officialIdData,
            passportFile: file,
            passportUrl: imageUrl,
            passportKycData: null,
            passportValidated: false,
          }
        });
        setIsProcessingPassport(false);
        return;
      }
      
      const currentRetries = isRetry ? retryCountPassport + 1 : retryCountPassport;
      
      if (currentRetries >= MAX_RETRIES) {
        let errorMessage = 'No se pudo procesar la imagen después de varios intentos. Por favor, usa otra imagen más clara.';
        
        if (error.isTimeout) {
          errorMessage = 'El procesamiento está tomando demasiado tiempo. Por favor, intenta con otra imagen.';
        } else if (error.isNetworkError) {
          errorMessage = 'Error de conexión persistente. Por favor, verifica tu conexión e intenta con otra imagen.';
        }
        
        setProcessingErrorPassport(errorMessage);
        setRetryCountPassport(MAX_RETRIES);
      } else {
        let errorMessage = 'Error al procesar el documento. Por favor, verifica que la imagen sea clara y legible.';
        
        if (error.isTimeout) {
          errorMessage = 'El procesamiento está tomando más tiempo del esperado. Intenta nuevamente.';
        } else if (error.isNetworkError) {
          errorMessage = 'Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setProcessingErrorPassport(errorMessage);
        setRetryCountPassport(currentRetries);
      }
      
      updateFormData({
        officialId: {
          ...officialIdData,
          passportFile: file,
          passportUrl: imageUrl,
          passportKycData: null,
          passportValidated: false,
        }
      });
    } finally {
      setIsProcessingPassport(false);
    }
  };

  const processFrontImage = async (file, imageUrl, isRetry = false) => {
    if (!file || !imageUrl) return;

    setIsProcessingFront(true);
    setProcessingErrorFront('');

    try {
      const base64 = await fileToBase64(file);
      const kycData = await kycService.evaluateDocument(base64, 'ine_front');
      
      const validation = validateFrontKycData(kycData);
      
      if (!validation.valid) {
        const currentRetries = isRetry ? retryCountFront + 1 : retryCountFront;
        
        if (currentRetries >= MAX_RETRIES) {
          setProcessingErrorFront('No se pudo analizar correctamente la imagen después de varios intentos. Por favor, usa otra imagen más clara y completa.');
          setRetryCountFront(MAX_RETRIES);
          updateFormData({
            officialId: {
              ...officialIdData,
              frontFile: file,
              frontUrl: imageUrl,
              frontKycData: null,
              frontValidated: false,
            }
          });
        } else {
          setProcessingErrorFront('¡Ups! no pudimos analizar correctamente tu imagen, asegúrate de que sea visible');
          setRetryCountFront(currentRetries);
          updateFormData({
            officialId: {
              ...officialIdData,
              frontFile: file,
              frontUrl: imageUrl,
              frontKycData: null,
              frontValidated: false,
            }
          });
        }
      } else {
        updateFormData({
          officialId: {
            ...officialIdData,
            frontFile: file,
            frontUrl: imageUrl,
            frontKycData: {
              ...kycData,
              position: 'front'
            },
            frontValidated: true,
          }
        });
        setRetryCountFront(0);
        setShowUnlockAnimation(true);
        setTimeout(() => {
          setShowUnlockAnimation(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error procesando documento frontal:', error);
      
      // Error de formato no cuenta como retry, es un error de validación
      if (error.isFormatError) {
        setProcessingErrorFront(error.message || 'Formato de imagen no válido. Solo se permiten PNG, JPG, JPEG y WEBP.');
        setRetryCountFront(0);
        updateFormData({
          officialId: {
            ...officialIdData,
            frontFile: file,
            frontUrl: imageUrl,
            frontKycData: null,
            frontValidated: false,
          }
        });
        setIsProcessingFront(false);
        return;
      }
      
      const currentRetries = isRetry ? retryCountFront + 1 : retryCountFront;
      
      if (currentRetries >= MAX_RETRIES) {
        let errorMessage = 'No se pudo procesar la imagen después de varios intentos. Por favor, usa otra imagen más clara.';
        
        if (error.isTimeout) {
          errorMessage = 'El procesamiento está tomando demasiado tiempo. Por favor, intenta con otra imagen.';
        } else if (error.isNetworkError) {
          errorMessage = 'Error de conexión persistente. Por favor, verifica tu conexión e intenta con otra imagen.';
        }
        
        setProcessingErrorFront(errorMessage);
        setRetryCountFront(MAX_RETRIES);
      } else {
        let errorMessage = '¡Ups! no pudimos analizar correctamente tu imagen, asegúrate de que sea visible';
        
        if (error.isTimeout) {
          errorMessage = 'El procesamiento está tomando más tiempo del esperado. Intenta nuevamente.';
        } else if (error.isNetworkError) {
          errorMessage = 'Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setProcessingErrorFront(errorMessage);
        setRetryCountFront(currentRetries);
      }
      
      updateFormData({
        officialId: {
          ...officialIdData,
          frontFile: file,
          frontUrl: imageUrl,
          frontKycData: null,
          frontValidated: false,
        }
      });
    } finally {
      setIsProcessingFront(false);
    }
  };

  const processBackImage = async (file, imageUrl, isRetry = false) => {
    if (!file || !imageUrl) return;

    setIsProcessingBack(true);
    setProcessingErrorBack('');

    try {
      const base64 = await fileToBase64(file);
      const kycData = await kycService.evaluateDocument(base64, 'ine_back');
      
      const validation = validateBackKycData(kycData);
      
      if (!validation.valid) {
        const currentRetries = isRetry ? retryCountBack + 1 : retryCountBack;
        
        if (currentRetries >= MAX_RETRIES) {
          setProcessingErrorBack('No se pudo analizar correctamente la imagen después de varios intentos. Por favor, usa otra imagen más clara y completa.');
          setRetryCountBack(MAX_RETRIES);
          updateFormData({
            officialId: {
              ...officialIdData,
              backFile: file,
              backUrl: imageUrl,
              backKycData: null,
              backValidated: false,
            }
          });
        } else {
          setProcessingErrorBack('¡Ups! no pudimos analizar correctamente tu imagen, asegúrate de que sea visible');
          setRetryCountBack(currentRetries);
          updateFormData({
            officialId: {
              ...officialIdData,
              backFile: file,
              backUrl: imageUrl,
              backKycData: null,
              backValidated: false,
            }
          });
        }
      } else {
        updateFormData({
          officialId: {
            ...officialIdData,
            backFile: file,
            backUrl: imageUrl,
            backKycData: {
              ...kycData,
              position: 'back'
            },
            backValidated: true,
          }
        });
        setRetryCountBack(0);
      }
    } catch (error) {
      console.error('Error procesando documento trasero:', error);
      
      // Error de formato no cuenta como retry, es un error de validación
      if (error.isFormatError) {
        setProcessingErrorBack(error.message || 'Formato de imagen no válido. Solo se permiten PNG, JPG, JPEG y WEBP.');
        setRetryCountBack(0);
        updateFormData({
          officialId: {
            ...officialIdData,
            backFile: file,
            backUrl: imageUrl,
            backKycData: null,
            backValidated: false,
          }
        });
        setIsProcessingBack(false);
        return;
      }
      
      const currentRetries = isRetry ? retryCountBack + 1 : retryCountBack;
      
      if (currentRetries >= MAX_RETRIES) {
        let errorMessage = 'No se pudo procesar la imagen después de varios intentos. Por favor, usa otra imagen más clara.';
        
        if (error.isTimeout) {
          errorMessage = 'El procesamiento está tomando demasiado tiempo. Por favor, intenta con otra imagen.';
        } else if (error.isNetworkError) {
          errorMessage = 'Error de conexión persistente. Por favor, verifica tu conexión e intenta con otra imagen.';
        }
        
        setProcessingErrorBack(errorMessage);
        setRetryCountBack(MAX_RETRIES);
      } else {
        let errorMessage = '¡Ups! no pudimos analizar correctamente tu imagen, asegúrate de que sea visible';
        
        if (error.isTimeout) {
          errorMessage = 'El procesamiento está tomando más tiempo del esperado. Intenta nuevamente.';
        } else if (error.isNetworkError) {
          errorMessage = 'Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setProcessingErrorBack(errorMessage);
        setRetryCountBack(currentRetries);
      }
      
      updateFormData({
        officialId: {
          ...officialIdData,
          backFile: file,
          backUrl: imageUrl,
          backKycData: null,
          backValidated: false,
        }
      });
    } finally {
      setIsProcessingBack(false);
    }
  };

  const handlePassportImageSelect = async (file, imageUrl) => {
    if (!file) {
      updateFormData({
        officialId: {
          ...officialIdData,
          passportFile: null,
          passportUrl: null,
          passportKycData: null,
          passportValidated: false,
        }
      });
      setProcessingErrorPassport('');
      setRetryCountPassport(0);
      return;
    }

    updateFormData({
      officialId: {
        ...officialIdData,
        passportFile: file,
        passportUrl: imageUrl,
        passportValidated: false,
      }
    });

    await processPassportImage(file, imageUrl, false);
  };

  const handleFrontImageSelect = async (file, imageUrl) => {
    if (!file) {
      updateFormData({
        officialId: {
          ...officialIdData,
          frontFile: null,
          frontUrl: null,
          frontKycData: null,
          frontValidated: false,
        }
      });
      setProcessingErrorFront('');
      setRetryCountFront(0);
      return;
    }

    updateFormData({
      officialId: {
        ...officialIdData,
        frontFile: file,
        frontUrl: imageUrl,
        frontValidated: false,
      }
    });

    await processFrontImage(file, imageUrl, false);
  };

  const handleBackImageSelect = async (file, imageUrl) => {
    if (!file) {
      updateFormData({
        officialId: {
          ...officialIdData,
          backFile: null,
          backUrl: null,
          backKycData: null,
          backValidated: false,
        }
      });
      setProcessingErrorBack('');
      setRetryCountBack(0);
      return;
    }

    updateFormData({
      officialId: {
        ...officialIdData,
        backFile: file,
        backUrl: imageUrl,
        backValidated: false,
      }
    });

    await processBackImage(file, imageUrl, false);
  };

  const handleRetryPassport = async () => {
    if (officialIdData.passportFile && officialIdData.passportUrl) {
      await processPassportImage(officialIdData.passportFile, officialIdData.passportUrl, true);
    }
  };

  const handleRetryFront = async () => {
    if (officialIdData.frontFile && officialIdData.frontUrl) {
      await processFrontImage(officialIdData.frontFile, officialIdData.frontUrl, true);
    }
  };

  const handleRetryBack = async () => {
    if (officialIdData.backFile && officialIdData.backUrl) {
      await processBackImage(officialIdData.backFile, officialIdData.backUrl, true);
    }
  };

  useEffect(() => {
    if (documentType === 'passport') {
      const isValid = officialIdData.passportValidated && officialIdData.passportKycData;
      setIsCurrentStepValid(isValid);
    } else if (documentType === 'ine') {
      const hasFront = officialIdData.frontValidated && officialIdData.frontKycData;
      const hasBack = officialIdData.backValidated && officialIdData.backKycData;
      setIsCurrentStepValid(hasFront && hasBack);
    } else {
      setIsCurrentStepValid(false);
    }
  }, [documentType, officialIdData.passportValidated, officialIdData.passportKycData, officialIdData.frontValidated, officialIdData.frontKycData, officialIdData.backValidated, officialIdData.backKycData, setIsCurrentStepValid]);

  useEffect(() => {
    if (setCustomNextHandler) {
      setCustomNextHandler(() => {
        if (!documentType) {
          setValidationError('Debes seleccionar un tipo de documento para continuar');
          return;
        }

        if (documentType === 'passport') {
          const isValid = officialIdData.passportValidated && officialIdData.passportKycData;
          if (!isValid) {
            setValidationError('Debes subir y validar tu pasaporte para continuar');
          } else {
            setValidationError('');
            goToNextStep();
            return;
          }
        } else if (documentType === 'ine') {
          const hasFront = officialIdData.frontValidated && officialIdData.frontKycData;
          const hasBack = officialIdData.backValidated && officialIdData.backKycData;
          
          if (!hasFront && !hasBack) {
            setValidationError('Debes subir y validar ambas partes de tu identificación para continuar');
          } else if (!hasFront) {
            setValidationError('Debes subir y validar la parte frontal de tu identificación para continuar');
          } else if (!hasBack) {
            setValidationError('Debes subir y validar la parte trasera de tu identificación para continuar');
          } else {
            setValidationError('');
            goToNextStep();
            return;
          }
        }
        
        setTimeout(() => {
          const errorElement = document.getElementById('official-id-validation-error');
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      });
    }
  }, [setCustomNextHandler, documentType, officialIdData.passportValidated, officialIdData.passportKycData, officialIdData.frontValidated, officialIdData.frontKycData, officialIdData.backValidated, officialIdData.backKycData, goToNextStep]);

  const tips = [
    'Asegúrate de que todos los datos sean legibles',
    'Evita reflejos y sombras en el documento',
    'Toma la foto en un lugar bien iluminado',
    'El documento debe estar completo y sin cortes',
    'Verifica que la foto esté enfocada y nítida'
  ];

  const isFrontValidated = officialIdData.frontValidated;
  const isBackValidated = officialIdData.backValidated;
  const isPassportValidated = officialIdData.passportValidated;
  const canUploadBack = isFrontValidated;
  const canRetryPassport = processingErrorPassport && retryCountPassport < MAX_RETRIES && officialIdData.passportFile;
  const canRetryFront = processingErrorFront && retryCountFront < MAX_RETRIES && officialIdData.frontFile;
  const canRetryBack = processingErrorBack && retryCountBack < MAX_RETRIES && officialIdData.backFile;
  const maxRetriesReachedPassport = retryCountPassport >= MAX_RETRIES;
  const maxRetriesReachedFront = retryCountFront >= MAX_RETRIES;
  const maxRetriesReachedBack = retryCountBack >= MAX_RETRIES;

  if (!documentType) {
    return (
      <div>
        <div className="mb-6">
          <h2 id="step-title-4" className="text-2xl font-bold text-gray-900 mb-2">
            Identificación Oficial
          </h2>
          <p className="text-gray-600">
            Selecciona el tipo de documento de identificación que deseas usar para tu solicitud.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => handleDocumentTypeSelect('ine')}
            className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-primary-500 hover:bg-primary-50 transition-all duration-300 text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <HiOutlineIdentification className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">INE</h3>
                <p className="text-sm text-gray-500">Credencial para votar</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Necesitarás subir ambas caras de tu INE (frontal y trasera) para completar la verificación.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleDocumentTypeSelect('passport')}
            className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-primary-500 hover:bg-primary-50 transition-all duration-300 text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <HiOutlineDocumentText className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Pasaporte</h3>
                <p className="text-sm text-gray-500">Documento de viaje</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Solo necesitarás subir una foto de tu pasaporte para completar la verificación.
            </p>
          </button>
        </div>
      </div>
    );
  }

  if (documentType === 'passport') {
    return (
      <div>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 id="step-title-4" className="text-2xl font-bold text-gray-900">
              Identificación Oficial - Pasaporte
            </h2>
            <button
              type="button"
              onClick={() => handleDocumentTypeSelect(null)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Cambiar tipo
            </button>
          </div>
          <p className="text-gray-600">
            Sube una foto clara de tu pasaporte. El sistema procesará automáticamente los datos de tu documento.
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

          <div className={`bg-white border-2 rounded-xl p-6 shadow-sm transition-all duration-500 ${
            isPassportValidated ? 'border-green-300 bg-green-50/30' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-500 ${
                  isPassportValidated
                    ? 'bg-green-500 text-white scale-110 shadow-lg'
                    : 'bg-primary-600 text-white'
                }`}>
                  {isPassportValidated ? (
                    <HiOutlineCheckCircle className="w-6 h-6 animate-bounce" />
                  ) : (
                    '1'
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Pasaporte <span className="text-red-500">*</span>
                  </h3>
                  <p className="text-xs text-gray-500">Sube una foto clara de tu pasaporte</p>
                </div>
              </div>
              {isPassportValidated && (
                <HiOutlineCheckCircle className="w-6 h-6 text-green-500 animate-pulse" />
              )}
            </div>

            <div className="relative">
              <FileUploader
                onFileSelect={handlePassportImageSelect}
                currentFile={officialIdData.passportUrl}
                accept="image/png,image/jpeg,image/jpg,image/webp"
                maxSizeMB={5}
                label="Sube la foto de tu pasaporte"
                description="Arrastra y suelta o haz clic para seleccionar"
                disabled={isPassportValidated}
              />
              {isProcessingPassport && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-xl z-10">
                  <DocumentVerificationLoader />
                </div>
              )}
            </div>

            {isPassportValidated && !isProcessingPassport && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <HiOutlineCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm font-medium text-green-800">Verificada con éxito</p>
                </div>
              </div>
            )}

            {processingErrorPassport && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <HiOutlineXCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800 mb-2">{processingErrorPassport}</p>
                    {canRetryPassport && (
                      <button
                        type="button"
                        onClick={handleRetryPassport}
                        disabled={isProcessingPassport}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
                      >
                        <HiOutlineArrowPath className={`w-4 h-4 ${isProcessingPassport ? 'animate-spin' : ''}`} />
                        Reintentar ({retryCountPassport}/{MAX_RETRIES})
                      </button>
                    )}
                    {maxRetriesReachedPassport && (
                      <p className="text-xs text-red-700 mt-2 font-semibold">
                        Ya intentaste el máximo de veces con esta imagen. Por favor, usa otra imagen.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {validationError && (
            <div id="official-id-validation-error" className="bg-red-50 border border-red-200 rounded-lg p-4">
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

          {isPassportValidated && !validationError && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 shadow-sm animate-pulse">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <HiOutlineCheckCircle className="w-6 h-6 text-green-600 animate-bounce" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-green-800 leading-relaxed">
                  Tu pasaporte ha sido validado correctamente. Puedes continuar al siguiente paso.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 id="step-title-4" className="text-2xl font-bold text-gray-900">
            Identificación Oficial - INE
          </h2>
          <button
            type="button"
            onClick={() => handleDocumentTypeSelect(null)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Cambiar tipo
          </button>
        </div>
        <p className="text-gray-600">
          Sube primero la parte frontal de tu identificación. Una vez validada, podrás subir la parte trasera. El sistema procesará automáticamente los datos de tu documento.
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
          <div className={`bg-white border-2 rounded-xl p-6 shadow-sm transition-all duration-500 ${
            isFrontValidated ? 'border-green-300 bg-green-50/30' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-500 ${
                  isFrontValidated
                    ? 'bg-green-500 text-white scale-110 shadow-lg'
                    : 'bg-primary-600 text-white'
                }`}>
                  {isFrontValidated ? (
                    <HiOutlineCheckCircle className="w-6 h-6" />
                  ) : (
                    '1'
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Parte frontal <span className="text-red-500">*</span>
                  </h3>
                  <p className="text-xs text-gray-500">Sube la parte frontal primero</p>
                </div>
              </div>
              {isFrontValidated && (
                <HiOutlineCheckCircle className="w-6 h-6 text-green-500" />
              )}
            </div>

            <div className="relative">
              <FileUploader
                onFileSelect={handleFrontImageSelect}
                currentFile={officialIdData.frontUrl}
                accept="image/png,image/jpeg,image/jpg,image/webp"
                maxSizeMB={5}
                label="Sube la foto frontal"
                description="Arrastra y suelta o haz clic para seleccionar"
                disabled={isFrontValidated}
              />
              {isProcessingFront && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-xl z-10">
                  <DocumentVerificationLoader />
                </div>
              )}
            </div>

            {isFrontValidated && !isProcessingFront && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <HiOutlineCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm font-medium text-green-800">Verificada con éxito</p>
                </div>
              </div>
            )}

            {processingErrorFront && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <HiOutlineXCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800 mb-2">{processingErrorFront}</p>
                    {canRetryFront && (
                      <button
                        type="button"
                        onClick={handleRetryFront}
                        disabled={isProcessingFront}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <HiOutlineArrowPath className={`w-3.5 h-3.5 ${isProcessingFront ? 'animate-spin' : ''}`} />
                        Reintentar
                      </button>
                    )}
                    {maxRetriesReachedFront && (
                      <p className="text-xs text-red-700 mt-2 font-semibold">
                        Ya intentaste el máximo de veces con esta imagen. Por favor, usa otra imagen.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`bg-white border-2 rounded-xl p-6 shadow-sm transition-all duration-500 relative ${
            !canUploadBack ? 'opacity-60 border-gray-200' : showUnlockAnimation ? 'border-primary-300 bg-primary-50/30' : 'border-gray-200'
          }`}>
            {!canUploadBack && (
              <div className={`absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 transition-all duration-500 ${
                showUnlockAnimation ? 'opacity-0 pointer-events-none' : ''
              }`}>
                <div className="text-center p-4">
                  <HiOutlineLockClosed className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-600">
                    Completa primero la parte frontal
                  </p>
                </div>
              </div>
            )}

            {showUnlockAnimation && canUploadBack && (
              <div className="absolute inset-0 bg-green-50/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-20 pointer-events-none">
                <div className="text-center p-4">
                  <HiOutlineCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />
                  <p className="text-lg font-bold text-green-700">
                    ¡Paso 1 completado!
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Ahora puedes subir la parte trasera
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-500 ${
                  isBackValidated
                    ? 'bg-green-500 text-white scale-110 shadow-lg'
                    : canUploadBack
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-300 text-gray-500'
                }`}>
                  {isBackValidated ? (
                    <HiOutlineCheckCircle className="w-6 h-6" />
                  ) : (
                    '2'
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Parte trasera <span className="text-red-500">*</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    {canUploadBack ? 'Sube la parte trasera' : 'Espera a completar la frontal'}
                  </p>
                </div>
              </div>
              {isBackValidated && (
                <HiOutlineCheckCircle className="w-6 h-6 text-green-500" />
              )}
            </div>

            <div className="relative">
              <FileUploader
                onFileSelect={handleBackImageSelect}
                currentFile={officialIdData.backUrl}
                accept="image/png,image/jpeg,image/jpg,image/webp"
                maxSizeMB={5}
                label="Sube la foto trasera"
                description="Arrastra y suelta o haz clic para seleccionar"
                disabled={!canUploadBack || isBackValidated}
              />
              {isProcessingBack && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-xl z-10">
                  <DocumentVerificationLoader />
                </div>
              )}
            </div>

            {isBackValidated && !isProcessingBack && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <HiOutlineCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm font-medium text-green-800">Verificada con éxito</p>
                </div>
              </div>
            )}

            {processingErrorBack && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <HiOutlineXCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800 mb-2">{processingErrorBack}</p>
                    {canRetryBack && (
                      <button
                        type="button"
                        onClick={handleRetryBack}
                        disabled={isProcessingBack}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <HiOutlineArrowPath className={`w-3.5 h-3.5 ${isProcessingBack ? 'animate-spin' : ''}`} />
                        Reintentar
                      </button>
                    )}
                    {maxRetriesReachedBack && (
                      <p className="text-xs text-red-700 mt-2 font-semibold">
                        Ya intentaste el máximo de veces con esta imagen. Por favor, usa otra imagen.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {validationError && (
          <div id="official-id-validation-error" className="bg-red-50 border border-red-200 rounded-lg p-4">
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

        {isFrontValidated && isBackValidated && !validationError && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <HiOutlineCheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm font-semibold text-green-800 leading-relaxed">
                Ambas partes de tu identificación han sido validadas correctamente. Puedes continuar al siguiente paso.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficialIdStep;
