import { useState, useEffect, useMemo } from 'react';
import { HiOutlineXMark, HiOutlineMapPin, HiOutlineArrowRight } from 'react-icons/hi2';
import { addressService } from '../../api/services/addressService';
import useToastStore from '../../stores/toastStore';
import { addressApiRecordToForm, isPrincipalAddress } from '../../utils/addressForm';
import { getBrowserGeolocationPosition } from '../../utils/browserGeolocation';
import { geocodeAddressQuery } from '../../utils/geocodeAddress';
import {
  isValidMexicanPhone,
  isValidMexicanPostalCode,
  isValidMexicanExternalNumber,
} from '../../utils/validation';
import { ESTADOS_MEXICO } from '../../constants/app';
import DeliveryAddressMapPicker from './DeliveryAddressMapPicker';
import Dropdown from './Dropdown';

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

const FALLBACK_MAP_LAT = 19.4326;
const FALLBACK_MAP_LNG = -99.1332;

const ESTADO_OPTIONS = ESTADOS_MEXICO.map((e) => ({ value: e, label: e }));

/**
 * Centro inicial del mapa: coordenadas guardadas, geocoding del domicilio, GPS del usuario o CDMX.
 */
async function resolveInitialMapCenter(form, isEditMode, editAddress) {
  if (isEditMode && hasUsableSavedCoordinates(editAddress)) {
    const lat = parseFloat(String(editAddress.latitude).trim());
    const lng = parseFloat(String(editAddress.longitude).trim());
    return { lat, lng, zoom: 17 };
  }

  const q = [
    form.street,
    form.externalNumber,
    form.neighborhood,
    form.city,
    form.state,
    form.zipCode,
    'México',
  ]
    .filter(Boolean)
    .join(', ');

  let geocodeHit = null;
  try {
    geocodeHit = await geocodeAddressQuery(q);
  } catch {
    geocodeHit = null;
  }
  if (geocodeHit) {
    return { lat: geocodeHit.lat, lng: geocodeHit.lng, zoom: 17 };
  }

  try {
    const pos = await getBrowserGeolocationPosition();
    return { lat: pos.lat, lng: pos.lng, zoom: 17 };
  } catch {
    return { lat: FALLBACK_MAP_LAT, lng: FALLBACK_MAP_LNG, zoom: 10 };
  }
}

function hasUsableSavedCoordinates(editAddress) {
  if (!editAddress) return false;
  const lat = editAddress.latitude;
  const lng = editAddress.longitude;
  if (lat == null || lng == null) return false;
  const sLat = String(lat).trim();
  const sLng = String(lng).trim();
  if (sLat === '' || sLng === '') return false;
  if (sLat === '0' && sLng === '0') return false;
  const nLat = parseFloat(sLat);
  const nLng = parseFloat(sLng);
  if (!Number.isFinite(nLat) || !Number.isFinite(nLng)) return false;
  if (Math.abs(nLat) < 1e-6 && Math.abs(nLng) < 1e-6) return false;
  return true;
}

