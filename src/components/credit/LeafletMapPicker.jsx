import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { HiOutlineMapPin, HiOutlineXMark } from 'react-icons/hi2';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos por defecto de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const LeafletMapPicker = ({ onLocationSelect, initialLocation = null }) => {
  // Convertir initialLocation a formato de array si existe
  const getInitialLocationArray = () => {
    if (initialLocation && initialLocation.lat && initialLocation.lng) {
      return [initialLocation.lat, initialLocation.lng];
    }
    return null;
  };

  const [selectedLocation, setSelectedLocation] = useState(getInitialLocationArray());
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationPermissionAsked, setLocationPermissionAsked] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [addressDisplayName, setAddressDisplayName] = useState(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  
  // Estados para búsqueda (mantenidos para uso futuro)
  // const [searchQuery, setSearchQuery] = useState('');
  // const [isSearching, setIsSearching] = useState(false);
  // const [searchResults, setSearchResults] = useState([]);
  // const [showResults, setShowResults] = useState(false);
  // const searchTimeoutRef = useRef(null); // Mantenido para uso futuro
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const defaultCenter = [19.4326, -99.1332]; // Ciudad de México
  const defaultZoom = 10;

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current).setView(
      selectedLocation || defaultCenter,
      selectedLocation ? 17 : defaultZoom
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Agregar listener de click
    map.on('click', (e) => {
      const location = [e.latlng.lat, e.latlng.lng];
      setSelectedLocation(location);
      onLocationSelect({ lat: location[0], lng: location[1] });
      
      // Actualizar o crear marcador
      if (markerRef.current) {
        markerRef.current.setLatLng(location);
      } else {
        markerRef.current = L.marker(location, { draggable: true }).addTo(map);
        markerRef.current.on('dragend', (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          const loc = [position.lat, position.lng];
          setSelectedLocation(loc);
          onLocationSelect({ lat: loc[0], lng: loc[1] });
        });
      }
    });

    // Si hay ubicación inicial, agregar marcador
    if (selectedLocation) {
      markerRef.current = L.marker(selectedLocation, { draggable: true }).addTo(map);
      markerRef.current.on('dragend', (e) => {
        const marker = e.target;
        const position = marker.getLatLng();
        const loc = [position.lat, position.lng];
        setSelectedLocation(loc);
        onLocationSelect({ lat: loc[0], lng: loc[1] });
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, []); // Solo ejecutar una vez al montar

  // Sincronizar con initialLocation cuando cambia
  useEffect(() => {
    if (initialLocation && initialLocation.lat && initialLocation.lng) {
      const location = [initialLocation.lat, initialLocation.lng];
      setSelectedLocation(location);
    } else if (!initialLocation) {
      setSelectedLocation(null);
    }
  }, [initialLocation]);

  // Actualizar mapa cuando cambia selectedLocation
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (selectedLocation) {
      mapInstanceRef.current.setView(selectedLocation, 17);
      
      // Actualizar o crear marcador
      if (markerRef.current) {
        markerRef.current.setLatLng(selectedLocation);
      } else {
        markerRef.current = L.marker(selectedLocation, { draggable: true }).addTo(mapInstanceRef.current);
        markerRef.current.on('dragend', (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          const loc = [position.lat, position.lng];
          setSelectedLocation(loc);
          onLocationSelect({ lat: loc[0], lng: loc[1] });
        });
      }
    } else {
      // Remover marcador si no hay ubicación seleccionada
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      mapInstanceRef.current.setView(defaultCenter, defaultZoom);
      setAddressDisplayName(null);
    }
  }, [selectedLocation, onLocationSelect]);

  // Función para hacer reverse geocoding (obtener dirección desde coordenadas)
  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'NexoPay E-commerce App'
          }
        }
      );
      
      const data = await response.json();
      if (data && data.display_name) {
        return data.display_name;
      }
      return null;
    } catch (error) {
      console.error('Error en reverse geocoding:', error);
      return null;
    }
  }, []);

  // Obtener dirección cuando cambia la ubicación seleccionada
  useEffect(() => {
    if (selectedLocation && selectedLocation.length === 2) {
      setIsLoadingAddress(true);
      reverseGeocode(selectedLocation[0], selectedLocation[1])
        .then((address) => {
          setAddressDisplayName(address);
          setIsLoadingAddress(false);
        })
        .catch(() => {
          setAddressDisplayName(null);
          setIsLoadingAddress(false);
        });
    } else {
      setAddressDisplayName(null);
    }
  }, [selectedLocation, reverseGeocode]);

  // Función para obtener la geolocalización del usuario
  const getUserLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError('Tu navegador no soporta geolocalización');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const location = [lat, lng];
        
        setSelectedLocation(location);
        onLocationSelect({ lat, lng });
        setShowPermissionModal(false);
        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        setShowPermissionModal(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Permiso de geolocalización denegado. Por favor, selecciona tu ubicación haciendo clic en el mapa.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Ubicación no disponible. Por favor, selecciona tu ubicación haciendo clic en el mapa.');
            break;
          case error.TIMEOUT:
            setLocationError('Tiempo de espera agotado. Por favor, selecciona tu ubicación haciendo clic en el mapa.');
            break;
          default:
            setLocationError('Error al obtener tu ubicación. Por favor, selecciona tu ubicación haciendo clic en el mapa.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [onLocationSelect]);

  // Mostrar modal de permiso al montar el componente si no hay ubicación inicial
  useEffect(() => {
    if (!initialLocation && !locationPermissionAsked) {
      setLocationPermissionAsked(true);
      setShowPermissionModal(true);
    }
  }, [initialLocation, locationPermissionAsked]);

  // Función para manejar la aceptación del permiso
  const handleAcceptPermission = () => {
    setShowPermissionModal(false);
    getUserLocation();
  };

  // Función para cancelar el modal
  const handleCancelPermission = () => {
    setShowPermissionModal(false);
    setLocationError('Por favor, selecciona tu ubicación haciendo clic en el mapa.');
  };

  // Funciones de búsqueda comentadas para uso futuro
  // const searchAddress = useCallback(async (query) => {
  //   if (!query || query.trim().length < 3) {
  //     setSearchResults([]);
  //     setShowResults(false);
  //     return;
  //   }
  //   setIsSearching(true);
  //   try {
  //     const response = await fetch(
  //       `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=mx&addressdetails=1`,
  //       {
  //         headers: {
  //           'User-Agent': 'NexoPay E-commerce App'
  //         }
  //       }
  //     );
  //     const data = await response.json();
  //     setSearchResults(data);
  //     setShowResults(true);
  //   } catch (error) {
  //     console.error('Error al buscar dirección:', error);
  //     setSearchResults([]);
  //   } finally {
  //     setIsSearching(false);
  //   }
  // }, []);

  // const handleSearchChange = (e) => {
  //   const value = e.target.value;
  //   setSearchQuery(value);
  //   if (searchTimeoutRef.current) {
  //     clearTimeout(searchTimeoutRef.current);
  //   }
  //   searchTimeoutRef.current = setTimeout(() => {
  //     searchAddress(value);
  //   }, 500);
  // };

  // const handleSelectResult = (result) => {
  //   const location = [parseFloat(result.lat), parseFloat(result.lon)];
  //   setSelectedLocation(location);
  //   setSearchQuery(result.display_name);
  //   setShowResults(false);
  //   setSearchResults([]);
  //   onLocationSelect({ lat: location[0], lng: location[1] });
  // };

  return (
    <div className="space-y-4">
      {/* Modal de permiso de geolocalización */}
      {showPermissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[3000] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              type="button"
              onClick={handleCancelPermission}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <HiOutlineMapPin className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Permiso de Ubicación
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-700 mb-3">
                Para completar tu solicitud de crédito, necesitamos conocer tu ubicación exacta. Esto nos permite:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-2 ml-2">
                <li>Verificar tu dirección de residencia</li>
                <li>Calcular la distancia para la entrega de productos</li>
                <li>Validar la información de tu solicitud</li>
                <li>Garantizar una entrega precisa y segura</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelPermission}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAcceptPermission}
                disabled={isGettingLocation}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isGettingLocation ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Obteniendo...</span>
                  </>
                ) : (
                  'Permitir ubicación'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensajes de error */}
      {locationError && !showPermissionModal && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">{locationError}</p>
        </div>
      )}

      {/* Input de búsqueda - Comentado para uso futuro */}
      {/* <div className="relative z-[2000]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <HiOutlineMagnifyingGlass className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => {
            if (searchResults.length > 0) {
              setShowResults(true);
            }
          }}
          placeholder="Busca una dirección o lugar..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 relative z-[2000]"
        />
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center z-10">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
          </div>
        )}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-[2001] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectResult(result)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <p className="text-sm font-medium text-gray-900">{result.display_name}</p>
                {result.address && (
                  <p className="text-xs text-gray-500 mt-1">
                    {result.address.city || result.address.town || result.address.village || ''}
                    {result.address.state && `, ${result.address.state}`}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
        {showResults && !isSearching && searchResults.length === 0 && searchQuery.length >= 3 && (
          <div className="absolute z-[2001] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
            <p className="text-sm text-gray-500">No se encontraron resultados para tu búsqueda</p>
          </div>
        )}
      </div> */}

      {/* Mapa */}
      <div 
        ref={mapContainerRef}
        className="relative border border-gray-300 rounded-lg overflow-hidden" 
        style={{ height: '400px' }}
      />

      {/* Viewer de dirección */}
      {selectedLocation && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <HiOutlineMapPin className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Dirección seleccionada
              </p>
              {isLoadingAddress ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                  <p className="text-sm text-gray-500">Obteniendo dirección...</p>
                </div>
              ) : addressDisplayName ? (
                <p className="text-sm font-medium text-gray-900 break-words">
                  {addressDisplayName}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No se pudo obtener la dirección. Coordenadas: {selectedLocation[0].toFixed(6)}, {selectedLocation[1].toFixed(6)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instrucciones */}
      <p className="text-xs text-gray-500 text-center">
        Haz clic en el mapa o arrastra el marcador para seleccionar tu ubicación
      </p>
    </div>
  );
};

export default LeafletMapPicker;
