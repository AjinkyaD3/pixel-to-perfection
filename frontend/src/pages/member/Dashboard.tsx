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
import { Plus, Edit, Trash2, DollarSign, Calendar, Users, Image as ImageIcon, FileText, ExternalLink, Star, Share2, Award, ChevronRight, Trophy, Clock, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PointsActivity from '@/components/PointsActivity';
import { PointsActivity as PointsActivityType } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { authService, eventService, budgetService, leaderboardService } from '@/lib/api';
import Announcements from '@/components/Announcements';

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

const MemberDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('events');
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [userRanking, setUserRanking] = useState<any>(null);
    const [recentActivities, setRecentActivities] = useState<PointsActivityType[]>([]);

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

    const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

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

    // Mock data for recent activities
    const recentActivitiesMock: PointsActivityType[] = [
        {
            id: '1',
            userId: 'user1',
            description: 'Attended Web Dev Workshop',
            points: 20,
            category: 'event',
            createdAt: '2023-10-15T14:30:00Z'
        },
        {
            id: '2',
            userId: 'user1',
            description: 'Early registration for AI Hackathon',
            points: 15,
            category: 'registration',
            createdAt: '2023-10-10T09:15:00Z'
        },
        {
            id: '3',
            userId: 'user1',
            description: 'Shared Tech Meet-up on Twitter',
            points: 10,
            category: 'social',
            createdAt: '2023-10-08T18:45:00Z'
        },
        {
            id: '4',
            userId: 'user1',
            description: 'Helped organize Virtual Reality Demo',
            points: 50,
            category: 'contribution',
            createdAt: '2023-10-01T13:20:00Z'
        },
        {
            id: '5',
            userId: 'user1',
            description: 'Attended Cloud Computing Seminar',
            points: 20,
            category: 'event',
            createdAt: '2023-09-28T16:00:00Z'
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Get user profile data
                const userResponse = await authService.getMe();
                setUserData(userResponse.data);

                // Get user ranking and badge information
                try {
                    const rankingResponse = await leaderboardService.getMyRanking();
                    setUserRanking(rankingResponse.data);
                } catch (err) {
                    console.error('Error fetching ranking:', err);
                    // If there's an error, we'll just continue without ranking data
                }

                // Get events data
                try {
                    const eventsResponse = await eventService.getEvents({});
                    if (eventsResponse.data) {
                        setEvents(eventsResponse.data.map((event: any, index: number) => ({
                            id: event._id || index + 1,
                            title: event.title,
                            date: event.date,
                            description: event.description,
                            budget: event.budget || 0,
                            attendees: event.attendees?.length || 0,
                            image: event.posterUrl || "",
                            status: event.status || 'open',
                            location: event.venue || "",
                            registrationLink: event.registrationLink || "",
                            expenses: event.expenses || []
                        })));
                    }
                } catch (err) {
                    console.error('Error fetching events:', err);
                }
                
                // Get budget data
                try {
                    const budgetResponse = await budgetService.getBudgets({});
                    if (budgetResponse.data) {
                        setBudgetEntries(budgetResponse.data.map((entry: any, index: number) => ({
                            id: entry._id || index + 1,
                            category: entry.category,
                            amount: entry.amount,
                            type: entry.type || 'expense',
                            description: entry.description,
                            date: entry.date || new Date().toISOString(),
                            addedBy: entry.addedBy || userData?.name || ""
                        })));
                    }
                } catch (err) {
                    console.error('Error fetching budget entries:', err);
                }

                // Set activity data - in a real implementation, this would come from an API endpoint
                // For now, we're generating sample data based on the user ID
                if (userResponse.data) {
                    setRecentActivities(recentActivitiesMock);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                toast({
                    title: "Error",
                    description: "Failed to load dashboard data",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Event handlers
    const handleAddEvent = async () => {
        try {
            const eventData = {
                title: newEvent.title,
                type: "Workshop",
                description: newEvent.description,
                date: newEvent.date,
                time: "09:00",
                venue: newEvent.location,
                maxCapacity: 100,
                speaker: { name: "Speaker", bio: "" }
            };
            
            const response = await eventService.createEvent(eventData);
            
            const event: Event = {
                ...newEvent,
                id: response.data._id || events.length + 1
            };
            
            setEvents([...events, event]);
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
            
            toast({
                title: "Success",
                description: "Event created successfully",
            });
            
            setIsEventDialogOpen(false);
        } catch (error) {
            console.error('Error creating event:', error);
            toast({
                title: "Error",
                description: "Failed to create event",
                variant: "destructive",
            });
        }
    };

    const handleEditEvent = async () => {
        if (!editingEvent) return;
        
        try {
            const eventData = {
                title: editingEvent.title,
                type: "Workshop",
                description: editingEvent.description,
                date: editingEvent.date,
                time: "09:00",
                venue: editingEvent.location,
                maxCapacity: 100,
                speaker: { name: "Speaker", bio: "" }
            };
            
            await eventService.updateEvent(editingEvent.id.toString(), eventData);
            
            setEvents(events.map(e => e.id === editingEvent.id ? editingEvent : e));
            
            toast({
                title: "Success",
                description: "Event updated successfully",
            });
            
            setEditingEvent(null);
            setIsEventDialogOpen(false);
        } catch (error) {
            console.error('Error updating event:', error);
            toast({
                title: "Error",
                description: "Failed to update event",
                variant: "destructive",
            });
        }
    };

    const handleDeleteEvent = async (id: number) => {
        try {
            await eventService.deleteEvent(id.toString());
            // Then update UI
            setEvents(events.filter(event => event.id !== id));
            toast({
                title: "Success",
                description: "Event deleted successfully",
            });
        } catch (error) {
            console.error('Error deleting event:', error);
            toast({
                title: "Error",
                description: "Failed to delete event",
                variant: "destructive",
            });
        }
    };

    const handleToggleEventStatus = (eventId: number) => {
        setEvents(events.map(event =>
            event.id === eventId
                ? { ...event, status: event.status === 'open' ? 'closed' : 'open' }
                : event
        ));
    };

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

    const handleAddBudgetEntry = async () => {
        try {
            const budgetData = {
                category: newBudgetEntry.category,
                amount: newBudgetEntry.amount,
                type: newBudgetEntry.type,
                description: newBudgetEntry.description,
                date: newBudgetEntry.date
            };
            
            const response = await budgetService.createBudgetEntry(budgetData);
            
            const entry: BudgetEntry = {
                ...newBudgetEntry,
                id: response.data._id || budgetEntries.length + 1
            };
            
            setBudgetEntries([...budgetEntries, entry]);
            
            toast({
                title: "Success",
                description: "Budget entry created successfully",
            });
            
            setNewBudgetEntry({
                category: '',
                amount: 0,
                type: 'expense',
                description: '',
                date: new Date().toISOString(),
                addedBy: ''
            });
        } catch (error) {
            console.error('Error creating budget entry:', error);
            toast({
                title: "Error",
                description: "Failed to create budget entry",
                variant: "destructive",
            });
        }
    };

    const handleDeleteBudgetEntry = async (id: number) => {
        try {
            await budgetService.deleteBudgetEntry(id.toString());
            // Then update UI
            setBudgetEntries(budgetEntries.filter(entry => entry.id !== id));
            toast({
                title: "Success",
                description: "Budget entry deleted successfully",
            });
        } catch (error) {
            console.error('Error deleting budget entry:', error);
            toast({
                title: "Error",
                description: "Failed to delete budget entry",
                variant: "destructive",
            });
        }
    };

    // Statistics
    const totalBudget = events.reduce((sum, event) => sum + event.budget, 0);
    const totalAttendees = events.reduce((sum, event) => sum + event.attendees, 0);
    const activeEvents = events.filter(event => event.status === 'open').length;

    // Calculate budget statistics
    const totalIncome = budgetEntries
        .filter(entry => entry.type === 'income')
        .reduce((sum, entry) => sum + entry.amount, 0);

    const totalExpenses = budgetEntries
        .filter(entry => entry.type === 'expense')
        .reduce((sum, entry) => sum + entry.amount, 0);

    const currentBalance = totalIncome - totalExpenses;

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-lg font-medium">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Hello, {userData?.name || 'Member'}</h1>
                        <p className="text-muted-foreground mt-1">View upcoming events and track your engagement</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/')}
                        className="border-neon-purple/50 text-neon-purple hover:bg-neon-purple/10"
                    >
                        Back to Home
                    </Button>
                </div>

                {/* Points Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-neon-purple/10 p-3 rounded-full">
                                <Star className="h-6 w-6 text-neon-purple" />
                            </div>
                            <div>
                                <p className="text-muted-foreground">Total Points</p>
                                <p className="text-2xl font-bold text-foreground">{userData?.points || 0}</p>
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
                            <div className="bg-neon-blue/10 p-3 rounded-full">
                                <Calendar className="h-6 w-6 text-neon-blue" />
                            </div>
                            <div>
                                <p className="text-muted-foreground">Events Attended</p>
                                <p className="text-2xl font-bold text-foreground">{userData?.eventAttendance || 0}</p>
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
                            <div className="bg-neon-green/10 p-3 rounded-full">
                                <Share2 className="h-6 w-6 text-neon-green" />
                            </div>
                            <div>
                                <p className="text-muted-foreground">Social Shares</p>
                                <p className="text-2xl font-bold text-foreground">{userData?.socialShares || 0}</p>
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
                            <div className="bg-neon-pink/10 p-3 rounded-full">
                                <Award className="h-6 w-6 text-neon-pink" />
                            </div>
                            <div>
                                <p className="text-muted-foreground">Badges Earned</p>
                                <p className="text-2xl font-bold text-foreground">{userRanking?.badges?.length || 0}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Member Badges */}
                <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Your Badges</h2>
                        <Button variant="link" onClick={() => navigate('/leaderboard')} className="text-neon-purple">
                            View Leaderboard <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {userRanking?.badges?.length > 0 ? (
                            // Display actual badges from userRanking
                            userRanking.badges.map((badge: any) => (
                                <div key={badge.id} className="flex flex-col items-center">
                                    <div className={`rounded-full p-5 bg-gradient-to-br ${
                                        badge.color === 'gold' ? 'from-amber-300 to-yellow-500' :
                                        badge.color === 'blue' ? 'from-blue-400 to-indigo-500' :
                                        badge.color === 'purple' ? 'from-purple-400 to-fuchsia-500' :
                                        badge.color === 'green' ? 'from-emerald-400 to-green-500' :
                                        'from-orange-300 to-amber-500'
                                    } shadow-lg mb-2`}>
                                        {badge.icon === 'trophy' ? <Trophy className="h-8 w-8 text-white" /> :
                                         badge.icon === 'share' ? <Share2 className="h-8 w-8 text-white" /> :
                                         badge.icon === 'clock' ? <Clock className="h-8 w-8 text-white" /> :
                                         badge.icon === 'star' ? <Star className="h-8 w-8 text-white" /> :
                                         <Award className="h-8 w-8 text-white" />}
                                    </div>
                                    <p className="font-medium text-center">{badge.name}</p>
                                    <p className="text-xs text-muted-foreground text-center">{badge.description}</p>
                                </div>
                            ))
                        ) : (
                            // Display a message if no badges
                            <div className="col-span-4 text-center py-4 text-muted-foreground">
                                You haven't earned any badges yet. Participate in events to earn badges!
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <Tabs defaultValue="events" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="events">Events</TabsTrigger>
                        <TabsTrigger value="gallery">Gallery</TabsTrigger>
                        <TabsTrigger value="budget">Budget</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                        <TabsTrigger value="announcements">Announcements</TabsTrigger>
                    </TabsList>

                    {/* Events Tab */}
                    <TabsContent value="events">
                        <Card className="border-none shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Events Management</CardTitle>
                                    <CardDescription>View and manage events</CardDescription>
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
                                                <Label htmlFor="title">Event Title</Label>
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
                                            <Button
                                                onClick={editingEvent ? handleEditEvent : handleAddEvent}
                                                className="w-full"
                                            >
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
                                        {events.map((event) => (
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
                                                    <div className="flex items-center gap-2">
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
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDeleteEvent(event.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Gallery Tab */}
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

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

                    {/* Budget Tab */}
                    <TabsContent value="budget">
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

                        <div className="space-y-4">
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
                                    {budgetEntries.map((entry) => (
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
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>
                                    Your recent contributions and point-earning activities
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <PointsActivity activities={recentActivities} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Progress to Next Badge</CardTitle>
                                <CardDescription>
                                    You need 150 more points to unlock the Top Volunteer badge
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm font-medium mb-1">
                                            <span>Current: 350 points</span>
                                            <span>Goal: 500 points</span>
                                        </div>
                                        <div className="w-full bg-background h-3 rounded-full overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-neon-purple to-neon-pink h-full rounded-full"
                                                style={{ width: '70%' }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-background/50 rounded-lg border border-border/30">
                                        <div className="flex-shrink-0">
                                            <div className="rounded-full p-3 bg-gradient-to-br from-amber-300 to-yellow-500 shadow-lg opacity-50">
                                                <Trophy className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium">Top Volunteer</h4>
                                            <p className="text-xs text-muted-foreground">Contribute to organizing 5+ events</p>
                                        </div>
                                        <Badge variant="outline">In Progress</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="announcements">
                        <Announcements isAdmin={false} limit={5} showForm={false} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default MemberDashboard; 