import { useMemo, useState } from 'react';
import { SuspectCard } from '@/components/gallery/SuspectCard';
import { useSuspectCaptures } from '@/hooks/useSuspectCaptures';

export function SuspectGallery() {
  const { captures, loading, error } = useSuspectCaptures();
  const [search, setSearch] = useState('');

  const filteredCaptures = useMemo(() => {
    if (!search.trim()) return captures;
    const query = search.toLowerCase();
    return captures.filter(
      (capture) =>
        capture.cameraName.toLowerCase().includes(query) ||
        capture.details.toLowerCase().includes(query) ||
        capture.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }, [captures, search]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/5] animate-pulse rounded-xl border border-slate-800 bg-sentry-900"
          />
        ))}
      </div>
    );
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
        <p className="text-sm text-slate-400">
          {filteredCaptures.length} capture{filteredCaptures.length !== 1 ? 's' : ''} flagged
        </p>

        <div className="relative w-full sm:w-72">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search by camera, tag, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-sentry-800 py-2 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-sentry-accent focus:outline-none focus:ring-1 focus:ring-sentry-accent"
          />
        </div>
      </div>

      {filteredCaptures.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-sentry-900 p-12 text-center text-slate-400">
          No suspect captures match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCaptures.map((capture) => (
            <SuspectCard key={capture.id} capture={capture} />
          ))}
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}
