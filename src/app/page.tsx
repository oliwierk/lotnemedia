import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import Drony from "@/components/Drony";
import Zespol from "@/components/Zespol";
import About from "@/components/About";
import TrustedBy from "@/components/TrustedBy";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Portfolio />
      <Process />
      <Drony />
      <Zespol />
      <About />
      <TrustedBy />
      <Footer />
    </main>
  );
}
