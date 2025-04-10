import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, X, Zap, Users, Calendar, LayoutDashboard, 
  ChevronRight, ExternalLink, ChevronDown, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  
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

  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

  const events = [
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

  return (
    <header className={`sticky font-helvetica text-xl top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'backdrop-blur-xl bg-background/60 border-b border-border/50 shadow-lg' : 'bg-transparent'}`}>
      <div className="container flex h-20 items-center justify-between items-centerq">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            {/* <Zap className="h-7 w-7 text-neon-blue" /> */}
            <img src="/logo.png" alt="ACES Logo" className="h-10 w-10 mb-2" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-neon-gradient animate-gradient-animation bg-300% font-helvetica"> ACES </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 ml-7">
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
          <Link to="/gallery" className="text-base font-medium tracking-wide text-foreground hover:text-neon-blue transition-colors relative group font-helvetica">
            Gallery
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/about" className="text-base font-medium tracking-wide text-foreground hover:text-neon-blue transition-colors relative group font-helvetica">
            About Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/leaderboard" className="text-base font-medium tracking-wide text-foreground hover:text-neon-blue transition-colors relative group font-helvetica">
            Leaderboard
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>

        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-4">
            <div className="relative group">
              <Button
                variant="outline"
                className="border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10 hover:text-neon-blue font-helvetica"
              >
                Sign In <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background/95 backdrop-blur-xl border border-border/50 overflow-hidden transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50">
                <div className="py-1">
                  <Link
                    to="/signin"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-neon-blue/10 hover:text-neon-blue"
                  >
                    Regular Sign In
                  </Link>
                  <Link
                    to="/member/login"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-neon-purple/10 hover:text-neon-purple"
                  >
                    Member Login
                  </Link>
                  <Link
                    to="/admin/login"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-neon-green/10 hover:text-neon-green"
                  >
                    Admin Login
                  </Link>
                </div>
              </div>
            </div>
            <Button
              className="relative overflow-hidden group font-helvetica font-bold"
              onClick={() => navigate('/signup')}
            >
              <span className="absolute inset-0 bg-neon-gradient animate-gradient-animation bg-300%"></span>
              <span className="relative">Register</span>
            </Button>
          </div>
        )}

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
                    <span className="relative ">
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
                    <span className="relative">
                      Events
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-purple group-hover:w-full transition-all duration-300"></span>
                    </span>
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

                <Link
                  to="/leaderboard"
                  className="group flex items-center text-3xl font-bold w-full justify-center font-helvetica"
                  onClick={() => setIsOpen(false)}
                >
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="relative">
                      Leaderboard
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-blue group-hover:w-full transition-all duration-300"></span>
                    </span>
                    <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </Link>

                <Link 
                  to="/join" 
                  className="group flex items-center text-3xl font-bold w-full justify-center font-helvetica"
                  onClick={() => setIsOpen(false)}
                >
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="relative">
                      Join Community
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-blue group-hover:w-full transition-all duration-300"></span>
                    </span>
                    <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </Link>

                {/* Events Section in Mobile Menu */}
                <div className="w-full space-y-4">
                  <h3 className="text-xl font-bold text-foreground mb-4">Upcoming Events</h3>
                  {upcomingEvents.map((event) => (
                    <Link
                      key={event.id}
                      to={event.link}
                      className="block group"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="w-20 h-20 rounded-lg overflow-hidden">
                          <img
                            src={event.src}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground group-hover:text-neon-blue transition-colors">
                            {event.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                          <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}

                  <h3 className="text-xl font-bold text-foreground mb-4 mt-8">All Events</h3>
                  {events.map((event) => (
                    <Link
                      key={event.id}
                      to={event.link}
                      className="block group"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="w-20 h-20 rounded-lg overflow-hidden">
                          <img
                            src={event.src}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground group-hover:text-neon-blue transition-colors">
                            {event.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                          <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {!isAuthPage && (
                  <div className="flex flex-col gap-4 w-full max-w-xs mt-8">
                    <Button 
                      variant="outline" 
                      className="border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10 hover:text-neon-blue font-helvetica"
                      onClick={() => {
                        navigate('/signin');
                        setIsOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button 
                      className="relative overflow-hidden group font-helvetica font-bold"
                      onClick={() => {
                        navigate('/signup');
                        setIsOpen(false);
                      }}
                    >
                      <span className="absolute inset-0 bg-neon-gradient animate-gradient-animation bg-300%"></span>
                      <span className="relative">Register</span>
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
