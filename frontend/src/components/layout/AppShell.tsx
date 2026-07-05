import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

const pageMeta: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Overview', subtitle: 'System health and operational metrics' },
  '/monitor': { title: 'Live Monitor', subtitle: 'Real-time camera feeds' },
  '/gallery': { title: 'Suspect Gallery', subtitle: 'Flagged captures and metadata' },
  '/alerts': { title: 'Alert Log', subtitle: 'Security events and history' },
};

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const meta = pageMeta[location.pathname] ?? { title: 'Sentry Vision' };

  return (
    <div className="flex min-h-screen bg-sentry-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
