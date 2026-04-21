import { AppShell } from "@/components/app/app-shell";
import { ScamCheckerPanel } from "@/components/app/scam-checker-panel";

export default function ScamCheckerPage() {
  return (
    <AppShell activePath="/scam-checker">
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/75 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">CampusOS USP</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">Scam detection designed for the student job market.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Paste a link, direct message, or internship pitch and get a risk verdict, confidence score, and reasons grounded in domain trust plus suspicious wording patterns.
          </p>
        </div>
        <ScamCheckerPanel />
      </section>
    </AppShell>
  );
}
