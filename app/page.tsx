import { Radar } from "@/components/Radar";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { FeaturesSectionDemo } from "@/components/Features";
import Footer from "@/components/Footer";
import NavigateBtn from "@/components/NavigateBtn";
import Navbar from "@/components/Navbar";

export default function Home() {
  
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Navbar />
      <section className="flex items-center justify-center h-screen">
        <Radar
          heading="MAPSDOTFUN"
          subHeading="Find the next legit token before it's too late."
        />
      </section>
      <NavigateBtn />
      <section
        id="features"
        className="flex flex-col lg:flex-row mt-10 mx-auto w-full"
      >
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
