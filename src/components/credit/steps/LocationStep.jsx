import React from 'react';
import GoogleMapPicker from '../GoogleMapPicker';

const LocationStep = ({ formData, updateFormData }) => {
  const locationData = formData.location || {};

  const handleLocationSelect = (location) => {
    updateFormData({
      location: {
        ...locationData,
        coordinates: {
          lat: location.lat,
          lng: location.lng
        }
      }
    });
  };

  const initialLocation = locationData.coordinates 
    ? { lat: locationData.coordinates.lat, lng: locationData.coordinates.lng }
    : null;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Ubicación
        </h2>
        <p className="text-gray-600">
          Ubica tu domicilio en el mapa, para poder tener con exactitud el lugar en el que resides y entregar los productos.
        </p>
      </div>

      <div className="space-y-6">
        <GoogleMapPicker 
          onLocationSelect={handleLocationSelect}
          initialLocation={initialLocation}
        />
      </div>
    </div>
  );
};

export default LocationStep;

