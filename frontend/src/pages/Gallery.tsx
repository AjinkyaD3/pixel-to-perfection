import GallerySection from '@/components/GallerySection';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ThreeDBackground from "@/components/ThreeDBackground";

export default function Gallery() {
  return (
    <div className="min-h-screen">
      <div className="relative">
 
        <div className="absolute inset-0 -z-10 cyber-grid opacity-10"></div>
        <Navbar />
        <GallerySection />
        <ThreeDBackground />
        
      </div>
      <Footer />
    </div>
  );
} 