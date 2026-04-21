import { featureCards } from "@/data/mock";
import { SectionHeading } from "@/components/shared/section-heading";

export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-16 md:px-10">
      <SectionHeading
        eyebrow="Core product"
        title="Built around the student trust problem, not generic productivity fluff."
        description="Every module solves a real pain point: proving identity, finding the right learning resources, avoiding scams, and reaching verified opportunities faster."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {featureCards.map((feature) => (
          <article
            key={feature.title}
            className="rounded-[2rem] border border-slate-200/70 bg-white/70 p-7 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/5"
          >
            <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">{feature.title}</h3>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
