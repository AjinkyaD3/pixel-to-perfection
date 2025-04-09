
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, X, Zap, Users, Calendar, LayoutDashboard, 
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest('nav') && !target.closest('button')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'backdrop-blur-xl bg-background/60 border-b border-border/50 shadow-lg' : 'bg-transparent'}`}>
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Zap className="h-7 w-7 text-neon-blue" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-neon-gradient animate-gradient-animation bg-300% font-helvetica">TechSoc</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-base font-medium tracking-wide text-foreground hover:text-neon-blue transition-colors relative group font-helvetica">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/events" className="text-base font-medium tracking-wide text-foreground hover:text-neon-blue transition-colors relative group font-helvetica">
            Events
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/highlights" className="text-base font-medium tracking-wide text-foreground hover:text-neon-blue transition-colors relative group font-helvetica">
            Highlights
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/about" className="text-base font-medium tracking-wide text-foreground hover:text-neon-blue transition-colors relative group font-helvetica">
            About Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" className="border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10 hover:text-neon-blue font-helvetica">
            Sign In
          </Button>
          <Button className="relative overflow-hidden group font-helvetica font-bold">
            <span className="absolute inset-0 bg-neon-gradient animate-gradient-animation bg-300%"></span>
            <span className="relative">Register</span>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? (
            <X className="h-7 w-7 text-neon-blue" />
          ) : (
            <Menu className="h-7 w-7 text-neon-blue" />
          )}
        </button>
      </div>

      {/* Mobile Navigation - Animated Full Screen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col min-h-screen p-6">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <Zap className="h-7 w-7 text-neon-blue" />
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-neon-gradient animate-gradient-animation bg-300% font-helvetica">TechSoc</span>
                </Link>
                <button
                  className="focus:outline-none"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-7 w-7 text-neon-blue" />
                </button>
              </div>
              
              <nav className="flex-1 flex flex-col items-center justify-center space-y-8">
                <Link 
                  to="/" 
                  className="group flex items-center text-3xl font-bold w-full justify-center font-helvetica"
                  onClick={() => setIsOpen(false)}
                >
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <span className="relative">
                      Home
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-blue group-hover:w-full transition-all duration-300"></span>
                    </span>
                    <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </Link>
                
                <Link 
                  to="/events" 
                  className="group flex items-center text-3xl font-bold w-full justify-center font-helvetica"
                  onClick={() => setIsOpen(false)}
                >
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="relative">
                      Events
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-purple group-hover:w-full transition-all duration-300"></span>
                    </span>
                    <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </Link>
                
                <Link 
                  to="/highlights" 
                  className="group flex items-center text-3xl font-bold w-full justify-center font-helvetica"
                  onClick={() => setIsOpen(false)}
                >
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="relative">
                      Highlights
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-pink group-hover:w-full transition-all duration-300"></span>
                    </span>
                    <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </Link>
                
                <Link 
                  to="/about" 
                  className="group flex items-center text-3xl font-bold w-full justify-center font-helvetica"
                  onClick={() => setIsOpen(false)}
                >
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="relative">
                      About Us
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-green group-hover:w-full transition-all duration-300"></span>
                    </span>
                    <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </Link>
              </nav>
              
              <div className="flex flex-col space-y-4 mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button variant="outline" className="w-full border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10 font-helvetica text-lg">
                    Sign In
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button className="w-full bg-neon-gradient animate-gradient-animation font-helvetica text-lg font-bold">
                    Register
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
