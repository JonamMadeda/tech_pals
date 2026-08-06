import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeStats from "@/components/HomeStats";
import About from "@/components/About";
import Leaders from "@/components/Leaders";
import Members from "@/components/Members";
import ProjectsPreview from "@/components/ProjectsPreview";
import CommunityFlow from "@/components/CommunityFlow";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import TerminalConsole from "@/components/TerminalConsole";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HomeStats />
      <About />
      <Leaders />
      <ProjectsPreview />
      <Members />
      <CommunityFlow />
      <CTA />
      <Footer />
      <TerminalConsole />
    </>
  );
}
