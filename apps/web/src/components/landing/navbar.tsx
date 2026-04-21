import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-b-[2rem] border border-white/10 bg-white/70 px-6 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:bg-slate-950/70 md:px-10">
        <Logo />
        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          <a href="#features">Features</a>
          <a href="#preview">Preview</a>
          <a href="#security">Security</a>
          <a href="#deploy">Deploy</a>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/dashboard"
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px] dark:bg-white dark:text-slate-950"
          >
            Launch Platform
          </Link>
        </div>
      </div>
    </header>
  );
}
