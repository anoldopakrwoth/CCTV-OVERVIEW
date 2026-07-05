interface MetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
  trend?: 'up' | 'down' | 'neutral';
  accent?: 'blue' | 'green' | 'amber' | 'red';
}

const accentStyles = {
  blue: 'from-blue-500/20 to-transparent border-blue-500/20',
  green: 'from-emerald-500/20 to-transparent border-emerald-500/20',
  amber: 'from-amber-500/20 to-transparent border-amber-500/20',
  red: 'from-red-500/20 to-transparent border-red-500/20',
};

export function MetricCard({ label, value, hint, accent = 'blue' }: MetricCardProps) {
  return (
    <div
      className={`rounded-xl border bg-gradient-to-br p-5 ${accentStyles[accent]}`}
    >
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
