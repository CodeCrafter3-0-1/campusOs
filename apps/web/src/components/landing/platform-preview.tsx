import { CheckCircle2, Download, ShieldAlert, Star } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const items = [
  { title: "Digital ID card", body: "Verified badge, shareable slug, project proof, and recruiter-friendly trust layer.", icon: CheckCircle2 },
  { title: "Offline-ready learning", body: "Save top notes and PDFs so important study resources stay accessible anytime.", icon: Download },
  { title: "Community scam reporting", body: "Students can flag suspicious outreach to strengthen campus-wide scam detection.", icon: ShieldAlert },
  { title: "High-signal job board", body: "Verified roles, skill matching, and role relevance instead of random spam listings.", icon: Star },
];

export function PlatformPreview() {
  return (
    <section id="preview" className="mx-auto max-w-7xl px-6 py-16 md:px-10">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading
          eyebrow="Product preview"
          title="A polished student command center designed like a real startup product."
          description="CampusOS uses a focused dashboard shell, futuristic glass surfaces, strong information hierarchy, and fast action loops across jobs, learning, and trust."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.8rem] border border-slate-200/80 bg-white/75 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5"
            >
              <item.icon className="h-9 w-9 text-cyan-500" />
              <h3 className="mt-5 text-xl font-semibold text-slate-950 dark:text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
