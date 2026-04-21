export function LandingFooter() {
  return (
    <footer id="deploy" className="mx-auto mt-12 max-w-7xl px-6 pb-12 pt-10 md:px-10">
      <div className="rounded-[2rem] border border-slate-200/70 bg-white/75 px-8 py-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600 dark:text-cyan-300">Production ready</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
              Deploy the web app on Vercel and the API on Render with clear environment boundaries.
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              The project ships with a clean monorepo structure, typed contracts, secure middleware, fallback seed data, and setup guidance for local development and production launch.
            </p>
          </div>
          <div id="security" className="rounded-3xl bg-slate-950 px-6 py-5 text-sm text-slate-100 dark:bg-white dark:text-slate-950">
            JWT auth, validation, rate limiting, helmet, and clean MVC-style API boundaries included.
          </div>
        </div>
      </div>
    </footer>
  );
}
