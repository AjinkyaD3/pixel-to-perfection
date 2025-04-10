import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  src: string;
  link: string;
}

const latestEvent: Event = {
  id: 1,
  title: "Artificial Intelligence Workshop",
  date: "Tue, Apr 15",
  time: "14:00 - 17:00",
  location: "Tech Lab 101",
  description: "Learn the fundamentals of AI and machine learning in this hands-on workshop. We'll cover neural networks, deep learning, and practical applications.",
  src: "/events/ai-workshop.jpg",
  link: "/events/ai-workshop"
};

const UpcomingEventsPopup = () => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 z-50 w-96 bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-neon-blue" />
              <h3 className="text-lg font-bold text-foreground">Upcoming Event</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors">
              <div className="w-16 h-16 rounded-lg overflow-hidden">
                <img
                  src={latestEvent.src}
                  alt={latestEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{latestEvent.title}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3" />
                  <span>{latestEvent.date}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {latestEvent.description}
                </p>
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-4 relative overflow-hidden group"
            onClick={() => {
              setIsVisible(false);
              navigate('/events');
            }}
          >
            <span className="absolute inset-0 bg-neon-gradient animate-gradient-animation bg-300%"></span>
            <span className="relative">View All Events</span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpcomingEventsPopup; 