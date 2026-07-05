import type { Camera, Alert } from '@/types';
import type { SecurityNodeApi, SecurityAlertApi } from '@/types/api';

export function mapNodeToCamera(node: SecurityNodeApi): Camera {
  return {
    id: node.id,
    name: node.name,
    location: node.location,
    status: node.status === 'active' ? 'online' : 'offline',
    streamUrl: node.camera_stream_url,
  };
}

export function mapAlertFromApi(alert: SecurityAlertApi): Alert {
  return {
    id: alert.id,
    severity: alert.severity,
    message: `${alert.severity.toUpperCase()} alert at ${alert.node_name}`,
    timestamp: alert.created_at,
    resolvedStatus: alert.is_resolved,
    cameraName: alert.node_name,
    videoClipUrl: alert.video_clip_url || undefined,
  };
}

export function unwrapList<T>(data: T[] | { results: T[] }): T[] {
  return Array.isArray(data) ? data : data.results;
}
