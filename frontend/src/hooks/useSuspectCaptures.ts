import { useEffect, useState } from 'react';
import { fetchSuspectCaptures } from '@/services/suspectService';
import type { SuspectCapture } from '@/types';

export function useSuspectCaptures() {
  const [captures, setCaptures] = useState<SuspectCapture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchSuspectCaptures()
      .then((data) => {
        if (!cancelled) setCaptures(data);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load suspect captures');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { captures, loading, error };
}
