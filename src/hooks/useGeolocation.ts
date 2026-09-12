import { useState, useEffect, useCallback } from 'react';
import { GeoPosition } from '../types';

interface UseGeolocationResult {
  position: GeoPosition | null;
  error: string | null;
  loading: boolean;
  refresh: () => void;
}

export function useGeolocation(): UseGeolocationResult {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser');
      setLoading(false);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        // Default to a high-risk zone (Central California)
        setPosition({ latitude: 36.7783, longitude: -119.4179 });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    getPosition();
  }, [getPosition]);

  return { position, error, loading, refresh: getPosition };
}
