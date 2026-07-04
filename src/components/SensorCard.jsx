import React from 'react';

const SensorCard = ({ camera }) => {
  const motionStatus = camera.motionDetected ? 'Motion Detected' : 'Clear';
  const motionClass = camera.motionDetected
    ? 'bg-rose-500/15 text-rose-100 ring-1 ring-rose-400/40 shadow-[0_0_20px_rgba(244,63,94,0.35)]'
    : 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/20';
  const distancePercent = Math.min((camera.distance / 300) * 100, 100);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 shadow-2xl shadow-slate-950/40 backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-200">{camera.name}</p>
          <p className="text-xs text-slate-500">{camera.location}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] ${motionClass}`}>
          {motionStatus}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <img src={camera.streamPreview} alt={camera.name} className="h-40 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <div className="absolute left-3 top-3 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-200">
          {camera.id}
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
            <span>PIR Motion</span>
            <span className="text-slate-300">{camera.motionDetected ? 'ACTIVE' : 'STANDBY'}</span>
          </div>
          <div className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium ${motionClass}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${camera.motionDetected ? 'animate-pulse bg-rose-300' : 'bg-emerald-300'}`} />
            {motionStatus}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
            <span>Ultrasonic</span>
            <span className="text-slate-300">{camera.distance} cm</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-800">
            <div className="h-2.5 rounded-full bg-cyan-400 transition-all" style={{ width: `${distancePercent}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
        <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
          <span>Microwave Radar</span>
          <span className="text-slate-300">{camera.radarVelocity} m/s</span>
        </div>
        <div className="relative h-14 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          <div className="absolute inset-0 opacity-70">
            <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/30" />
            <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/20" />
            <div className="absolute left-1/2 top-1/2 h-0.5 w-full -translate-y-1/2 rotate-[30deg] bg-cyan-400/40" />
          </div>
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-cyan-400/80" />
        </div>
      </div>
    </div>
  );
};

export default SensorCard;
