import type { CameraStatus } from '@/types';

interface StatusIndicatorProps {
  status: CameraStatus;
  label?: string;
}

export function StatusIndicator({ status, label }: StatusIndicatorProps) {
  const isOnline = status === 'online';

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`h-2 w-2 rounded-full ${isOnline ? 'bg-sentry-success' : 'bg-slate-500'}`}
      />
      <span className={`text-xs font-medium ${isOnline ? 'text-sentry-success' : 'text-slate-400'}`}>
        {label ?? (isOnline ? 'Online' : 'Offline')}
      </span>
    </span>
  );
}
