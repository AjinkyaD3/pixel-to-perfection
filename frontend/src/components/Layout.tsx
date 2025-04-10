import React from 'react';
import ThreeDBackground from "@/components/ThreeDBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans">
      <CustomCursor />
      <ThreeDBackground />
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 