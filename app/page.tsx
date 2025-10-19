import { Radar } from "@/components/Radar";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { FeaturesSectionDemo } from "@/components/Features";
import Footer from "@/components/Footer";
import Image from "next/image";
import WalletWrapper from "@/components/WalletWrapper";

export default function Home() {
  
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="flex justify-between items-center w-full p-4 pt-0 absolute top-0 left-0 z-[9999]">
        <Image
          src="/logo.png"
          alt="logo"
          width={100}
          height={100}
          className="hidden sm:block"
        />
        <WalletWrapper />
      </div>
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
    </main>
  );
}
