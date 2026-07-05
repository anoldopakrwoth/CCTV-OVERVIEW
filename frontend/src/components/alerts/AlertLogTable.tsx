import { useAlerts } from '@/hooks/useAlerts';
import type { Alert } from '@/types';
import { formatTimestamp, severityColor } from '@/utils/formatters';
import { resolveAlert } from '@/services/alertService';

export function AlertLogTable() {
  const { alerts, filters, loading, error, updateFilters, reload } = useAlerts();

  const handleResolve = async (alert: Alert) => {
    if (alert.resolvedStatus) return;
    await resolveAlert(alert.id);
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <input
            type="search"
            placeholder="Search alerts..."
            value={filters.search ?? ''}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="w-full rounded-lg border border-slate-700 bg-sentry-800 py-2 px-4 text-sm text-white placeholder:text-slate-500 focus:border-sentry-accent focus:outline-none focus:ring-1 focus:ring-sentry-accent"
          />
        </div>

        <select
          value={filters.severity ?? 'all'}
          onChange={(e) =>
            updateFilters({ severity: e.target.value as Alert['severity'] | 'all' })
          }
          className="rounded-lg border border-slate-700 bg-sentry-800 px-3 py-2 text-sm text-white focus:border-sentry-accent focus:outline-none"
        >
          <option value="all">All severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={filters.resolved ?? 'all'}
          onChange={(e) =>
            updateFilters({ resolved: e.target.value as 'all' | 'open' | 'resolved' })
          }
          className="rounded-lg border border-slate-700 bg-sentry-800 px-3 py-2 text-sm text-white focus:border-sentry-accent focus:outline-none"
        >
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-sentry-900">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading alerts...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-300">{error}</div>
        ) : alerts.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No alerts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-medium">Severity</th>
                  <th className="px-4 py-3 font-medium">Message</th>
                  <th className="px-4 py-3 font-medium">Camera</th>
                  <th className="px-4 py-3 font-medium">Timestamp</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-sentry-800/50">
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase ${severityColor(alert.severity)}`}
                      >
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-200">{alert.message}</td>
                    <td className="px-4 py-3 text-slate-400">{alert.cameraName ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-400">{formatTimestamp(alert.timestamp)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium ${alert.resolvedStatus ? 'text-sentry-success' : 'text-sentry-warning'}`}
                      >
                        {alert.resolvedStatus ? 'Resolved' : 'Open'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {!alert.resolvedStatus && (
                        <button
                          type="button"
                          onClick={() => handleResolve(alert)}
                          className="rounded-md bg-sentry-accent/15 px-2.5 py-1 text-xs font-medium text-sentry-accent hover:bg-sentry-accent/25"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
