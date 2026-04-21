import { FeatureGrid } from "@/components/landing/feature-grid";
import { LandingFooter } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { LandingNavbar } from "@/components/landing/navbar";
import { PlatformPreview } from "@/components/landing/platform-preview";

export default function Home() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eff6ff_55%,#f8fafc_100%)] dark:bg-[linear-gradient(180deg,#020617_0%,#07101b_55%,#020617_100%)]">
      <LandingNavbar />
      <Hero />
      <FeatureGrid />
      <PlatformPreview />
      <LandingFooter />
    </div>
  );
}
