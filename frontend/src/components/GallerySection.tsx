import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface GalleryImage {
  id: number;
  url: string;
  title: string;
  description: string;
  uploadedBy: string;
  date: string;
}

const initialImages: GalleryImage[] = [
  {
    id: 1,
    url: "/gallery1.jpg",
    title: "Tech Conference 2024",
    description: "Annual tech conference showcasing latest innovations",
    uploadedBy: "Admin",
    date: "2024-03-15"
  },
  {
    id: 2,
    url: "/gallery2.jpg",
    title: "Hackathon Winners",
    description: "Team showcasing their winning project",
    uploadedBy: "Member",
    date: "2024-03-10"
  },
  {
    id: 3,
    url: "/gallery3.jpg",
    title: "Workshop Session",
    description: "Interactive workshop on web development",
    uploadedBy: "Admin",
    date: "2024-03-05"
  },
  {
    id: 4,
    url: "/gallery4.jpg",
    title: "Networking Event",
    description: "Industry professionals networking session",
    uploadedBy: "Member",
    date: "2024-02-28"
  },
  {
    id: 5,
    url: "/gallery5.jpg",
    title: "Coding Competition",
    description: "Annual coding competition finals",
    uploadedBy: "Admin",
    date: "2024-02-20"
  },
  {
    id: 6,
    url: "/gallery6.jpg",
    title: "Guest Lecture",
    description: "Expert talk on emerging technologies",
    uploadedBy: "Member",
    date: "2024-02-15"
  }
];

const additionalImages: GalleryImage[] = [
  {
    id: 7,
    url: "/gallery7.jpg",
    title: "Team Building",
    description: "Team building activities and games",
    uploadedBy: "Admin",
    date: "2024-02-10"
  },
  {
    id: 8,
    url: "/gallery8.jpg",
    title: "Project Showcase",
    description: "Students presenting their projects",
    uploadedBy: "Member",
    date: "2024-02-05"
  },
  {
    id: 9,
    url: "/gallery9.jpg",
    title: "Alumni Meet",
    description: "Annual alumni reunion event",
    uploadedBy: "Admin",
    date: "2024-01-30"
  },
  {
    id: 10,
    url: "/gallery10.jpg",
    title: "Workshop Series",
    description: "Series of technical workshops",
    uploadedBy: "Member",
    date: "2024-01-25"
  },
  {
    id: 11,
    url: "/gallery11.jpg",
    title: "Industry Visit",
    description: "Visit to tech companies",
    uploadedBy: "Admin",
    date: "2024-01-20"
  },
  {
    id: 12,
    url: "/gallery12.jpg",
    title: "Cultural Event",
    description: "Annual cultural fest",
    uploadedBy: "Member",
    date: "2024-01-15"
  }
];

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [displayedImages, setDisplayedImages] = useState<GalleryImage[]>(initialImages);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreImages = () => {
    if (hasMore) {
      setDisplayedImages(prev => [...prev, ...additionalImages]);
      setHasMore(false);
    }
  };

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 -z-10 cyber-grid opacity-10"></div>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <span className="bg-muted px-3 py-1 text-sm rounded-md text-muted-foreground">Memories</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter font-helvetica">
            <span className="bg-clip-text text-transparent bg-neon-gradient animate-gradient-animation">Gallery</span>
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            Explore our collection of memorable moments and events
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold">{image.title}</h3>
                    <p className="text-white/80 text-sm">{image.uploadedBy}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {hasMore && (
          <div className="mt-12 flex justify-center">
            <Button 
              variant="outline" 
              size="lg"
              className="border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10 font-helvetica text-lg"
              onClick={loadMoreImages}
            >
              View More <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="sm:max-w-2xl backdrop-blur-lg bg-background/80 border-neon-blue/30">
          <DialogHeader>
            <DialogTitle className="font-helvetica">{selectedImage?.title}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="mt-4">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full rounded-lg"
              />
              <div className="mt-4">
                <p className="text-muted-foreground">{selectedImage.description}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Uploaded by {selectedImage.uploadedBy} on {new Date(selectedImage.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
} 