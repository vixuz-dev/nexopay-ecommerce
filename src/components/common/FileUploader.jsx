import React, { useState, useRef, useCallback } from 'react';
import { HiOutlinePhoto, HiOutlineXMark, HiOutlineCheckCircle, HiOutlineArrowUpTray } from 'react-icons/hi2';

const FileUploader = ({
  onFileSelect,
  currentFile = null,
  accept = 'image/*',
  maxSizeMB = 5,
  label = 'Subir archivo',
  description = 'Arrastra y suelta o haz clic para seleccionar',
  disabled = false
}) => {
  const [preview, setPreview] = useState(currentFile);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecciona un archivo de imagen válido');
      return false;
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
      return false;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`La imagen debe ser menor a ${maxSizeMB}MB`);
      return false;
    }

    return true;
  };

  const handleFileSelect = useCallback((file) => {
    setError('');
    setIsValid(false);

    if (!file) return;

    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result;
      setPreview(imageUrl);
      setIsValid(true);
      onFileSelect(file, imageUrl);
    };
    reader.onerror = () => {
      setError('Error al leer el archivo');
    };
    reader.readAsDataURL(file);
  }, [maxSizeMB, onFileSelect]);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
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
    onFileSelect(null, null);
  };

  const getFileTypes = () => {
    if (accept === 'image/*') {
      return 'PNG, JPG, JPEG, WEBP';
    }
    return accept.split(',').map((t) => t.trim().replace('image/', '').toUpperCase()).join(', ');
  };

  return (
    <div className="space-y-3">
      {!preview ? (
        <div
          onDragOver={disabled ? undefined : handleDragOver}
          onDragLeave={disabled ? undefined : handleDragLeave}
          onDrop={disabled ? undefined : handleDrop}
          onClick={disabled ? undefined : () => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-8 transition-all duration-200
            ${disabled 
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' 
              : isDragging 
              ? 'border-primary-500 bg-primary-50 scale-[1.02] cursor-pointer' 
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50 cursor-pointer'
            }
          `}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <div className={`
              w-20 h-20 rounded-full flex items-center justify-center
              transition-colors duration-200
              ${isDragging ? 'bg-primary-100' : 'bg-gray-100'}
            `}>
              <HiOutlineArrowUpTray className={`
                w-10 h-10 transition-colors duration-200
                ${isDragging ? 'text-primary-600' : 'text-gray-400'}
              `} />
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900 text-lg mb-1">
                {label}
              </p>
              <p className="text-sm text-gray-500">
                {description}
              </p>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {getFileTypes()} • Máx. {maxSizeMB}MB
            </div>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <div className="relative border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-md">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-[400px] object-contain mx-auto block"
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
              aria-label="Eliminar archivo"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;

