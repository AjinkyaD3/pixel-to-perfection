import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import UpcomingEventsPopup from '@/components/UpcomingEventsPopup';

const Home = () => {
  const upcomingEvents = [
    {
      id: 4,
      title: "AI Workshop",
      date: "March 10, 2024",
      description: "Learn about AI and Machine Learning",
      src: "/events/event4.jpg",
      link: "/events/ai-workshop"
    },
    {
      id: 5,
      title: "Web Dev Bootcamp",
      date: "March 20, 2024",
      description: "Intensive web development training",
      src: "/events/event5.jpg",
      link: "/events/web-dev-bootcamp"
    }
  ];

  const pastEvents = [
    {
      id: 1,
      title: "Hackathon 2024",
      date: "March 15-17, 2024",
      description: "Join us for our annual hackathon event!",
      src: "/events/event1.jpg",
      link: "/events/hackathon-2024"
    },
    {
      id: 2,
      title: "Tech Conference",
      date: "April 5-6, 2024",
      description: "Learn from industry experts and network with professionals.",
      src: "/events/event2.jpg",
      link: "/events/tech-conference"
    },
    {
      id: 3,
      title: "Workshop Series",
      date: "Ongoing",
      description: "Hands-on workshops for skill development.",
      src: "/events/event3.jpg",
      link: "/events/workshops"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* ... existing hero section code ... */}
      </section>

      {/* Events Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Tech Events for Everyone
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join our exciting tech events and workshops to learn, network, and grow in the tech industry.
            </p>
          </motion.div>

          {/* Upcoming Events Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-neon-blue" />
                <h3 className="text-2xl font-bold text-foreground">Upcoming Events</h3>
              </div>
              <Button
                variant="outline"
                className="border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10"
              >
                View All Upcoming Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex">
                    <div className="w-1/3">
                      <img
                        src={event.src}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <h4 className="text-xl font-bold text-foreground mb-2">{event.title}</h4>
                      <p className="text-muted-foreground mb-4">{event.description}</p>
                      <Button
                        variant="outline"
                        className="border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10"
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Past Events Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-neon-purple" />
                <h3 className="text-2xl font-bold text-foreground">Past Events</h3>
              </div>
              <Button
                variant="outline"
                className="border-neon-purple/50 text-neon-purple hover:bg-neon-purple/10"
              >
                View All Past Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={event.src}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <h4 className="text-xl font-bold text-foreground mb-2">{event.title}</h4>
                    <p className="text-muted-foreground mb-4">{event.description}</p>
                    <Button
                      variant="outline"
                      className="border-neon-purple/50 text-neon-purple hover:bg-neon-purple/10"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Add the popup component */}
      <UpcomingEventsPopup />
    </div>
  );
};

export default Home; 