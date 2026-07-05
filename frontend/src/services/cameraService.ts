import api from '@/services/api';
import type { Camera } from '@/types';
import type { SecurityNodeApi } from '@/types/api';
import { mapNodeToCamera, unwrapList } from '@/utils/mappers';
import { mockCameras } from '@/mocks/cameras';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export async function fetchCameras(): Promise<Camera[]> {
  if (USE_MOCK) {
    await delay(400);
    return mockCameras;
  }

  const { data } = await api.get<SecurityNodeApi[] | { results: SecurityNodeApi[] }>('nodes/');
  return unwrapList(data).map(mapNodeToCamera);
}

export async function fetchCameraById(id: number): Promise<Camera> {
  if (USE_MOCK) {
    const camera = mockCameras.find((c) => c.id === id);
    if (!camera) throw new Error('Camera not found');
    return camera;
  }

  const { data } = await api.get<SecurityNodeApi>(`nodes/${id}/`);
  return mapNodeToCamera(data);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
