
import ThreeDBackground from "@/components/ThreeDBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventsSection from "@/components/EventsSection";
import CustomCursor from "@/components/CustomCursor";

const Events = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <CustomCursor />
      <ThreeDBackground />
      <Navbar />
      <main>
        <div className="pt-20 pb-10 text-center">
          <h1 className="text-5xl font-bold font-helvetica">Events</h1>
          <p className="text-muted-foreground mt-2 text-lg">Discover our upcoming tech events</p>
        </div>
        <EventsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Events;
