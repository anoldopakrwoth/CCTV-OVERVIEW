import type { SuspectCapture } from '@/types';
import { formatRelativeTime, formatTimestamp } from '@/utils/formatters';

interface SuspectCardProps {
  capture: SuspectCapture;
}

export function SuspectCard({ capture }: SuspectCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-slate-800 bg-sentry-900 transition-colors hover:border-slate-700">
      <div className="relative aspect-[4/5] overflow-hidden bg-sentry-800">
        <img
          src={capture.imageUrl}
          alt={`Suspect capture from ${capture.cameraName}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {capture.confidenceScore !== undefined && (
          <div className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {(capture.confidenceScore * 100).toFixed(0)}% match
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-white">{capture.cameraName}</h3>
            <p className="text-xs text-slate-500">{formatTimestamp(capture.timestamp)}</p>
          </div>
          <span className="shrink-0 text-xs text-slate-400">
            {formatRelativeTime(capture.timestamp)}
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-slate-400">{capture.details}</p>

        <div className="flex flex-wrap gap-1.5">
          {capture.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-slate-700 bg-sentry-800 px-2 py-0.5 text-xs font-medium text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
