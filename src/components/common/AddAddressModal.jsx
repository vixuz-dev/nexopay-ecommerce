import React, { useState } from 'react';
import { HiOutlineXMark, HiOutlineMapPin } from 'react-icons/hi2';
import { addressService } from '../../api/services/addressService';
import useToastStore from '../../stores/toastStore';
import { isValidMexicanPhone, isValidMexicanPostalCode } from '../../utils/validation';

const INITIAL_FORM = {
  alias: '',
  nameReceived: '',
  phoneReceived: '',
  street: '',
  externalNumber: '',
  internalNumber: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
  addressReferences: '',
};

const AddAddressModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const showToast = useToastStore((s) => s.showToast);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'phoneReceived') {
      finalValue = value.replace(/\D/g, '').slice(0, 10);
    }
    if (name === 'zipCode') {
      finalValue = value.replace(/\D/g, '').slice(0, 5);
    }
    setForm((prev) => ({ ...prev, [name]: finalValue }));
    setError('');
  };

  const validate = () => {
    if (!form.alias?.trim() || form.alias.length < 2) {
      setError('El alias debe tener al menos 2 caracteres');
      return false;
    }
    if (!form.nameReceived?.trim() || form.nameReceived.length < 3) {
      setError('El nombre del destinatario debe tener al menos 3 caracteres');
      return false;
    }
    if (!isValidMexicanPhone(form.phoneReceived)) {
      setError('Ingresa un teléfono válido de 10 dígitos');
      return false;
    }
    if (!form.street?.trim() || form.street.length < 3) {
      setError('La calle debe tener al menos 3 caracteres');
      return false;
    }
    if (!form.externalNumber?.trim()) {
      setError('El número exterior es obligatorio');
      return false;
    }
    if (form.internalNumber?.length > 10) {
      setError('El número interior no puede exceder 10 caracteres');
      return false;
    }
    if (!form.neighborhood?.trim()) {
      setError('La colonia es obligatoria');
      return false;
    }
    if (!form.city?.trim()) {
      setError('La ciudad es obligatoria');
      return false;
    }
    if (!form.state?.trim()) {
      setError('El estado es obligatorio');
      return false;
    }
    if (!isValidMexicanPostalCode(form.zipCode)) {
      setError('Ingresa un código postal válido de 5 dígitos');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        alias: form.alias.trim(),
        nameReceived: form.nameReceived.trim(),
        phoneReceived: form.phoneReceived.replace(/\D/g, ''),
        street: form.street.trim(),
        externalNumber: form.externalNumber.trim(),
        internalNumber: form.internalNumber?.trim() || '',
        neighborhood: form.neighborhood.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        zipCode: form.zipCode.replace(/\D/g, ''),
        addressReferences: form.addressReferences?.trim() || '',
        latitude: '0',
        longitude: '0',
      };
      await addressService.createDeliveryAddress(payload);
      showToast('Dirección agregada correctamente', 'success');
      setForm(INITIAL_FORM);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar la dirección');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setForm(INITIAL_FORM);
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-2xl w-full my-8 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <HiOutlineMapPin className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Agregar dirección</h2>
              <p className="text-sm text-gray-600">Completa los datos para recibir tu pedido</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            aria-label="Cerrar"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-4 space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alias *</label>
                <input
                  type="text"
                  name="alias"
                  value={form.alias}
                  onChange={handleChange}
                  placeholder="Ej: Casa, Oficina"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del destinatario *</label>
                <input
                  type="text"
                  name="nameReceived"
                  value={form.nameReceived}
                  onChange={handleChange}
                  placeholder="Quién recibirá el pedido"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono de contacto *</label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                name="phoneReceived"
                value={form.phoneReceived}
                onChange={handleChange}
                placeholder="10 dígitos"
                maxLength={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Calle *</label>
              <input
                type="text"
                name="street"
                value={form.street}
                onChange={handleChange}
                placeholder="Nombre de la calle"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número exterior *</label>
                <input
                  type="text"
                  name="externalNumber"
                  value={form.externalNumber}
                  onChange={handleChange}
                  placeholder="Ej: 456"
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número interior</label>
                <input
                  type="text"
                  name="internalNumber"
                  value={form.internalNumber}
                  onChange={handleChange}
                  placeholder="Depto, local, etc. (opcional)"
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Colonia *</label>
                <input
                  type="text"
                  name="neighborhood"
                  value={form.neighborhood}
                  onChange={handleChange}
                  placeholder="Colonia o barrio"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad *</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Ciudad o municipio"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Estado"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Código postal *</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={handleChange}
                  placeholder="5 dígitos"
                  maxLength={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Referencias</label>
              <textarea
                name="addressReferences"
                value={form.addressReferences}
                onChange={handleChange}
                placeholder="Ej: Portón verde, entre calles X y Y"
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>
          </div>

          <div className="flex-shrink-0 flex gap-3 p-6 pt-4 border-t border-gray-200 bg-white">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar dirección'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddressModal;
