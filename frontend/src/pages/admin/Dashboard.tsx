import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, DollarSign, Calendar, Users, UserPlus, Lock, Unlock, Image as ImageIcon, FileText, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { eventService, memberService, budgetService } from '@/lib/api';

interface GalleryImage {
  id: number;
  title: string;
  url: string;
  uploadedBy: string;
  uploadDate: string;
  description?: string;
}

interface BudgetEntry {
  id: number;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  date: string;
  addedBy: string;
}

interface CommitteeMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  image: string;
  department: string;
  isAdmin: boolean;
}

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  budget: number;
  attendees: number;
  image: string;
  status: 'open' | 'closed';
  location: string;
  registrationLink: string;
  expenses: {
    category: string;
    amount: number;
    description: string;
  }[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const { toast } = useToast();
  const [loading, setLoading] = useState({
    events: false,
    members: false,
    budget: false,
    gallery: false
  });

  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Hackathon 2024",
      date: "2024-03-15",
      description: "Annual hackathon event",
      budget: 50000,
      attendees: 200,
      image: "/events/event1.jpg",
      status: 'open',
      location: "Main Auditorium",
      registrationLink: "https://example.com/register",
      expenses: [
        {
          category: "Venue",
          amount: 20000,
          description: "Main hall rental"
        }
      ]
    }
  ]);

  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>([
    {
      id: 1,
      name: "John Doe",
      role: "President",
      email: "john@example.com",
      phone: "1234567890",
      image: "/committee/john.jpg",
      department: "Computer Science",
      isAdmin: true
    }
  ]);

  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    date: '',
    description: '',
    budget: 0,
    attendees: 0,
    image: '',
    status: 'open',
    location: '',
    registrationLink: '',
    expenses: []
  });

  const [newCommitteeMember, setNewCommitteeMember] = useState<Omit<CommitteeMember, 'id'>>({
    name: '',
    role: '',
    email: '',
    phone: '',
    image: '',
    department: '',
    isAdmin: true
  });

  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isCommitteeDialogOpen, setIsCommitteeDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);

  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [budgetEntries, setBudgetEntries] = useState<BudgetEntry[]>([]);
  const [newImage, setNewImage] = useState<Omit<GalleryImage, 'id'>>({
    title: '',
    url: '',
    uploadedBy: '',
    uploadDate: new Date().toISOString(),
    description: ''
  });
  const [newBudgetEntry, setNewBudgetEntry] = useState<Omit<BudgetEntry, 'id'>>({
    category: '',
    amount: 0,
    type: 'expense',
    description: '',
    date: new Date().toISOString(),
    addedBy: ''
  });

  // Fetch events when component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(prev => ({ ...prev, events: true }));
        const response = await eventService.getEvents({});
        console.log("Events response:", response);
        if (response && response.data && Array.isArray(response.data)) {
          setEvents(response.data);
        } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
          // Sometimes the API wraps the data in a data property
          setEvents(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: 'Error',
          description: 'Failed to load events. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(prev => ({ ...prev, events: false }));
      }
    };

    const fetchMembers = async () => {
      try {
        setLoading(prev => ({ ...prev, members: true }));
        const response = await memberService.getMembers({});
        console.log("Members response:", response);
        if (response && response.data && Array.isArray(response.data)) {
          setCommitteeMembers(response.data);
        } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
          // Sometimes the API wraps the data in a data property
          setCommitteeMembers(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching committee members:', error);
        toast({
          title: 'Error',
          description: 'Failed to load committee members. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(prev => ({ ...prev, members: false }));
      }
    };

    const fetchBudget = async () => {
      try {
        setLoading(prev => ({ ...prev, budget: true }));
        const response = await budgetService.getBudgets({});
        console.log("Budget response:", response);
        if (response && response.data && Array.isArray(response.data)) {
          setBudgetEntries(response.data);
        } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
          // Sometimes the API wraps the data in a data property
          setBudgetEntries(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching budget entries:', error);
        toast({
          title: 'Error',
          description: 'Failed to load budget entries. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(prev => ({ ...prev, budget: false }));
      }
    };

    // Initial data load
    fetchEvents();
    fetchMembers();
    fetchBudget();
  }, [toast]);

  // Event handlers with API calls
  const handleAddEvent = async () => {
    try {
      setLoading(prev => ({ ...prev, events: true }));
      
      // Since we don't have a specific API endpoint for creating events yet,
      // we'll use the mock approach for now but log what would be sent
      console.log("Would create event with data:", newEvent);
      
      // For now, use local state for demo purposes
      const event = {
        ...newEvent,
        id: events.length + 1 // Temporary ID
      };
      setEvents([...events, event]);
      
      // Reset form
      setNewEvent({
        title: '',
        date: '',
        description: '',
        budget: 0,
        attendees: 0,
        image: '',
        status: 'open',
        location: '',
        registrationLink: '',
        expenses: []
      });
      setIsEventDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Event added successfully!',
      });
    } catch (error) {
      console.error('Error adding event:', error);
      toast({
        title: 'Error',
        description: 'Failed to add event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  };

  const handleEditEvent = () => {
    if (!editingEvent) return;
    setEvents(events.map(e => e.id === editingEvent.id ? editingEvent : e));
    setEditingEvent(null);
    setIsEventDialogOpen(false);
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const handleToggleEventStatus = (eventId: number) => {
    setEvents(events.map(event =>
      event.id === eventId
        ? { ...event, status: event.status === 'open' ? 'closed' : 'open' }
        : event
    ));
  };

  // Committee member handlers
  const handleAddCommitteeMember = () => {
    const member: CommitteeMember = {
      ...newCommitteeMember,
      id: committeeMembers.length + 1
    };
    setCommitteeMembers([...committeeMembers, member]);
    setNewCommitteeMember({
      name: '',
      role: '',
      email: '',
      phone: '',
      image: '',
      department: '',
      isAdmin: true
    });
    setIsCommitteeDialogOpen(false);
  };

  const handleEditCommitteeMember = () => {
    if (!editingMember) return;
    setCommitteeMembers(committeeMembers.map(m => m.id === editingMember.id ? editingMember : m));
    setEditingMember(null);
    setIsCommitteeDialogOpen(false);
  };

  const handleDeleteCommitteeMember = (id: number) => {
    setCommitteeMembers(committeeMembers.filter(m => m.id !== id));
  };

  // Statistics
  const totalBudget = events.reduce((sum, event) => sum + event.budget, 0);
  const totalAttendees = events.reduce((sum, event) => sum + event.attendees, 0);
  const activeEvents = events.filter(event => event.status === 'open').length;

  const handleAddImage = () => {
    const image: GalleryImage = {
      ...newImage,
      id: galleryImages.length + 1
    };
    setGalleryImages([...galleryImages, image]);
    setNewImage({
      title: '',
      url: '',
      uploadedBy: '',
      uploadDate: new Date().toISOString(),
      description: ''
    });
  };

  const handleDeleteImage = (id: number) => {
    setGalleryImages(galleryImages.filter(img => img.id !== id));
  };

  const handleAddBudgetEntry = () => {
    const entry: BudgetEntry = {
      ...newBudgetEntry,
      id: budgetEntries.length + 1
    };
    setBudgetEntries([...budgetEntries, entry]);
    setNewBudgetEntry({
      category: '',
      amount: 0,
      type: 'expense',
      description: '',
      date: new Date().toISOString(),
      addedBy: ''
    });
  };

  const handleDeleteBudgetEntry = (id: number) => {
    setBudgetEntries(budgetEntries.filter(entry => entry.id !== id));
  };

  // Calculate budget statistics
  const totalIncome = budgetEntries
    .filter(entry => entry.type === 'income')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalExpenses = budgetEntries
    .filter(entry => entry.type === 'expense')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const currentBalance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your club's events and committee members</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10"
          >
            Back to Home
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-neon-blue/10 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-neon-blue" />
              </div>
              <div>
                <p className="text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold text-foreground">₹{totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-neon-purple/10 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-neon-purple" />
              </div>
              <div>
                <p className="text-muted-foreground">Active Events</p>
                <p className="text-2xl font-bold text-foreground">{activeEvents}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-neon-pink/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-neon-pink" />
              </div>
              <div>
                <p className="text-muted-foreground">Total Attendees</p>
                <p className="text-2xl font-bold text-foreground">{totalAttendees}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-neon-green/10 p-3 rounded-full">
                <UserPlus className="h-6 w-6 text-neon-green" />
              </div>
              <div>
                <p className="text-muted-foreground">Committee Members</p>
                <p className="text-2xl font-bold text-foreground">{committeeMembers.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 gap-4 bg-background/95 p-1">
            <TabsTrigger value="events" className="data-[state=active]:bg-neon-blue/10">
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="committee" className="data-[state=active]:bg-neon-purple/10">
              <Users className="h-4 w-4 mr-2" />
              Committee
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-neon-green/10">
              <ImageIcon className="h-4 w-4 mr-2" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="budget" className="data-[state=active]:bg-neon-yellow/10">
              <DollarSign className="h-4 w-4 mr-2" />
              Budget
            </TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events">
            <Card className="border-none shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Events Management</CardTitle>
                  <CardDescription>Create and manage your club's events</CardDescription>
                </div>
                <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-neon-blue hover:bg-neon-blue/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={editingEvent?.title || newEvent.title}
                          onChange={(e) => {
                            if (editingEvent) {
                              setEditingEvent({ ...editingEvent, title: e.target.value });
                            } else {
                              setNewEvent({ ...newEvent, title: e.target.value });
                            }
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={editingEvent?.date || newEvent.date}
                          onChange={(e) => {
                            if (editingEvent) {
                              setEditingEvent({ ...editingEvent, date: e.target.value });
                            } else {
                              setNewEvent({ ...newEvent, date: e.target.value });
                            }
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={editingEvent?.location || newEvent.location}
                          onChange={(e) => {
                            if (editingEvent) {
                              setEditingEvent({ ...editingEvent, location: e.target.value });
                            } else {
                              setNewEvent({ ...newEvent, location: e.target.value });
                            }
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="registrationLink">Registration Link</Label>
                        <Input
                          id="registrationLink"
                          value={editingEvent?.registrationLink || newEvent.registrationLink}
                          onChange={(e) => {
                            if (editingEvent) {
                              setEditingEvent({ ...editingEvent, registrationLink: e.target.value });
                            } else {
                              setNewEvent({ ...newEvent, registrationLink: e.target.value });
                            }
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={editingEvent?.description || newEvent.description}
                          onChange={(e) => {
                            if (editingEvent) {
                              setEditingEvent({ ...editingEvent, description: e.target.value });
                            } else {
                              setNewEvent({ ...newEvent, description: e.target.value });
                            }
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="budget">Budget (₹)</Label>
                        <Input
                          id="budget"
                          type="number"
                          value={editingEvent?.budget || newEvent.budget}
                          onChange={(e) => {
                            if (editingEvent) {
                              setEditingEvent({ ...editingEvent, budget: Number(e.target.value) });
                            } else {
                              setNewEvent({ ...newEvent, budget: Number(e.target.value) });
                            }
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="attendees">Expected Attendees</Label>
                        <Input
                          id="attendees"
                          type="number"
                          value={editingEvent?.attendees || newEvent.attendees}
                          onChange={(e) => {
                            if (editingEvent) {
                              setEditingEvent({ ...editingEvent, attendees: Number(e.target.value) });
                            } else {
                              setNewEvent({ ...newEvent, attendees: Number(e.target.value) });
                            }
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                          id="image"
                          value={editingEvent?.image || newEvent.image}
                          onChange={(e) => {
                            if (editingEvent) {
                              setEditingEvent({ ...editingEvent, image: e.target.value });
                            } else {
                              setNewEvent({ ...newEvent, image: e.target.value });
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={editingEvent ? handleEditEvent : handleAddEvent}>
                        {editingEvent ? 'Save Changes' : 'Add Event'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Details</TableHead>
                      <TableHead>Date & Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading.events ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex justify-center items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Loading events...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : events.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="text-muted-foreground">No events available. Add one to get started!</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      events.map((event) => (
                        <TableRow key={event.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-4">
                              {event.image && (
                                <img
                                  src={event.image}
                                  alt={event.title}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <div className="font-medium">{event.title}</div>
                                <div className="text-sm text-muted-foreground line-clamp-2">
                                  {event.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{new Date(event.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{event.location}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={event.status === 'open' ? 'default' : 'destructive'}
                              className="flex items-center gap-1"
                            >
                              {event.status === 'open' ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                              {event.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">₹{event.budget.toLocaleString()}</div>
                            {event.registrationLink && (
                              <a
                                href={event.registrationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-neon-blue hover:underline flex items-center gap-1"
                              >
                                Register <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingEvent(event);
                                  setIsEventDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Committee Tab */}
          <TabsContent value="committee">
            <Card className="border-none shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Committee Management</CardTitle>
                  <CardDescription>Manage your club's committee members</CardDescription>
                </div>
                <Dialog open={isCommitteeDialogOpen} onOpenChange={setIsCommitteeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-neon-purple hover:bg-neon-purple/90">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>{editingMember ? 'Edit Committee Member' : 'Add Committee Member'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="memberName">Name</Label>
                        <Input
                          id="memberName"
                          value={editingMember?.name || newCommitteeMember.name}
                          onChange={(e) => {
                            if (editingMember) {
                              setEditingMember({ ...editingMember, name: e.target.value });
                            } else {
                              setNewCommitteeMember({ ...newCommitteeMember, name: e.target.value });
                            }
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="memberRole">Role</Label>
                        <Input
                          id="memberRole"
                          value={editingMember?.role || newCommitteeMember.role}
                          onChange={(e) => {
                            if (editingMember) {
                              setEditingMember({ ...editingMember, role: e.target.value });
                            } else {
                              setNewCommitteeMember({ ...newCommitteeMember, role: e.target.value });
                            }
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="memberDepartment">Department</Label>
                        <Input
                          id="memberDepartment"
                          value={editingMember?.department || newCommitteeMember.department}
                          onChange={(e) => {
                            if (editingMember) {
                              setEditingMember({ ...editingMember, department: e.target.value });
                            } else {
                              setNewCommitteeMember({ ...newCommitteeMember, department: e.target.value });
                            }
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="memberEmail">Email</Label>
                        <Input
                          id="memberEmail"
                          type="email"
                          value={editingMember?.email || newCommitteeMember.email}
                          onChange={(e) => {
                            if (editingMember) {
                              setEditingMember({ ...editingMember, email: e.target.value });
                            } else {
                              setNewCommitteeMember({ ...newCommitteeMember, email: e.target.value });
                            }
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="memberPhone">Phone</Label>
                        <Input
                          id="memberPhone"
                          value={editingMember?.phone || newCommitteeMember.phone}
                          onChange={(e) => {
                            if (editingMember) {
                              setEditingMember({ ...editingMember, phone: e.target.value });
                            } else {
                              setNewCommitteeMember({ ...newCommitteeMember, phone: e.target.value });
                            }
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="memberImage">Image URL</Label>
                        <Input
                          id="memberImage"
                          value={editingMember?.image || newCommitteeMember.image}
                          onChange={(e) => {
                            if (editingMember) {
                              setEditingMember({ ...editingMember, image: e.target.value });
                            } else {
                              setNewCommitteeMember({ ...newCommitteeMember, image: e.target.value });
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button variant="outline" onClick={() => setIsCommitteeDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={editingMember ? handleEditCommitteeMember : handleAddCommitteeMember}>
                        {editingMember ? 'Save Changes' : 'Add Member'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member Details</TableHead>
                      <TableHead>Role & Department</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading.members ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <div className="flex justify-center items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Loading committee members...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : committeeMembers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <p className="text-muted-foreground">No committee members available. Add one to get started!</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      committeeMembers.map((member) => (
                        <TableRow key={member.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-4">
                              {member.image && (
                                <img
                                  src={member.image}
                                  alt={member.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              )}
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-muted-foreground">{member.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{member.role}</div>
                              <div className="text-sm text-muted-foreground">{member.department}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{member.email}</div>
                              <div className="text-muted-foreground">{member.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingMember(member);
                                  setIsCommitteeDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCommitteeMember(member.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gallery Management</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-neon-green/10 text-neon-green hover:bg-neon-green/20">
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
          </TabsContent>

          <TabsContent value="budget" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Income</CardTitle>
                  <CardDescription>All time income</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-500">₹{totalIncome.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Expenses</CardTitle>
                  <CardDescription>All time expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-500">₹{totalExpenses.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Current Balance</CardTitle>
                  <CardDescription>Available funds</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ₹{currentBalance.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Budget Entries</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-neon-yellow/10 text-neon-yellow hover:bg-neon-yellow/20">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Budget Entry</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newBudgetEntry.category}
                        onChange={(e) => setNewBudgetEntry({ ...newBudgetEntry, category: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={newBudgetEntry.amount}
                        onChange={(e) => setNewBudgetEntry({ ...newBudgetEntry, amount: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <select
                        id="type"
                        value={newBudgetEntry.type}
                        onChange={(e) => setNewBudgetEntry({ ...newBudgetEntry, type: e.target.value as 'income' | 'expense' })}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newBudgetEntry.description}
                        onChange={(e) => setNewBudgetEntry({ ...newBudgetEntry, description: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleAddBudgetEntry} className="w-full">Add Entry</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading.budget ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex justify-center items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Loading budget entries...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : budgetEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">No budget entries available. Add one to get started!</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  budgetEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                      <TableCell>{entry.category}</TableCell>
                      <TableCell>
                        <Badge variant={entry.type === 'income' ? 'default' : 'destructive'}>
                          {entry.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={entry.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                        ₹{entry.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteBudgetEntry(entry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard; 