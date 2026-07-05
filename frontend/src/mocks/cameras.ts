import type { Camera } from '@/types';

export const mockCameras: Camera[] = [
  {
    id: 1,
    name: 'North Gate Cam',
    location: 'Perimeter — North',
    status: 'online',
    streamUrl: 'https://picsum.photos/seed/north-gate/640/360',
  },
  {
    id: 2,
    name: 'Loading Dock',
    location: 'Warehouse — East',
    status: 'online',
    streamUrl: 'https://picsum.photos/seed/loading-dock/640/360',
  },
  {
    id: 3,
    name: 'Parking Lot A',
    location: 'Exterior — West',
    status: 'online',
    streamUrl: 'https://picsum.photos/seed/parking-a/640/360',
  },
  {
    id: 4,
    name: 'Server Room',
    location: 'Building B — Floor 2',
    status: 'offline',
    streamUrl: 'https://picsum.photos/seed/server-room/640/360',
  },
  {
    id: 5,
    name: 'Lobby Entrance',
    location: 'Main Building',
    status: 'online',
    streamUrl: 'https://picsum.photos/seed/lobby/640/360',
  },
  {
    id: 6,
    name: 'Rooftop Perimeter',
    location: 'Roof — Section C',
    status: 'online',
    streamUrl: 'https://picsum.photos/seed/rooftop/640/360',
  },
];
