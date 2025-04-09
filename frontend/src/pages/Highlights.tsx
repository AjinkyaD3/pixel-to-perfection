
import ThreeDBackground from "@/components/ThreeDBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HighlightsSection from "@/components/HighlightsSection";

const Highlights = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ThreeDBackground />
      <Navbar />
      <main>
        <div className="pt-20 pb-10 text-center">
          <h1 className="text-4xl font-bold">Highlights</h1>
          <p className="text-muted-foreground mt-2">Celebrating our achievements and milestones</p>
        </div>
        <HighlightsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Highlights;
