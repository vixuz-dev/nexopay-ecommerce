import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { HiOutlineCamera, HiOutlinePhoto, HiOutlineXMark, HiOutlineCheckCircle } from 'react-icons/hi2';

const ImageUploader = ({
  onImageSelect,
  currentImage = null,
  accept = 'image/*',
  maxSizeMB = 5,
  label = 'Subir imagen',
  cameraOnly = false,
}) => {
  const [preview, setPreview] = useState(currentImage);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleFileSelect = (file) => {
    setError('');
    setIsValid(false);

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecciona un archivo de imagen válido');
      return;
    }

    // Validar formatos permitidos: PNG, JPG, JPEG, WEBP
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
    
    const isValidType = allowedTypes.includes(file.type.toLowerCase());
    const isValidExtension = allowedExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );

    if (!isValidType && !isValidExtension) {
      setError('Formato no soportado. Solo se permiten PNG, JPG, JPEG y WEBP');
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`La imagen debe ser menor a ${maxSizeMB}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result;
      setPreview(imageUrl);
      setIsValid(true);
      onImageSelect(file, imageUrl);
    };
    reader.onerror = () => {
      setError('Error al leer el archivo');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setIsValid(false);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageSelect(null, null);
  };

  const startCamera = () => {
    setError('');
    setShowCamera(true);
  };

  const stopCamera = () => {
    setShowCamera(false);
    setError('');
  };

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        fetch(imageSrc)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
            handleFileSelect(file);
            stopCamera();
          })
          .catch(err => {
            console.error('Error capturing photo:', err);
            setError('Error al capturar la foto. Por favor, intenta de nuevo.');
          });
      }
    }
  }, []);

  return (
    <div className="space-y-4">
      {!preview && !showCamera && (
        <div className={`flex gap-4 ${cameraOnly ? 'flex-col items-stretch' : 'flex-col sm:flex-row'}`}>
          {!cameraOnly && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex flex-col items-center justify-center gap-3 px-8 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
            >
              <div className="w-16 h-16 bg-gray-100 group-hover:bg-primary-100 rounded-full flex items-center justify-center transition-colors duration-200">
                <HiOutlinePhoto className="w-8 h-8 text-gray-600 group-hover:text-primary-600 transition-colors duration-200" />
              </div>
              <div className="text-center">
                <span className="font-bold text-gray-900 block text-lg">Subir foto</span>
                <span className="text-sm text-gray-500 mt-1">Desde tu dispositivo</span>
              </div>
            </button>
          )}

          <button
            type="button"
            onClick={startCamera}
            className={`flex flex-col items-center justify-center gap-3 px-8 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group ${cameraOnly ? 'w-full max-w-md mx-auto' : 'flex-1'}`}
          >
            <div className="w-16 h-16 bg-gray-100 group-hover:bg-primary-100 rounded-full flex items-center justify-center transition-colors duration-200">
              <HiOutlineCamera className="w-8 h-8 text-gray-600 group-hover:text-primary-600 transition-colors duration-200" />
            </div>
            <div className="text-center">
              <span className="font-bold text-gray-900 block text-lg">Tomar selfie</span>
              <span className="text-sm text-gray-500 mt-1">Usar cámara</span>
            </div>
          </button>
        </div>
      )}

      {showCamera && (
        <CameraModal
          webcamRef={webcamRef}
          onCapture={capturePhoto}
          onClose={stopCamera}
        />
      )}

      {preview && (
        <div className="relative group">
          <div className="relative border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-md">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-[500px] object-contain mx-auto block"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
          </div>
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            {isValid && (
              <div className="bg-green-500 text-white rounded-full p-2.5 shadow-lg">
                <HiOutlineCheckCircle className="w-5 h-5" />
              </div>
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="bg-white/90 hover:bg-white text-gray-700 rounded-full p-2.5 shadow-lg hover:scale-110 transition-all duration-200 backdrop-blur-sm"
              aria-label="Eliminar foto"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {!cameraOnly && (
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
        />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

const CameraModal = ({ webcamRef, onCapture, onClose }) => {
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-75"
        onClick={onClose}
      />
      <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl max-w-4xl w-full mx-4 aspect-video">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }}
          className="w-full h-full object-cover"
          mirrored={true}
        />
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
          aria-label="Cerrar"
        >
          <HiOutlineXMark className="w-6 h-6" />
        </button>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full transition-all duration-200 font-medium text-sm border border-white/30"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onCapture}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-200 border-4 border-white/30"
            aria-label="Capturar foto"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-900 rounded-full"></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;

