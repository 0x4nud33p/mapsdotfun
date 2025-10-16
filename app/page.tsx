import { Radar } from "@/components/Radar";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { FloatingDockDemo } from "@/components/FlotingDock";
import { FeaturesSectionDemo } from "@/components/Features";


export default function Home() {
  return (
    <main>
      <div className="flex items-center justify-center h-screen">
        <Radar
          heading="MapsDotFun"
          subHeading="Find the next legit token before it's too late."
        />
      </div>
      <div className="flex flex-col lg:flex-row mt-10 w-full max-full mx-auto">
        {/* Left side — 50% width */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <EvervaultCard text="Find the next legit token Address" />
        </div>

        {/* Right side — 50% width */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <FeaturesSectionDemo />
        </div>
      </div>
    </main>
  );
}



{/* <div className="flex-1 flex items-center justify-center">
  <Radar />
</div>;

<div className="absolute -bottom-50 left-1/2 transform -translate-x-1/2">
  <FloatingDockDemo />
</div>; */}

{/* <div className="flex-1 flex items-center justify-center">
  <EvervaultCard text="Find the next legit token Address" />
</div>; */}