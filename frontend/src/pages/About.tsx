
import ThreeDBackground from "@/components/ThreeDBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ThreeDBackground />
      <Navbar />
      <main>
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 cyber-grid opacity-10"></div>
          <div className="hero-glow"></div>
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center mb-12">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold tracking-tighter"
              >
                About <span className="bg-clip-text text-transparent bg-neon-gradient animate-gradient-animation">TechSoc</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-[700px] text-muted-foreground"
              >
                A community of tech enthusiasts dedicated to innovation, learning, and growth.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
                  <p className="text-muted-foreground">
                    To foster innovation and technical excellence among students through collaborative learning, industry engagement, and hands-on project experience.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-3">Our Vision</h2>
                  <p className="text-muted-foreground">
                    To build a thriving community of tech leaders who drive meaningful change through technology and innovation.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-3">Our Values</h2>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Innovation and creativity in problem-solving</li>
                    <li>Inclusive and collaborative learning environment</li>
                    <li>Continuous growth and improvement</li>
                    <li>Responsible and ethical use of technology</li>
                    <li>Industry-relevant skills development</li>
                  </ul>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative"
              >
                <div className="aspect-square relative overflow-hidden rounded-xl neon-border">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVhbXx8fHx8fDE3MTMwMjUyOTM&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600" 
                    alt="TechSoc Team" 
                    className="object-cover w-full h-full"
                  />
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-20"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">
                <span className="bg-clip-text text-transparent bg-neon-gradient animate-gradient-animation">Our Leadership</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[
                  { name: "Alex Chen", role: "President", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=200&h=200" },
                  { name: "Jordan Smith", role: "Vice President", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=200&h=200" },
                  { name: "Taylor Wong", role: "Tech Lead", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=200&h=200" },
                  { name: "Morgan Rivera", role: "Event Coordinator", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=crop&w=200&h=200" },
                ].map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + (index * 0.1) }}
                    className="group"
                  >
                    <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors duration-300">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden neon-border">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
