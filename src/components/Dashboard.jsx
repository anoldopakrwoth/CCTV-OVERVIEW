import React, { useEffect, useState } from 'react';
import AlertSystem from './AlertSystem';
import CameraGrid from './CameraGrid';

const Dashboard = ({ cameras, alert, logs, summary, onAcknowledge, connectionStatus, getLevelClasses }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'alerts', 'cameras', 'logs'];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 140 && rect.bottom >= 140;
      });

      if (current) {
        setActiveSection(current);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileNavOpen(false);
  };

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'cameras', label: 'Cameras' },
    { id: 'logs', label: 'Logs' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-4 text-slate-100 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <nav className="sticky top-3 z-20 rounded-2xl border border-slate-800/80 bg-slate-900/80 px-4 py-3 shadow-xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => scrollToSection('overview')}
              className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300"
            >
              Perimeter OS
            </button>

            <div className="hidden items-center gap-2 md:flex">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${activeSection === item.id ? 'bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-400/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-200 md:hidden"
            >
              {mobileNavOpen ? 'Close' : 'Menu'}
            </button>
          </div>

          {mobileNavOpen && (
            <div className="mt-3 flex flex-col gap-2 border-t border-slate-800 pt-3 md:hidden">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`rounded-xl px-3 py-2 text-left text-sm ${activeSection === item.id ? 'bg-cyan-500/15 text-cyan-200' : 'bg-slate-800/70 text-slate-300'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* Executive overview header */}
        <header id="overview" className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">Smart Perimeter Security</p>
              <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">CCTV Overview & Threat Monitoring</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                A tactical command surface for observing live camera feeds, telemetry overlays, and incident alerts in real time.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Active Nodes</p>
                <p className="mt-1 text-2xl font-semibold text-white">{summary.activeNodes}/4</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Avg. Distance</p>
                <p className="mt-1 text-2xl font-semibold text-white">{summary.avgDistance} cm</p>
              </div>
            </div>
          </div>
        </header>

        {/* Alert panel */}
        <div id="alerts" className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-3 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <AlertSystem alert={alert} onAcknowledge={onAcknowledge} />
        </div>

        <main className="space-y-6">
          <div className="flex flex-wrap items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">Live perimeter grid</p>
              <p className="text-sm text-slate-400">{connectionStatus}</p>
            </div>
            <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">
              Secure Channel • 24/7
            </div>
          </div>

          {/* Camera video and telemetry grid */}
          <section id="cameras">
            <CameraGrid cameras={cameras} />
          </section>

          {/* Event review table */}
          <section id="logs" className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/70 shadow-2xl shadow-slate-950/30">
            <div className="border-b border-slate-800/70 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Historical Security Logs</h2>
                  <p className="text-sm text-slate-400">Review shielding events and recent anomalies.</p>
                </div>
                <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">
                  Live stream • 24/7
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800">
                <thead className="bg-slate-950/70">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Timestamp</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Node ID</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Alert Level</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                  {logs.map((log) => (
                    <tr key={`${log.timestamp}-${log.nodeId}`} className="transition hover:bg-slate-800/40">
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-200">{log.timestamp}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-200">{log.nodeId}</td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getLevelClasses(log.level)}`}>
                          {log.level}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <button className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20">
                          {log.review}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
