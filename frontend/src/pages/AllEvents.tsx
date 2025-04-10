import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';

const AllEvents = () => {
  const navigate = useNavigate();

  const upcomingEvent = {
    id: 1,
    title: "Artificial Intelligence Workshop",
    date: "Tue, Apr 15",
    time: "14:00 - 17:00",
    location: "Tech Lab 101",
    description: "Learn the fundamentals of AI and machine learning in this hands-on workshop. We'll cover neural networks, deep learning, and practical applications.",
    src: "/events/ai-workshop.jpg",
    link: "/events/ai-workshop"
  };

  const pastEvents = [
    {
      id: 2,
      title: "Hackathon 2024",
      date: "March 15-17, 2024",
      description: "Join us for our annual hackathon event!",
      src: "/events/event1.jpg",
      link: "/events/hackathon-2024"
    },
    {
      id: 3,
      title: "Tech Conference",
      date: "April 5-6, 2024",
      description: "Learn from industry experts and network with professionals.",
      src: "/events/event2.jpg",
      link: "/events/tech-conference"
    },
    {
      id: 4,
      title: "Workshop Series",
      date: "Ongoing",
      description: "Hands-on workshops for skill development.",
      src: "/events/event3.jpg",
      link: "/events/workshops"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background/50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Tech Events for Everyone
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore all our upcoming and past events
            </p>
          </motion.div>

          {/* Upcoming Event Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20"
          >
            <div className="flex items-center gap-2 mb-8">
              <Clock className="h-6 w-6 text-neon-blue" />
              <h3 className="text-2xl font-bold text-foreground">Upcoming Event</h3>
            </div>

            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3">
                  <img
                    src={upcomingEvent.src}
                    alt={upcomingEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full md:w-2/3 p-8">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{upcomingEvent.date}</span>
                  </div>
                  <h4 className="text-2xl font-bold text-foreground mb-2">{upcomingEvent.title}</h4>
                  <p className="text-muted-foreground mb-4">{upcomingEvent.description}</p>
                  <div className="flex flex-col gap-2 mb-6">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Time:</span> {upcomingEvent.time}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Location:</span> {upcomingEvent.location}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10"
                    onClick={() => navigate(upcomingEvent.link)}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Past Events Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-8">
              <Calendar className="h-6 w-6 text-neon-purple" />
              <h3 className="text-2xl font-bold text-foreground">Past Events</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
                      onClick={() => navigate(event.link)}
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
      </div>
    </Layout>
  );
};

export default AllEvents; 