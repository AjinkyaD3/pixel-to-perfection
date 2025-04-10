import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from "@/components/HeroSection";
import EventsSection from "@/components/EventsSection";
import HighlightsSection from "@/components/HighlightsSection";
import UpcomingEventsPopup from '@/components/UpcomingEventsPopup';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <EventsSection />
      <HighlightsSection />
      <UpcomingEventsPopup />
    </Layout>
  );
};

export default Index;
