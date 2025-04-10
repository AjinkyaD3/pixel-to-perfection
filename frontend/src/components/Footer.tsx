
import { Link } from 'react-router-dom';
import { Zap, Github, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/90 backdrop-blur-sm font-helvetica">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="./logo.png" alt="ACES Logo" className="w-10 h-10 mb-2" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-neon-gradient animate-gradient-animation bg-300%"> ACES </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Empowering students through technology innovation, collaborative learning, and professional development.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-neon-blue transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-neon-purple transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-neon-pink transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-neon-green transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-neon-blue transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-neon-blue transition-colors">Events</Link>
              </li>
              <li>
                <Link to="/highlights" className="text-muted-foreground hover:text-neon-blue transition-colors">Highlights</Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-neon-blue transition-colors">About Us</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-neon-blue transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-neon-blue transition-colors">Projects</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-neon-blue transition-colors">Tech Stack</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-neon-blue transition-colors">Careers</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">University Tech Hub</li>
              <li className="text-muted-foreground">Campus Innovation Center</li>
              <li className="text-muted-foreground">Room 42</li>
              <li>
                <a href="mailto:contact@techsoc.edu" className="text-neon-blue hover:underline">
                  contact@techsoc.edu
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/40 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TechSoc. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
