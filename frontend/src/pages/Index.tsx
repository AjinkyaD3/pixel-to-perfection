
import ThreeDBackground from "@/components/ThreeDBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EventsSection from "@/components/EventsSection";
import HighlightsSection from "@/components/HighlightsSection";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans">
      <CustomCursor />
      <ThreeDBackground />
      <Navbar />
      <main>
        <HeroSection />
        <EventsSection />
        <HighlightsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
