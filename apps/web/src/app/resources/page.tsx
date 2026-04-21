import { AppShell } from "@/components/app/app-shell";
import { ResourceSearchPanel } from "@/components/app/resource-search-panel";
import { mockResources } from "@/data/mock";

export default function ResourcesPage() {
  return (
    <AppShell activePath="/resources">
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/75 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">AI notes finder</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">Ask naturally. Get the right notes, PDFs, videos, and links.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            The search experience is designed around semantic student intent, not brittle keyword matching. It highlights the strongest resources and favors offline availability when useful.
          </p>
        </div>
        <ResourceSearchPanel initialResults={mockResources} />
      </section>
    </AppShell>
  );
}
