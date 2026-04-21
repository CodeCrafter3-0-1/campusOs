import { LucideIcon } from "lucide-react";

export function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-[1.8rem] border border-slate-200/80 bg-white/75 p-6 shadow-[0_20px_65px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">{value}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{detail}</p>
        </div>
        <span className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-600 dark:text-cyan-300">
          <Icon className="h-6 w-6" />
        </span>
      </div>
    </article>
  );
}
