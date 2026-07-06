import { useMemo } from 'react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { StatusIndicator } from '@/components/dashboard/StatusIndicator';
import { useCameras } from '@/hooks/useCameras';
import { useAlerts } from '@/hooks/useAlerts';
import { formatRelativeTime, severityColor } from '@/utils/formatters';

export function DashboardPage() {
  const { cameras, loading: camerasLoading } = useCameras();
  const { alerts, loading: alertsLoading } = useAlerts();

  const metrics = useMemo(() => {
    const online = cameras.filter((c) => c.status === 'online').length;
    const today = new Date().toDateString();
    const alertsToday = alerts.filter(
      (a) => new Date(a.timestamp).toDateString() === today,
    ).length;
    const unresolved = alerts.filter((a) => !a.resolvedStatus).length;
    const onlinePercentage = cameras.length
      ? Math.round((online / cameras.length) * 100)
      : 0;

    return { online, total: cameras.length, alertsToday, unresolved, onlinePercentage };
  }, [cameras, alerts]);

  const recentAlerts = alerts.slice(0, 5);
  const loading = camerasLoading || alertsLoading;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Connected Cameras"
          value={loading ? '—' : `${metrics.online}/${metrics.total}`}
          hint={`${metrics.onlinePercentage}% online`}
          accent="green"
        />
        <MetricCard
          label="Alerts Today"
          value={loading ? '—' : metrics.alertsToday}
          hint="Since midnight"
          accent="amber"
        />
        <MetricCard
          label="Open Alerts"
          value={loading ? '—' : metrics.unresolved}
          hint="Requires attention"
          accent="red"
        />
        <MetricCard
          label="System Health"
          value={loading ? '—' : metrics.onlinePercentage >= 80 ? 'Healthy' : 'Degraded'}
          hint="Based on camera connectivity"
          accent="blue"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-800 bg-sentry-900 p-6">
          <h2 className="mb-4 text-base font-semibold text-white">Camera Status</h2>
          {camerasLoading ? (
            <p className="text-sm text-slate-400">Loading cameras...</p>
          ) : (
            <ul className="space-y-3">
              {cameras.map((camera) => (
                <li
                  key={camera.id}
                  className="flex items-center justify-between rounded-lg bg-sentry-800/50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-200">{camera.name}</p>
                    <p className="text-xs text-slate-500">{camera.location}</p>
                  </div>
                  <StatusIndicator status={camera.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-sentry-900 p-6">
          <h2 className="mb-4 text-base font-semibold text-white">Recent Alerts</h2>
          {alertsLoading ? (
            <p className="text-sm text-slate-400">Loading alerts...</p>
          ) : recentAlerts.length === 0 ? (
            <p className="text-sm text-slate-400">No recent alerts.</p>
          ) : (
            <ul className="space-y-3">
              {recentAlerts.map((alert) => (
                <li
                  key={alert.id}
                  className="flex items-start justify-between gap-3 rounded-lg bg-sentry-800/50 px-4 py-3"
                >
                  <div>
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold uppercase ${severityColor(alert.severity)}`}
                    >
                      {alert.severity}
                    </span>
                    <p className="mt-1.5 text-sm text-slate-200">{alert.message}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-500">
                    {formatRelativeTime(alert.timestamp)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
