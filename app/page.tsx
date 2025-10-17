import { Radar } from "@/components/Radar";
import { EvervaultCard } from "@/components/ui/evervault-card";
// import { FloatingDockDemo } from "@/components/FlotingDock";
import { FeaturesSectionDemo } from "@/components/Features";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Image
        src="/logo.png"
        alt="logo"
        width={100}
        height={100}
        className="absolute top-4 left-4 z-[9999] hidden sm:block"
      />

      <section className="flex items-center justify-center h-screen">
        <Radar
          heading="MAPSDOTFUN"
          subHeading="Find the next legit token before it's too late."
        />
      </section>

      <section className="flex flex-col lg:flex-row mt-10 mx-auto w-full">
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <EvervaultCard text="Find the next legit token Address" />
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <FeaturesSectionDemo />
        </div>
      </section>

      <Footer />

      {/* Floating Dock — anchored bottom center */}
      {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-99">
        <FloatingDockDemo />
      </div> */}
    </main>
  );
}
