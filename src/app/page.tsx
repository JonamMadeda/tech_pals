import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Leaders from "@/components/Leaders";
import Members from "@/components/Members";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Leaders />
      <Members />
      <Footer />
    </>
  );
}
