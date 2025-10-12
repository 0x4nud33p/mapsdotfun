import { Radar } from "@/components/Radar";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export default function Home() {
  return (
    <main className="relative flex h-screen w-screen bg-black text-white overflow-hidden">
      {/* Title with higher z-index */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 font-bold hover:cursor-pointer">
        <HoverBorderGradient className="h-16">
          <TextHoverEffect text="mapdotfun" duration={4} automatic={true} />
        </HoverBorderGradient>
      </div>

      {/* Left side - Evervault */}
      <div className="w-1/2 h-full flex items-center justify-center">
        <EvervaultCard text="Find the next legit token Address" />
      </div>

      {/* Right side - Radar */}
      <div className="w-1/2 h-full flex items-center justify-center">
        <Radar />
      </div>
    </main>
  );
}
