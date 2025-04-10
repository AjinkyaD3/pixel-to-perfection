import ThreeDBackground from "@/components/ThreeDBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import LeadershipCard from "@/components/LeadershipCard";
import { leadershipTeam } from "@/data/leadership";

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
                About <span className="bg-clip-text text-transparent bg-neon-gradient animate-gradient-animation">ACES</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-[700px] text-muted-foreground"
              >
                Association of Computer Engineering Students - A premier technical society fostering innovation and excellence in computer engineering.
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
                    To provide a platform for computer engineering students to enhance their technical skills, foster innovation, and prepare for industry challenges through workshops, competitions, and collaborative projects.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">Our Vision</h2>
                  <p className="text-muted-foreground">
                    To be the leading technical society that shapes future computer engineers into industry-ready professionals and innovators.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">Our Values</h2>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Technical Excellence and Innovation</li>
                    <li>Collaborative Learning and Knowledge Sharing</li>
                    <li>Professional Development and Industry Readiness</li>
                    <li>Ethical and Responsible Engineering Practices</li>
                    <li>Community Building and Leadership</li>
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative w-full h-full"
              >
                <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl neon-border">
                  <img
                    src="DSC_5925.JPG"
                    alt="ACES Team"
                    className="w-full h-full object-cover object-center"
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
                {leadershipTeam
                  .sort((a, b) => a.order - b.order)
                  .map((member, index) => (
                    <LeadershipCard
                      key={member.id}
                      name={member.name}
                      role={member.role}
                      image={member.image}
                      index={index}
                    />
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
