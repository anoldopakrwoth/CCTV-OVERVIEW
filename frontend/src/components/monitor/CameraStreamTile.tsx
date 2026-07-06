import type { Camera } from '@/types';
import { StatusIndicator } from '@/components/dashboard/StatusIndicator';

interface CameraStreamTileProps {
  camera: Camera;
}

export function CameraStreamTile({ camera }: CameraStreamTileProps) {
  const isOnline = camera.status === 'online';

  return (
    <article className="group overflow-hidden rounded-xl border border-slate-800 bg-sentry-900">
      <div className="relative aspect-video bg-sentry-800">
        {isOnline ? (
          <img
            src={camera.streamUrl}
            alt={`${camera.name} live feed`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-500">
            <OfflineIcon />
            <span className="text-sm">Signal unavailable</span>
          </div>
        )}

        <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent p-3">
          <div>
            <h3 className="text-sm font-semibold text-white">{camera.name}</h3>
            <p className="text-xs text-slate-300">{camera.location}</p>
          </div>
          <StatusIndicator status={camera.status} />
        </div>

        {isOnline && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-red-600/90 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Live
          </div>
        )}
      </div>
    </article>
  );
}

function OfflineIcon() {
  return (
    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  );
}
