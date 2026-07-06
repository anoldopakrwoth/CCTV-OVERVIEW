import type { Alert } from '@/types';

const today = new Date();
today.setHours(8, 15, 0, 0);

export const mockAlerts: Alert[] = [
  {
    id: 1,
    severity: 'high',
    message: 'HIGH alert at North Gate Cam',
    timestamp: new Date(today.getTime() + 2 * 3600_000).toISOString(),
    resolvedStatus: false,
    cameraName: 'North Gate Cam',
  },
  {
    id: 2,
    severity: 'medium',
    message: 'MEDIUM alert at Loading Dock',
    timestamp: new Date(today.getTime() + 4 * 3600_000).toISOString(),
    resolvedStatus: false,
    cameraName: 'Loading Dock',
  },
  {
    id: 3,
    severity: 'low',
    message: 'LOW alert at Parking Lot A',
    timestamp: new Date(today.getTime() - 3600_000).toISOString(),
    resolvedStatus: true,
    cameraName: 'Parking Lot A',
  },
  {
    id: 4,
    severity: 'high',
    message: 'HIGH alert at Server Room',
    timestamp: new Date(today.getTime() - 7200_000).toISOString(),
    resolvedStatus: true,
    cameraName: 'Server Room',
  },
  {
    id: 5,
    severity: 'medium',
    message: 'MEDIUM alert at Lobby Entrance',
    timestamp: new Date(today.getTime() - 86400_000).toISOString(),
    resolvedStatus: true,
    cameraName: 'Lobby Entrance',
  },
];
