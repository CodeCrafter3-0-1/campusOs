"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { landingStats } from "@/data/mock";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-10 md:px-10">
      <div className="absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.22),_transparent_52%),radial-gradient(circle_at_20%_20%,_rgba(14,165,233,0.24),_transparent_28%),radial-gradient(circle_at_80%_10%,_rgba(15,118,110,0.18),_transparent_28%)]" />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-700 dark:text-cyan-200">
            <Sparkles className="h-4 w-4" />
            AI student ecosystem for identity, learning, and verified opportunity trust
          </div>
          <div className="space-y-6">
            <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-7xl">
              Campus life needs one operating system, not ten disconnected tools.
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-slate-600 dark:text-slate-300 md:text-xl">
              CampusOS helps students prove identity, find the right resources, detect fake internships, and move from
              chaos to momentum with an AI-native platform.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(2,6,23,0.25)] transition hover:translate-y-[-2px] dark:bg-white dark:text-slate-950"
            >
              Create verified profile
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/scam-checker"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-6 py-4 text-sm font-semibold text-slate-700 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              Try scam checker
              <ShieldCheck className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {landingStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/20 bg-white/55 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/5">
                <div className="text-2xl font-semibold text-slate-950 dark:text-white">{stat.value}</div>
                <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative flex min-h-[560px] flex-col justify-between overflow-hidden rounded-[2rem] border border-white/15 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(8,47,73,0.94))] p-7 text-white shadow-[0_40px_120px_rgba(8,47,73,0.3)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.26),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.2),_transparent_32%)]" />
          <div className="relative flex items-center justify-between">
            <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
              Live trust graph
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-2 text-xs font-medium text-emerald-200">
              <Zap className="h-4 w-4" />
              120 ms AI routing
            </span>
          </div>
          <div className="relative space-y-5">
            <div className="rounded-[1.8rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
              <div className="text-sm text-cyan-100/80">Digital identity</div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">Verified badge active</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-300">
                    College email trust + profile proof + projects + certifications + shareable student link.
                  </p>
                </div>
                <div className="rounded-3xl border border-emerald-400/25 bg-emerald-400/12 px-4 py-3 text-sm font-semibold text-emerald-200">
                  Trust 96%
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5">
                <div className="text-sm text-slate-300">Scam detection</div>
                <div className="mt-3 text-4xl font-semibold text-rose-200">68%</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Suspicious because of urgency language, generic recruiter email, and deposit request.
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5">
                <div className="text-sm text-slate-300">Resource matching</div>
                <div className="mt-3 text-4xl font-semibold text-cyan-200">42</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Ranked by semantic intent, subject overlap, placements focus, and offline readiness.
                </p>
              </div>
            </div>
          </div>
          <div className="relative grid gap-4 rounded-[1.8rem] border border-white/10 bg-white/8 p-5 md:grid-cols-3">
            {["Verified jobs", "Resume AI", "Skill gap mapping"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-black/10 px-4 py-4 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
