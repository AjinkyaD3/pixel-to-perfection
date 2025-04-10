
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  attendees: number;
  capacity: number;
}

function EventCard({ event }: { event: Event }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });
  
  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);
  const brightness = useTransform(mouseY, [-100, 100], [1.15, 0.85]);
  
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  }
  
  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card-hover z-10 group perspective-1000"
      style={{
        perspective: 1000
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          filter: `brightness(${brightness})`,
          transition: 'box-shadow 0.2s ease-out'
        }}
        whileHover={{
          z: 30,
          boxShadow: "0 30px 60px rgba(0,0,0,0.4), 0 0 30px rgba(0,238,255,0.2)",
        }}
        className="relative overflow-hidden h-full rounded-xl border border-border bg-card/95 backdrop-blur-sm shadow-md transition-all duration-300"
      >
        <div className="aspect-[16/9] relative overflow-hidden">
          <img 
            src="/event1.jpg"
            alt={event.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          <Badge variant="secondary" className="absolute top-3 right-3 bg-background/70 backdrop-blur-sm">
            {event.category}
          </Badge>
        </div>
        
        <div className="p-5">
          <h3 className="text-xl font-bold mb-2 line-clamp-1 font-helvetica">{event.title}</h3>
          <p className="text-muted-foreground mb-4 text-sm line-clamp-2">{event.description}</p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-neon-blue" />
              <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-neon-purple" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-neon-pink" />
              <span>{event.location}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{event.attendees}/{event.capacity}</span>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10"
                  onClick={() => setSelectedEvent(event)}
                >
                  Register <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md backdrop-blur-lg bg-background/80 border-neon-blue/30">
                <DialogHeader>
                  <DialogTitle className="font-helvetica">{event.title}</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Complete your registration for this event
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <p className="text-sm">Event details:</p>
                    <div className="rounded-lg bg-muted p-3 text-sm">
                      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p><strong>Time:</strong> {event.time}</p>
                      <p><strong>Location:</strong> {event.location}</p>
                      <p><strong>Available spots:</strong> {event.capacity - event.attendees}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Your Name</label>
                    <input id="name" className="w-full p-2 rounded-md border border-border bg-background" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                    <input id="email" type="email" className="w-full p-2 rounded-md border border-border bg-background" />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="relative overflow-hidden group font-helvetica"
                  >
                    <span className="absolute inset-0 bg-neon-gradient animate-gradient-animation bg-300%"></span>
                    <span className="relative">Confirm Registration</span>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const upcomingEvents: Event[] = [
  {
    id: 1,
    title: "Artificial Intelligence Workshop",
    description: "Learn the fundamentals of AI and machine learning in this hands-on workshop. We'll cover neural networks, deep learning, and practical applications.",
    date: "2025-04-15",
    time: "14:00 - 17:00",
    location: "Tech Lab 101",
    category: "Workshop",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaHx8fHx8fDE3MTMwMjQ0MTM&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600",
    attendees: 42,
    capacity: 50
  },
  {
    id: 2,
    title: "Web3 Development Bootcamp",
    description: "Dive into blockchain, smart contracts, and decentralized apps in this intensive three-day bootcamp for aspiring Web3 developers.",
    date: "2025-04-22",
    time: "10:00 - 16:00",
    location: "Virtual",
    category: "Bootcamp",
    image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YmxvY2tjaGFpbnx8fHx8fDE3MTMwMjQ0NjY&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600",
    attendees: 89,
    capacity: 100
  },
  {
    id: 3,
    title: "Cybersecurity Challenge",
    description: "Put your security skills to the test in this Capture The Flag competition. Solve puzzles, find vulnerabilities, and win prizes!",
    date: "2025-05-08",
    time: "18:00 - 22:00",
    location: "Computer Science Building",
    category: "Competition",
    image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aGFja2VyfHx8fHx8MTcxMzAyNDU2Mg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600",
    attendees: 28,
    capacity: 40
  }
];

export default function EventsSection() {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 -z-10 cyber-grid opacity-10"></div>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <span className="bg-muted px-3 py-1 text-sm rounded-md text-muted-foreground">Upcoming</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter font-helvetica">
            <span className="bg-clip-text text-transparent bg-neon-gradient animate-gradient-animation">Tech Events</span> for Everyone
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            Discover workshops, hackathons, and talks designed to inspire innovation and foster collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event, index) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        
        <div className="mt-12 flex justify-center">
          <Button 
           onClick={() => {
            window.location.href = '/events';
          }}
            variant="outline" 
            size="lg"
            className="border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10 font-helvetica text-lg"
          >
            View All Events <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
