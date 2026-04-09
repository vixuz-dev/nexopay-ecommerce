import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const FALLBACK_LAT = 19.4326;
const FALLBACK_LNG = -99.1332;

function isNullIsland(lat, lng) {
  return Math.abs(Number(lat)) < 1e-6 && Math.abs(Number(lng)) < 1e-6;
}

function latLngToPayload(lat, lng) {
  return {
    latitude: Number(lat).toFixed(7),
    longitude: Number(lng).toFixed(7),
  };
}

/**
 * Mapa con un marcador arrastrable; clic en el mapa mueve el marcador.
 * @param {{ centerLat: number, centerLng: number, zoom?: number, onLocationChange: (coords: { latitude: string, longitude: string }) => void, className?: string }} props
 */
const DeliveryAddressMapPicker = ({
  centerLat,
  centerLng,
  zoom = 17,
  onLocationChange,
  className = '',
}) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onLocationChangeRef = useRef(onLocationChange);

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const lat = Number(centerLat);
    const lng = Number(centerLng);
    let safeLat = Number.isFinite(lat) ? lat : FALLBACK_LAT;
    let safeLng = Number.isFinite(lng) ? lng : FALLBACK_LNG;
    if (isNullIsland(safeLat, safeLng)) {
      safeLat = FALLBACK_LAT;
      safeLng = FALLBACK_LNG;
    }
    const safeZoom = Number.isFinite(zoom) ? zoom : 17;

    const map = L.map(containerRef.current).setView([safeLat, safeLng], safeZoom);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const marker = L.marker([safeLat, safeLng], { draggable: true }).addTo(map);
    markerRef.current = marker;

    const emit = (ll) => {
      onLocationChangeRef.current?.(latLngToPayload(ll.lat, ll.lng));
    };

    emit(marker.getLatLng());

    marker.on('dragend', (e) => {
      emit(e.target.getLatLng());
    });

    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      emit(e.latlng);
    });

    let resizeTimeoutId;
    const rafId = requestAnimationFrame(() => {
      map.invalidateSize();
      resizeTimeoutId = setTimeout(() => map.invalidateSize(), 300);
    });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimeoutId);
      markerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [centerLat, centerLng, zoom]);

  return (
    <div
      ref={containerRef}
      className={`w-full min-h-[280px] h-72 rounded-lg border border-gray-200 z-0 ${className}`}
      role="presentation"
    />
  );
};

export default DeliveryAddressMapPicker;
