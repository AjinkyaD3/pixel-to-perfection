
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useState } from 'react';

const highlights = [
  {
    id: 1,
    title: "Hackathon Champions",
    description: "Our team won first place at the regional college hackathon with an innovative IoT solution.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aGFja2F0aG9ufHx8fHx8MTcxMzAyNDY0NQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600",
    date: "March 2025",
    category: "Competition"
  },
  {
    id: 2,
    title: "Women in Tech Panel",
    description: "A successful panel discussion featuring industry leaders sharing insights and career advice.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y29uZmVyZW5jZXx8fHx8fDE3MTMwMjQ2ODA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600",
    date: "February 2025",
    category: "Event"
  },
  {
    id: 3,
    title: "Internship Fair",
    description: "Connected over 300 students with 25 tech companies for internship and job opportunities.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8am9iIGZhaXJ8fHx8fHwxNzEzMDI0NzA2&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600",
    date: "January 2025",
    category: "Career"
  },
  {
    id: 4,
    title: "Open Source Contribution Drive",
    description: "Our club members contributed to 15 different open source projects during our month-long initiative.",
    image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y29kaW5nfHx8fHx8MTcxMzAyNDc0Mg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600",
    date: "December 2024",
    category: "Project"
  }
];

export default function HighlightsSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/20 -z-10"></div>
      <div className="absolute inset-0 hero-glow"></div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block border border-neon-purple/30 bg-background/50 backdrop-blur-sm rounded-full px-4 py-1.5"
          >
            <span className="text-xs font-medium text-neon-purple">Achievements</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold tracking-tighter"
          >
            Club <span className="bg-clip-text text-transparent bg-neon-gradient animate-gradient-animation">Highlights</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-[700px] text-muted-foreground"
          >
            Celebrating our achievements, events, and milestones that showcase our community's talent and dedication.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              onHoverStart={() => setHoveredCard(highlight.id)}
              onHoverEnd={() => setHoveredCard(null)}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <Card 
                className={`overflow-hidden h-full neon-border group transition-all duration-300 ${hoveredCard === highlight.id ? 'shadow-xl shadow-neon-purple/20' : ''}`}
              >
                <div className="relative aspect-square overflow-hidden">
                  <motion.img 
                    src={highlight.image} 
                    alt={highlight.title} 
                    className="object-cover w-full h-full"
                    initial={{ scale: 1 }}
                    animate={{ 
                      scale: hoveredCard === highlight.id ? 1.1 : 1 
                    }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <Badge 
                        variant="outline"
                        className="mb-2 bg-background/30 backdrop-blur-sm border-neon-purple/30 text-neon-purple"
                      >
                        {highlight.category}
                      </Badge>
                    </motion.div>
                    <motion.h3 
                      className="text-lg font-bold"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      {highlight.title}
                    </motion.h3>
                    <motion.p 
                      className="text-sm text-muted-foreground"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      {highlight.date}
                    </motion.p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <motion.p 
                    className="text-sm text-muted-foreground"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    {highlight.description}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
