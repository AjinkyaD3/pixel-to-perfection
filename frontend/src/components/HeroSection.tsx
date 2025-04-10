import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-20 overflow-hidden">
      <div className="absolute inset-0 z-0 cyber-grid opacity-20"></div>
      <div className="hero-glow"></div>
      
      <div className="container z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block border border-neon-blue/30 bg-background/50 backdrop-blur-sm rounded-full px-4 py-1.5"
          >
            <span className="text-xs font-medium text-neon-blue">Student Tech Community</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter"
          >
            Innovate. <span className="text-transparent bg-clip-text bg-neon-gradient animate-gradient-animation">Create.</span> Connect.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-[700px] text-lg text-muted-foreground md:text-xl"
          >
            Join our tech community to collaborate on innovative projects, attend exciting events, and grow your skills with like-minded individuals.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <Button 
              onClick={() => {
                window.location.href = '/events';
              }}
              size="lg" 
              className="relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-neon-gradient animate bg-300%"></span>
              <span className="relative">Explore Events</span>
            </Button>
            <Button 
              onClick={() => {
                window.location.href = '/join';
              }}
              size="lg" 
              variant="outline" 
              className="border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10 hover:text-neon-blue"
            >
              Join Community
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 flex items-center justify-center space-x-8"
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-neon-blue">500+</span>
              <span className="text-sm text-muted-foreground">Members</span>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-neon-purple">50+</span>
              <span className="text-sm text-muted-foreground">Events</span>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-neon-pink">20+</span>
              <span className="text-sm text-muted-foreground">Projects</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      <motion.button
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="w-10 h-10 border-2 border-neon-blue rounded-full flex items-center justify-center hover:bg-neon-blue/10 transition-colors">
          <ChevronDown className="h-6 w-6 text-neon-blue" />
        </div>
      </motion.button>
    </section>
  );
}
