import api from '@/services/api';
import type { Alert } from '@/types';
import type { SecurityAlertApi } from '@/types/api';
import { mapAlertFromApi, unwrapList } from '@/utils/mappers';
import { mockAlerts } from '@/mocks/alerts';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export interface AlertFilters {
  search?: string;
  severity?: Alert['severity'] | 'all';
  resolved?: 'all' | 'open' | 'resolved';
}

export async function fetchAlerts(filters?: AlertFilters): Promise<Alert[]> {
  if (USE_MOCK) {
    await delay(400);
    return applyFilters(mockAlerts, filters);
  }

  const { data } = await api.get<SecurityAlertApi[] | { results: SecurityAlertApi[] }>('alerts/');
  const alerts = unwrapList(data).map(mapAlertFromApi);
  return applyFilters(alerts, filters);
}

export async function resolveAlert(id: number): Promise<Alert> {
  if (USE_MOCK) {
    const alert = mockAlerts.find((a) => a.id === id);
    if (!alert) throw new Error('Alert not found');
    alert.resolvedStatus = true;
    return { ...alert };
  }

  const { data } = await api.patch<SecurityAlertApi>(`alerts/${id}/resolve/`, {
    is_resolved: true,
  });
  return mapAlertFromApi(data);
}

function applyFilters(alerts: Alert[], filters?: AlertFilters): Alert[] {
  let result = [...alerts];

  if (filters?.search) {
    const query = filters.search.toLowerCase();
    result = result.filter(
      (alert) =>
        alert.message.toLowerCase().includes(query) ||
        alert.cameraName?.toLowerCase().includes(query),
    );
  }

  if (filters?.severity && filters.severity !== 'all') {
    result = result.filter((alert) => alert.severity === filters.severity);
  }

  if (filters?.resolved === 'open') {
    result = result.filter((alert) => !alert.resolvedStatus);
  } else if (filters?.resolved === 'resolved') {
    result = result.filter((alert) => alert.resolvedStatus);
  }

  return result;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
