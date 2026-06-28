import Hero from "@/components/sections/Hero";
import LogoMarquee from "@/components/sections/LogoMarquee";
import CoreExpertise from "@/components/sections/CoreExpertise";
import ROICalculator from "@/components/sections/ROICalculator";
import EfficiencyGuardrails from "@/components/sections/EfficiencyGuardrails";
import FinalCTA from "@/components/sections/FinalCTA";

export const metadata = {
  title: "Scale Your Business with Digimmatic AI Automation",
  description:
    "Stop manual tasks at work. Digimmatic helps businesses including startups and SMBs scale, with powerful AI automation workflows tailored to your unique needs.",
  openGraph: {
    title: "Scale Your Business with Digimmatic AI Automation",
    description:
      "Stop manual tasks at work. Digimmatic helps businesses including startups and SMBs scale, with powerful AI automation workflows tailored to your unique needs.",
  },
};

export default function Home() {
  return (
    <div className="pb-24">
      <Hero />
      <LogoMarquee />
      <CoreExpertise />
      <ROICalculator />
      <EfficiencyGuardrails />
      <FinalCTA />
    </div>
  );
}
