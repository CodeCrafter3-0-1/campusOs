"use client";
import { LoaderCircle, ShieldCheck, ShieldX, GraduationCap, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { registerUserWithPassword } from "@/lib/auth";
import { validateCollegeEmail, isPersonalEmail } from "@/lib/colleges";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailStatus, setEmailStatus] = useState(null);
  const [form, setForm] = useState({ fullName: "", email: "", password: "", course: "", graduationYear: 2026 });

  const handleEmailChange = (val) => {
    setForm(f => ({ ...f, email: val }));
    if (val.includes("@")) {
      if (isPersonalEmail(val)) {
        setEmailStatus({ valid: false, message: "Personal emails not allowed. Use your college email.", college: null });
      } else {
        const result = validateCollegeEmail(val);
        if (result.isValid) {
          setEmailStatus({ valid: true, message: "Verified: " + result.college.name + " � " + result.college.location, college: result.college });
        } else if (val.split("@")[1]?.includes(".")) {
          setEmailStatus({ valid: false, message: result.error, college: null });
        } else {
          setEmailStatus(null);
        }
      }
    } else {
      setEmailStatus(null);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!emailStatus || !emailStatus.valid) { setError("Please use a valid authorized college email address."); return; }
    setLoading(true); setError("");
    try {
      registerUserWithPassword({ fullName: form.fullName, email: form.email, collegeName: emailStatus.college?.name || "", collegeVerified: true, collegeDomain: form.email.split("@")[1], course: form.course, graduationYear: form.graduationYear }, form.password);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_36%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] px-6 py-8 dark:bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.16),_transparent_28%),linear-gradient(180deg,#020617_0%,#07111f_100%)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between"><Logo /><ThemeToggle /></div>
      <div className="mx-auto mt-10 grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.9fr]">

        <form onSubmit={onSubmit} className="rounded-[2.2rem] border border-slate-200/80 bg-white/75 p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/5 space-y-5">
          <div>
            <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Create Student Account</h1>
            <p className="text-slate-400 text-sm mt-1">Only authorized Indian college students can register</p>
          </div>

          <div>
            <label className="text-slate-500 text-xs font-semibold mb-1.5 block">Full Name</label>
            <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Your full name" required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-slate-800 dark:text-white outline-none dark:border-white/10 dark:bg-white/6 focus:border-cyan-500 transition-colors text-sm" />
          </div>

          <div>
            <label className="text-slate-500 text-xs font-semibold mb-1.5 block flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" /> College Email <span className="text-red-500">*</span>
              <span className="text-slate-400 font-normal">(must be official college email)</span>
            </label>
            <div className="relative">
              <input value={form.email} onChange={e => handleEmailChange(e.target.value)} placeholder="yourname@college.ac.in" required type="email"
                className={"w-full rounded-2xl border px-4 py-3 text-slate-800 dark:text-white outline-none dark:bg-white/6 focus:border-cyan-500 transition-colors text-sm pr-10 " + (emailStatus ? (emailStatus.valid ? "border-green-500/50 bg-green-500/5 dark:border-green-500/30" : "border-red-500/50 bg-red-500/5 dark:border-red-500/30") : "border-slate-200 bg-slate-50/80 dark:border-white/10")} />
              {emailStatus && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {emailStatus.valid ? <CheckCircle className="w-5 h-5 text-green-500" /> : <ShieldX className="w-5 h-5 text-red-500" />}
                </div>
              )}
            </div>
            {emailStatus && (
              <div className={"mt-2 flex items-start gap-2 rounded-xl px-3 py-2 text-xs " + (emailStatus.valid ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500")}>
                {emailStatus.valid ? <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> : <ShieldX className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
                <span>{emailStatus.message}</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-slate-500 text-xs font-semibold mb-1.5 block">Password <span className="text-slate-400 font-normal">(min 8 characters)</span></label>
            <input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Create strong password" required type="password"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-slate-800 dark:text-white outline-none dark:border-white/10 dark:bg-white/6 focus:border-cyan-500 transition-colors text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-500 text-xs font-semibold mb-1.5 block">Course</label>
              <input value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))} placeholder="e.g. B.Tech CSE, MCA"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-slate-800 dark:text-white outline-none dark:border-white/10 dark:bg-white/6 focus:border-cyan-500 transition-colors text-sm" />
            </div>
            <div>
              <label className="text-slate-500 text-xs font-semibold mb-1.5 block">Graduation Year</label>
              <select value={form.graduationYear} onChange={e => setForm(f => ({ ...f, graduationYear: Number(e.target.value) }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-slate-800 dark:text-white outline-none dark:border-white/10 dark:bg-white/6 focus:border-cyan-500 transition-colors text-sm">
                {[2025, 2026, 2027, 2028, 2029].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading || !emailStatus || !emailStatus.valid}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white dark:bg-white dark:text-slate-950 disabled:opacity-50 transition-all">
            {loading ? <><LoaderCircle className="h-4 w-4 animate-spin" />Creating account...</> : <><ShieldCheck className="h-4 w-4" />Create Verified Student Account</>}
          </button>
          <p className="text-center text-sm text-slate-500">Already have an account? <Link href="/login" className="font-semibold text-cyan-600 dark:text-cyan-300">Login</Link></p>
        </form>

        <div className="space-y-4">
          <div className="rounded-[2.2rem] border border-white/20 bg-[linear-gradient(180deg,#0f172a,#0b334d)] p-7 text-white">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              <p className="text-sm font-bold uppercase tracking-widest text-cyan-200">Verified Access Only</p>
            </div>
            <h2 className="text-2xl font-bold mb-4">Why college email only?</h2>
            <div className="space-y-3">
              {["Ensures only genuine students access the platform", "Prevents fake accounts and spam", "Builds a trusted verified student community", "Your college identity adds credibility to your profile"].map(item => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-200 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200/80 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5">
            <h3 className="text-slate-900 dark:text-white font-bold text-sm mb-3 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-cyan-500" />Sample Authorized Emails</h3>
            <div className="space-y-2">
              {["yourname@lpu.in", "rollno@vit.ac.in", "name@iitb.ac.in", "student@thapar.edu", "yourname@chandigarh.edu.in", "roll@bits-pilani.ac.in"].map(ex => (
                <div key={ex} className="flex items-center gap-2 bg-green-500/5 border border-green-500/20 rounded-xl px-3 py-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  <code className="text-green-600 dark:text-green-400 text-xs font-mono">{ex}</code>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              {["yourname@gmail.com", "student@yahoo.com"].map(ex => (
                <div key={ex} className="flex items-center gap-2 bg-red-500/5 border border-red-500/20 rounded-xl px-3 py-2">
                  <ShieldX className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                  <code className="text-red-500 text-xs font-mono line-through">{ex}</code>
                  <span className="text-red-400 text-xs">Not allowed</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="text-amber-600 dark:text-amber-400 text-xs font-semibold mb-1">Your college not listed?</p>
            <p className="text-slate-500 text-xs">We are adding more colleges regularly. Contact your college administration to get your institution added to CampusOS.</p>
          </div>
        </div>
      </div>
    </div>
  );
}