const AddAddressModal = ({ isOpen, onClose, onSuccess, editAddress = null }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [step, setStep] = useState(1);
  const [mapCenter, setMapCenter] = useState(null);
  const [mapCoords, setMapCoords] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [userLocationLoading, setUserLocationLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const showToast = useToastStore((s) => s.showToast);
  const isEditMode = Boolean(editAddress?.client_address_id);

  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    setMapCenter(null);
    setMapCoords(null);
    setMapLoading(false);
    setUserLocationLoading(false);
    if (editAddress) {
      setForm(addressApiRecordToForm(editAddress));
    } else {
      setForm(INITIAL_FORM);
    }
    setError('');
  }, [isOpen, editAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'phoneReceived') {
      finalValue = value.replace(/\D/g, '').slice(0, 10);
    }
    if (name === 'zipCode') {
      finalValue = value.replace(/\D/g, '').slice(0, 5);
    }
    if (name === 'externalNumber') {
      finalValue = value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ]/g, '').slice(0, 20);
    }
    if (name === 'internalNumber') {
      finalValue = value.replace(/[^a-zA-Z0-9\s\-/]/g, '').slice(0, 20);
    }
    setForm((prev) => ({ ...prev, [name]: finalValue }));
    setError('');
  };

  const isStep1FormValid = useMemo(() => {
    const alias = form.alias?.trim() || '';
    const nameReceived = form.nameReceived?.trim() || '';
    const phoneDigits = (form.phoneReceived || '').replace(/\D/g, '');
    const street = form.street?.trim() || '';
    const external = form.externalNumber?.trim() || '';
    const internal = form.internalNumber?.trim() || '';
    const neighborhood = form.neighborhood?.trim() || '';
    const city = form.city?.trim() || '';
    const state = form.state?.trim() || '';
    const zipDigits = (form.zipCode || '').replace(/\D/g, '');

    if (alias.length < 2) return false;
    if (nameReceived.length < 3) return false;
    if (!isValidMexicanPhone(phoneDigits)) return false;
    if (street.length < 3) return false;
    if (!isValidMexicanExternalNumber(external)) return false;
    if (internal && (internal.length > 20 || !/^[a-zA-Z0-9\s\-/]*$/.test(internal))) return false;
    if (neighborhood.length < 3) return false;
    if (city.length < 2) return false;
    if (!ESTADOS_MEXICO.includes(state)) return false;
    if (!isValidMexicanPostalCode(zipDigits)) return false;
    return true;
  }, [form]);

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
    if (!isValidMexicanExternalNumber(form.externalNumber)) {
      setError(
        'El número exterior es obligatorio: solo letras y números (sin espacios) y debe incluir al menos un dígito'
      );
      return false;
    }
    const internalTrim = form.internalNumber?.trim() || '';
    if (
      internalTrim &&
      (internalTrim.length > 20 || !/^[a-zA-Z0-9\s\-/]*$/.test(internalTrim))
    ) {
      setError('El número interior solo puede contener letras, números, espacios, guiones o / (máx. 20)');
      return false;
    }
    if (!form.neighborhood?.trim() || form.neighborhood.trim().length < 3) {
      setError('La colonia debe tener al menos 3 caracteres');
      return false;
    }
    if (!form.city?.trim() || form.city.trim().length < 2) {
      setError('Ingresa una ciudad válida (mínimo 2 caracteres)');
      return false;
    }
    if (!ESTADOS_MEXICO.includes(String(form.state || '').trim())) {
      setError('Selecciona un estado de la lista');
      return false;
    }
    if (!isValidMexicanPostalCode(form.zipCode)) {
      setError('Ingresa un código postal válido de 5 dígitos');
      return false;
    }
    return true;
  };

  const goToMapStep = async (e) => {
    e?.preventDefault?.();
    setError('');
    if (!validate()) return;

    setMapLoading(true);
    try {
      const { lat, lng, zoom } = await resolveInitialMapCenter(form, isEditMode, editAddress);
      setMapCenter({ lat, lng, zoom });
      setMapCoords({
        latitude: lat.toFixed(7),
        longitude: lng.toFixed(7),
      });
      setStep(2);
    } catch {
      try {
        const pos = await getBrowserGeolocationPosition();
        setMapCenter({ lat: pos.lat, lng: pos.lng, zoom: 17 });
        setMapCoords({
          latitude: pos.lat.toFixed(7),
          longitude: pos.lng.toFixed(7),
        });
      } catch {
        setMapCenter({ lat: FALLBACK_MAP_LAT, lng: FALLBACK_MAP_LNG, zoom: 10 });
        setMapCoords({
          latitude: FALLBACK_MAP_LAT.toFixed(7),
          longitude: FALLBACK_MAP_LNG.toFixed(7),
        });
      }
      setStep(2);
    } finally {
      setMapLoading(false);
    }
  };

  const handleUseMyLocation = async () => {
    setError('');
    setUserLocationLoading(true);
    try {
      const pos = await getBrowserGeolocationPosition();
      setMapCenter({ lat: pos.lat, lng: pos.lng, zoom: 17 });
      setMapCoords({
        latitude: pos.lat.toFixed(7),
        longitude: pos.lng.toFixed(7),
      });
    } catch {
      showToast(
        'No se pudo obtener tu ubicación. Revisa permisos del navegador o mueve el pin en el mapa.',
        'info'
      );
    } finally {
      setUserLocationLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setError('');
    if (!mapCoords?.latitude || !mapCoords?.longitude) {
      setError('Indica la ubicación en el mapa');
      return;
    }

    const plat = parseFloat(mapCoords.latitude);
    const plng = parseFloat(mapCoords.longitude);
    if (
      !Number.isFinite(plat) ||
      !Number.isFinite(plng) ||
      (Math.abs(plat) < 1e-6 && Math.abs(plng) < 1e-6)
    ) {
      setError(
        'Las coordenadas no pueden ser 0,0. Usa "Mi ubicación" o mueve el pin al punto de entrega.'
      );
      return;
    }

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
        latitude: mapCoords.latitude,
        longitude: mapCoords.longitude,
      };

      if (isEditMode) {
        if (isPrincipalAddress(editAddress)) {
          setError('La dirección principal no se puede editar desde aquí');
          setIsSubmitting(false);
          return;
        }
        await addressService.updateDeliveryAddress({
          ...payload,
          clientAddressId: editAddress.client_address_id,
        });
        showToast('Dirección actualizada correctamente', 'success');
      } else {
        await addressService.createDeliveryAddress(payload);
        showToast('Dirección agregada correctamente', 'success');
      }
      setForm(INITIAL_FORM);
      setStep(1);
      setMapCenter(null);
      setMapCoords(null);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar la dirección');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !mapLoading && !userLocationLoading) {
      setForm(INITIAL_FORM);
      setStep(1);
      setMapCenter(null);
      setMapCoords(null);
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
              <h2 className="text-lg font-semibold text-gray-900">
                {isEditMode ? 'Editar dirección' : 'Agregar dirección'}
              </h2>
              <p className="text-sm text-gray-600">
                {step === 1
                  ? 'Paso 1 de 2: datos de la dirección'
                  : 'Paso 2 de 2: ubica el punto exacto de entrega en el mapa'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting || mapLoading || userLocationLoading}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            aria-label="Cerrar"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        {step === 1 ? (
          <form
            id="address-step-1"
            onSubmit={goToMapStep}
            className="flex flex-col flex-1 min-h-0"
          >
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del destinatario *
                  </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono de contacto *
                </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número exterior *
                  </label>
                  <input
                    type="text"
                    name="externalNumber"
                    value={form.externalNumber}
                    onChange={handleChange}
                    placeholder="Ej: 456 o S/N"
                    maxLength={20}
                    inputMode="text"
                    autoComplete="address-line2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número interior
                  </label>
                  <input
                    type="text"
                    name="internalNumber"
                    value={form.internalNumber}
                    onChange={handleChange}
                    placeholder="Depto, local, etc. (opcional)"
                    maxLength={20}
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
                  <Dropdown
                    id="address-state"
                    name="state"
                    label="Estado *"
                    value={form.state}
                    onChange={handleChange}
                    options={ESTADO_OPTIONS}
                    placeholder="Selecciona un estado"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código postal *
                  </label>
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
          </form>
        ) : (
          <div className="flex flex-col flex-1 min-h-0 px-6 py-4 overflow-y-auto">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">
                {error}
              </div>
            )}
            <p className="text-sm text-gray-600 mb-3">
              Arrastra el pin hasta el punto exacto de entrega. También puedes tocar el mapa para
              colocarlo.
            </p>
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={userLocationLoading || mapLoading}
              className="mb-4 w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {userLocationLoading ? 'Obteniendo ubicación…' : 'Usar mi ubicación actual'}
            </button>
            {mapCenter && (
              <DeliveryAddressMapPicker
                key={`${mapCenter.lat}-${mapCenter.lng}-${mapCenter.zoom}`}
                centerLat={mapCenter.lat}
                centerLng={mapCenter.lng}
                zoom={mapCenter.zoom}
                onLocationChange={setMapCoords}
              />
            )}
          </div>
        )}

        <div className="flex-shrink-0 flex flex-col-reverse sm:flex-row gap-3 p-6 pt-4 border-t border-gray-200 bg-white">
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting || mapLoading || userLocationLoading}
                className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 sm:order-1"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="address-step-1"
                disabled={
                  isSubmitting || mapLoading || userLocationLoading || !isStep1FormValid
                }
                className="flex-1 py-3.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {mapLoading ? (
                  'Preparando mapa…'
                ) : (
                  <>
                    Continuar
                    <HiOutlineArrowRight className="w-5 h-5 shrink-0" aria-hidden />
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError('');
                }}
                disabled={isSubmitting || userLocationLoading}
                className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 sm:order-1"
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting || !mapCoords || userLocationLoading}
                className="flex-1 py-3.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Guardando...' : isEditMode ? 'Guardar cambios' : 'Guardar dirección'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAddressModal;
