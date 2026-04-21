import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("space-y-4", align === "center" && "mx-auto max-w-3xl text-center")}>
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600 dark:text-cyan-300">{eyebrow}</p>
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">
        {title}
      </h2>
      <p className="max-w-2xl text-pretty text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">{description}</p>
    </div>
  );
}
