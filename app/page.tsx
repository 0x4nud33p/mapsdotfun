import { Radar } from "@/components/Radar";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export default function Home() {
  return (
    <main className="relative flex h-screen w-screen bg-black text-white overflow-hidden">
      {/* Title with higher z-index */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 text-2xl z-50">
       <TextHoverEffect text="mapdotfun" duration={4} />
      </div>

      {/* Left side - Evervault */}
      <div className="w-1/2 h-full flex items-center justify-center">
        <EvervaultCard text="NextGEM!" />
      </div>

      {/* Right side - Radar */}
      <div className="w-1/2 h-full flex items-center justify-center">
        <Radar />
      </div>
    </main>
  );
}
