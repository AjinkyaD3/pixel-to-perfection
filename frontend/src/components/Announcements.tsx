import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { announcementService, uploadService } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Plus, Pin, Megaphone, AlertCircle, Info, Bell, Trash2, Calendar, Paperclip, File, Download, X } from 'lucide-react';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'general' | 'event' | 'important' | 'urgent';
  targetAudience: 'all' | 'committee' | 'students' | 'specific_year';
  year?: 'FE' | 'SE' | 'TE' | 'BE';
  pinned: boolean;
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
  attachments?: string[];
}

interface AnnouncementsProps {
  isAdmin?: boolean;
  limit?: number;
  showForm?: boolean;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'event':
      return <Calendar className="h-5 w-5 text-blue-500" />;
    case 'important':
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
    case 'urgent':
      return <Bell className="h-5 w-5 text-red-500" />;
    default:
      return <Info className="h-5 w-5 text-gray-500" />;
  }
};

const getBadgeVariant = (type: string) => {
  switch (type) {
    case 'event':
      return 'default';
    case 'important':
      return 'secondary';
    case 'urgent':
      return 'destructive';
    default:
      return 'outline';
  }
};

const Announcements = ({ isAdmin = false, limit = 5, showForm = true }: AnnouncementsProps) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [attachments, setAttachments] = useState<{name: string; url: string; type: string}[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'general',
    targetAudience: 'all',
    year: '',
    pinned: false,
    attachments: [] as {name: string; url: string; type: string}[]
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await announcementService.getAnnouncements({
          limit,
          page: 1,
        });
        setAnnouncements(response.data || []);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        toast({
          title: 'Error',
          description: 'Failed to load announcements',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [limit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return [];
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const response = await uploadService.uploadAttachments(selectedFiles);
      
      setIsUploading(false);
      
      if (response.success && response.files) {
        // Return just the URLs with fixed paths (remove double slashes)
        return response.files.map((file: any) => {
          let url = file.url;
          // Fix double slashes in URL but preserve http:// or https://
          url = url.replace(/(https?:\/\/)|(\/\/+)/g, (match: string) => {
            return match.startsWith('http') ? match : '/';
          });
          return url;
        });
      }
      
      return [];
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload files',
        variant: 'destructive',
      });
      setIsUploading(false);
      return [];
    }
  };

  const handleCreateAnnouncement = async () => {
    try {
      if (!newAnnouncement.title || !newAnnouncement.content) {
        toast({
          title: 'Error',
          description: 'Please fill all required fields',
          variant: 'destructive',
        });
        return;
      }

      setLoading(true);
      
      // Upload files and get array of URLs
      let uploadedAttachmentUrls: string[] = [];
      if (selectedFiles.length > 0) {
        uploadedAttachmentUrls = await uploadFiles();
      }
      
      // Create announcement with attachment URLs
      const announcementData = {
        ...newAnnouncement,
        attachments: uploadedAttachmentUrls
      };
      
      console.log('Sending announcement data:', announcementData);
      
      const response = await announcementService.createAnnouncement(announcementData);
      
      setAnnouncements(prev => [response.data, ...prev.slice(0, limit - 1)]);
      
      setNewAnnouncement({
        title: '',
        content: '',
        type: 'general',
        targetAudience: 'all',
        year: '',
        pinned: false,
        attachments: []
      });
      setSelectedFiles([]);
      setAttachments([]);
      
      setIsFormOpen(false);
      
      toast({
        title: 'Success',
        description: 'Announcement created successfully',
      });
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: 'Error',
        description: 'Failed to create announcement',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePinAnnouncement = async (id: string, isPinned: boolean) => {
    try {
      await announcementService.pinAnnouncement(id, !isPinned);
      setAnnouncements(prev => 
        prev.map(ann => 
          ann._id === id ? { ...ann, pinned: !isPinned } : ann
        )
      );
      toast({
        title: 'Success',
        description: `Announcement ${isPinned ? 'unpinned' : 'pinned'} successfully`,
      });
    } catch (error) {
      console.error('Error pinning announcement:', error);
      toast({
        title: 'Error',
        description: 'Failed to pin/unpin announcement',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await announcementService.deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(ann => ann._id !== id));
      toast({
        title: 'Success',
        description: 'Announcement deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete announcement',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-primary" />
          Announcements
        </h2>
        
        {isAdmin && showForm && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Announcement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                    placeholder="Announcement title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea 
                    id="content" 
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                    placeholder="Announcement content"
                    rows={5}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select 
                      value={newAnnouncement.type}
                      onValueChange={(value) => setNewAnnouncement({...newAnnouncement, type: value})}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="important">Important</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Select 
                      value={newAnnouncement.targetAudience}
                      onValueChange={(value) => setNewAnnouncement({...newAnnouncement, targetAudience: value})}
                    >
                      <SelectTrigger id="audience">
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="committee">Committee Only</SelectItem>
                        <SelectItem value="students">Students Only</SelectItem>
                        <SelectItem value="specific_year">Specific Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {newAnnouncement.targetAudience === 'specific_year' && (
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select 
                      value={newAnnouncement.year}
                      onValueChange={(value) => setNewAnnouncement({...newAnnouncement, year: value})}
                    >
                      <SelectTrigger id="year">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FE">First Year (FE)</SelectItem>
                        <SelectItem value="SE">Second Year (SE)</SelectItem>
                        <SelectItem value="TE">Third Year (TE)</SelectItem>
                        <SelectItem value="BE">Final Year (BE)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="attachments">Attachments</Label>
                  <div className="border border-input rounded-md p-2">
                    <div className="flex items-center justify-center w-full">
                      <label 
                        htmlFor="file-upload" 
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted/50"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Paperclip className="w-8 h-8 text-muted-foreground mb-2" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF, DOCX, XLSX, JPG, PNG (MAX. 10MB)
                          </p>
                        </div>
                        <input 
                          id="file-upload" 
                          type="file" 
                          className="hidden" 
                          multiple 
                          onChange={handleFileChange}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                    
                    {selectedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">Selected Files ({selectedFiles.length})</p>
                        <div className="space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                              <div className="flex items-center space-x-2">
                                <File className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0" 
                                onClick={() => removeSelectedFile(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {isUploading && (
                      <div className="mt-2">
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${uploadProgress}%` }} 
                          />
                        </div>
                        <p className="text-xs text-right mt-1">{uploadProgress}%</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="pinned"
                    checked={newAnnouncement.pinned}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, pinned: e.target.checked})}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="pinned">Pin this announcement</Label>
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  onClick={handleCreateAnnouncement} 
                  disabled={loading || !newAnnouncement.title || !newAnnouncement.content}
                >
                  {loading ? 'Creating...' : 'Create Announcement'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {loading && !announcements.length ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : announcements.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No announcements available.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card 
              key={announcement._id}
              className={`relative ${announcement.pinned ? 'border-amber-400 shadow-md' : ''}`}
            >
              {announcement.pinned && (
                <div className="absolute top-2 right-2">
                  <Pin className="h-4 w-4 text-amber-500 fill-amber-500" />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getIcon(announcement.type)}
                      {announcement.title}
                    </CardTitle>
                    <CardDescription>
                      By {announcement.createdBy?.name || 'Admin'} • {new Date(announcement.createdAt).toLocaleDateString()} 
                    </CardDescription>
                  </div>
                  <Badge variant={getBadgeVariant(announcement.type)}>
                    {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{announcement.content}</p>
                
                {announcement.attachments && announcement.attachments.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Attachments ({announcement.attachments.length})</p>
                    <div className="space-y-2">
                      {announcement.attachments.map((attachment, index) => (
                        <a 
                          key={index} 
                          href={attachment}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                        >
                          <File className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">
                            {attachment.split('/').pop() || `Attachment ${index + 1}`}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              {isAdmin && (
                <CardFooter className="border-t pt-4 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePinAnnouncement(announcement._id, announcement.pinned)}
                  >
                    <Pin className={`h-4 w-4 mr-1 ${announcement.pinned ? 'fill-amber-500 text-amber-500' : ''}`} />
                    {announcement.pinned ? 'Unpin' : 'Pin'}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteAnnouncement(announcement._id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements; 