"use client";
import { LoaderCircle, ShieldCheck, GraduationCap, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { loginUser, seedDemoAccounts } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { seedDemoAccounts(); }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); setError("");
    try {
      loginUser(email, password);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_36%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] px-6 py-8 dark:bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_28%),linear-gradient(180deg,#020617_0%,#07111f_100%)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between"><Logo /><ThemeToggle /></div>
      <div className="mx-auto mt-10 grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.95fr]">
        <div className="rounded-[2.2rem] border border-white/20 bg-[linear-gradient(180deg,#0f172a,#0b334d)] p-8 text-white shadow-[0_40px_120px_rgba(15,23,42,0.28)]">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <p className="text-sm font-bold uppercase tracking-widest text-cyan-200">Verified Student Access</p>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Enter the student ecosystem with one trusted login.</h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">Access your digital student ID, AI resume analyzer, verified jobs, mock interviews, and scam defense from one clean workspace.</p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
            <p className="text-cyan-300 text-xs font-bold uppercase tracking-wider">Demo Accounts</p>
            <div className="space-y-2">
              {[{ email: "aarav.sharma@lpu.in", label: "LPU Student" }, { email: "demo.student@vit.ac.in", label: "VIT Student" }].map(d => (
                <button key={d.email} onClick={() => { setEmail(d.email); setPassword("CampusOS@123"); }}
                  className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 transition-all">
                  <div>
                    <p className="text-white text-xs font-semibold">{d.label}</p>
                    <p className="text-slate-400 text-xs font-mono">{d.email}</p>
                  </div>
                  <span className="text-cyan-400 text-xs">Use ?</span>
                </button>
              ))}
            </div>
            <p className="text-slate-500 text-xs">Password: CampusOS@123</p>
          </div>
          <div className="mt-6 flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-amber-200 text-xs">Only students with official college email addresses can access this platform.</p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="rounded-[2.2rem] border border-slate-200/80 bg-white/75 p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/5 space-y-5">
          <div>
            <h2 className="text-3xl font-bold text-slate-950 dark:text-white">Login</h2>
            <p className="text-slate-400 text-sm mt-1">Use your official college email to login</p>
          </div>
          <div>
            <label className="text-slate-500 text-xs font-semibold mb-1.5 block flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" />College Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="yourname@college.ac.in" type="email" required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-slate-800 dark:text-white outline-none dark:border-white/10 dark:bg-white/6 focus:border-cyan-500 transition-colors text-sm" />
          </div>
          <div>
            <label className="text-slate-500 text-xs font-semibold mb-1.5 block">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" type="password" required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-slate-800 dark:text-white outline-none dark:border-white/10 dark:bg-white/6 focus:border-cyan-500 transition-colors text-sm" />
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
          <button type="submit" disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white dark:bg-white dark:text-slate-950 disabled:opacity-50 transition-all">
            {loading ? <><LoaderCircle className="h-4 w-4 animate-spin" />Signing in...</> : <><ShieldCheck className="h-4 w-4" />Login to CampusOS</>}
          </button>
          <p className="text-center text-sm text-slate-500">New here? <Link href="/signup" className="font-semibold text-cyan-600 dark:text-cyan-300">Create student account</Link></p>
        </form>
      </div>
    </div>
  );
}