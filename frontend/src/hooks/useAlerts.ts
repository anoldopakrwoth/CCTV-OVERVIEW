import { useCallback, useEffect, useState } from 'react';
import { fetchAlerts, type AlertFilters } from '@/services/alertService';
import type { Alert } from '@/types';

export function useAlerts(initialFilters?: AlertFilters) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filters, setFilters] = useState<AlertFilters>(initialFilters ?? {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (nextFilters?: AlertFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAlerts(nextFilters ?? filters);
      setAlerts(data);
    } catch {
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const updateFilters = useCallback((patch: Partial<AlertFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      load(next);
      return next;
    });
  }, [load]);

  return { alerts, filters, loading, error, updateFilters, reload: load };
}
