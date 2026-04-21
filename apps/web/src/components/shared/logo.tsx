import { Orbit } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-3 font-semibold tracking-tight text-slate-900 dark:text-white">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.9),_rgba(15,23,42,0.95))] text-white shadow-[0_12px_30px_rgba(14,165,233,0.35)]">
        <Orbit className="h-5 w-5" />
      </span>
      <span className="text-lg">CampusOS</span>
    </Link>
  );
}
