import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

// Gallery image interface
interface GalleryImage {
  id: string;
  title: string;
  url: string;
  uploadedBy: string;
  uploadDate: string;
  description?: string;
}

// Create a backend API endpoint for gallery
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const galleryApi = axios.create({
  baseURL: `${API_URL}/gallery`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

const Gallery: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [newImage, setNewImage] = useState<Omit<GalleryImage, 'id'>>({
    title: '',
    url: '',
    uploadedBy: '',
    uploadDate: new Date().toISOString(),
    description: ''
  });

  // Fetch images when component mounts
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        // Attempt to fetch from the backend, with fallback to local storage
        try {
          const response = await galleryApi.get('/');
          if (response.data && response.data.data) {
            setGalleryImages(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching gallery images from API:', error);
          
          // Fallback to localStorage
          const savedImages = localStorage.getItem('galleryImages');
          if (savedImages) {
            setGalleryImages(JSON.parse(savedImages));
          }
        }
      } catch (error) {
        console.error('Error loading gallery images:', error);
        toast({
          title: 'Error',
          description: 'Failed to load gallery images.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [toast]);

  const handleAddImage = async () => {
    try {
      setLoading(true);
      
      // Get current user information
      const currentUser = localStorage.getItem('pixel_to_perfection_user') ? 
        JSON.parse(localStorage.getItem('pixel_to_perfection_user') || '{}') : { name: 'Admin User' };
      
      // Prepare image data
      const imageData = {
        title: newImage.title,
        url: newImage.url,
        description: newImage.description || '',
        uploadedBy: currentUser.name || 'Anonymous',
        uploadDate: new Date().toISOString()
      };
      
      // Try to save to backend
      try {
        const response = await galleryApi.post('/', imageData);
        console.log('Gallery image saved to backend:', response.data);
        
        // Add the returned image with its ID to the state
        if (response.data && response.data.data) {
          setGalleryImages(prev => [...prev, response.data.data]);
        } else {
          // Fallback if response doesn't contain the expected data
          const newLocalImage = {
            ...imageData,
            id: Math.random().toString(36).substring(2, 9)
          };
          setGalleryImages(prev => [...prev, newLocalImage]);
          
          // Also save to localStorage as fallback
          localStorage.setItem('galleryImages', JSON.stringify([...galleryImages, newLocalImage]));
        }
      } catch (error) {
        console.error('Error saving to backend:', error);
        
        // Fallback to localStorage
        const newLocalImage = {
          ...imageData,
          id: Math.random().toString(36).substring(2, 9)
        };
        setGalleryImages(prev => [...prev, newLocalImage]);
        localStorage.setItem('galleryImages', JSON.stringify([...galleryImages, newLocalImage]));
        
        toast({
          title: 'Warning',
          description: 'Image saved locally only. Server error occurred.',
          variant: 'destructive',
        });
      }
      
      // Reset form
      setNewImage({
        title: '',
        url: '',
        uploadedBy: '',
        uploadDate: new Date().toISOString(),
        description: ''
      });
      
      toast({
        title: 'Success',
        description: 'Image added to gallery.',
      });
    } catch (error) {
      console.error('Error adding image:', error);
      toast({
        title: 'Error',
        description: 'Failed to add image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      setLoading(true);
      
      // Try to delete from backend
      try {
        await galleryApi.delete(`/${id}`);
        console.log('Gallery image deleted from backend:', id);
      } catch (error) {
        console.error('Error deleting from backend:', error);
      }
      
      // Update state regardless
      setGalleryImages(prev => prev.filter(img => img.id !== id));
      
      // Update localStorage as fallback
      localStorage.setItem('galleryImages', JSON.stringify(galleryImages.filter(img => img.id !== id)));
      
      toast({
        title: 'Success',
        description: 'Image removed from gallery.',
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gallery</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={newImage.url}
                  onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newImage.description}
                  onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                />
              </div>
              <Button onClick={handleAddImage} className="w-full">Add Image</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading && <div className="text-center py-8">Loading gallery...</div>}

      {!loading && galleryImages.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No images in the gallery yet. Add one to get started!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {galleryImages.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <img src={image.url} alt={image.title} className="w-full h-48 object-cover" />
            <CardContent className="p-4">
              <h3 className="font-semibold">{image.title}</h3>
              <p className="text-sm text-muted-foreground">{image.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-muted-foreground">
                  {new Date(image.uploadDate).toLocaleDateString()}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteImage(image.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Gallery; 