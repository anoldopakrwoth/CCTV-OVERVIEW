import React from 'react';

const AlertSystem = ({ alert, onAcknowledge }) => {
  if (!alert) return null;

  const alertTone = alert.level === 'High'
    ? 'border-red-500/60 bg-red-500/15 text-red-100'
    : 'border-amber-500/50 bg-amber-500/10 text-amber-100';

  return (
    <div className={`rounded-2xl border px-4 py-3 shadow-2xl shadow-red-950/40 backdrop-blur ${alertTone}`}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-3.5 w-3.5 animate-pulse rounded-full bg-red-400" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-300">{alert.level} Alert</p>
            <p className="text-lg font-semibold text-white">{alert.nodeLocation}</p>
            <p className="text-sm text-slate-300">Triggered at {alert.time} • Node {alert.nodeId}</p>
          </div>
        </div>
        <button
          onClick={onAcknowledge}
          className="rounded-full border border-red-400/40 bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/30"
        >
          Acknowledge Alert
        </button>
      </div>
    </div>
  );
};

export default AlertSystem;
