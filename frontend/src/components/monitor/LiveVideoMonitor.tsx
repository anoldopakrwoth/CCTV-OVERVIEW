import { useMemo, useState } from 'react';
import { CameraStreamTile } from '@/components/monitor/CameraStreamTile';
import { useCameras } from '@/hooks/useCameras';
import type { CameraStatus } from '@/types';

type FilterStatus = 'all' | CameraStatus;

export function LiveVideoMonitor() {
  const { cameras, loading, error } = useCameras();
  const [filter, setFilter] = useState<FilterStatus>('all');

  const filteredCameras = useMemo(() => {
    if (filter === 'all') return cameras;
    return cameras.filter((camera) => camera.status === filter);
  }, [cameras, filter]);

  const onlineCount = cameras.filter((c) => c.status === 'online').length;

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            {onlineCount} of {cameras.length} cameras online
          </p>
        </div>

        <div className="flex gap-2">
          {(['all', 'online', 'offline'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                filter === status
                  ? 'bg-sentry-accent text-white'
                  : 'bg-sentry-800 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredCameras.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-sentry-900 p-12 text-center text-slate-400">
          No cameras match the selected filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCameras.map((camera) => (
            <CameraStreamTile key={camera.id} camera={camera} />
          ))}
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="aspect-video animate-pulse rounded-xl border border-slate-800 bg-sentry-900"
        />
      ))}
    </div>
  );
}
