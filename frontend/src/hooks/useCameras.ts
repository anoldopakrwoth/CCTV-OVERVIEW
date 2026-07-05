import { useEffect, useState } from 'react';
import { fetchCameras } from '@/services/cameraService';
import type { Camera } from '@/types';

export function useCameras() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchCameras()
      .then((data) => {
        if (!cancelled) setCameras(data);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load cameras');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { cameras, loading, error };
}
