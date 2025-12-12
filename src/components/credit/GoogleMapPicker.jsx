import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { HiOutlineMapPin, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { useGoogleMaps } from './GoogleMapsProvider';

const GoogleMapPicker = ({ onLocationSelect, initialLocation = null }) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);
  const { isLoaded, loadError } = useGoogleMaps();

  const defaultCenter = {
    lat: 19.4326,
    lng: -99.1332
  };

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem'
  };

  const handleMapClick = useCallback((event) => {
    const location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    setSelectedLocation(location);
    onLocationSelect(location);
  }, [onLocationSelect]);

  const handlePlaceChanged = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setSelectedLocation(location);
        onLocationSelect(location);
        
        if (mapRef.current) {
          mapRef.current.panTo(location);
          mapRef.current.setZoom(17);
        }
      }
    }
  }, [onLocationSelect]);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const onAutocompleteLoad = useCallback((autocompleteInstance) => {
    autocompleteRef.current = autocompleteInstance;
  }, []);

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">
          Error al cargar Google Maps. Por favor, verifica tu API key.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isLoaded && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <HiOutlineMagnifyingGlass className="h-5 w-5 text-gray-400" />
          </div>
          <Autocomplete
            onLoad={onAutocompleteLoad}
            onPlaceChanged={handlePlaceChanged}
            options={{
              componentRestrictions: { country: 'mx' },
              fields: ['geometry', 'formatted_address', 'name']
            }}
          >
            <input
              type="text"
              placeholder="Busca una dirección o lugar..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </Autocomplete>
        </div>
      )}

      <div className="relative border border-gray-300 rounded-lg overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={selectedLocation || defaultCenter}
          zoom={selectedLocation ? 17 : 10}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true
          }}
        >
          {selectedLocation && (
            <Marker
              position={selectedLocation}
              animation={window.google?.maps?.Animation?.DROP}
            />
          )}
        </GoogleMap>
      </div>

      {selectedLocation && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex items-start gap-3">
          <HiOutlineMapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary-900 mb-1">
              Ubicación seleccionada
            </p>
            <p className="text-xs text-primary-700">
              Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
            </p>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        Haz clic en el mapa o busca una dirección para seleccionar tu ubicación
      </p>
    </div>
  );
};

export default GoogleMapPicker;

