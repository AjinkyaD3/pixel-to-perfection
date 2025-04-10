import React, { useState } from 'react';
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
import { Plus, Edit, Trash2, DollarSign, Calendar, Users, Image as ImageIcon, FileText, ExternalLink, Star, Share2, Award, ChevronRight, Trophy, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PointsActivity from '@/components/PointsActivity';
import { PointsActivity as PointsActivityType } from '@/types';

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
    const recentActivities: PointsActivityType[] = [
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

    // Event handlers
    const handleAddEvent = () => {
        const event: Event = {
            ...newEvent,
            id: events.length + 1
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
        setIsEventDialogOpen(false);
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

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Member Dashboard</h1>
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
                                <p className="text-2xl font-bold text-foreground">650</p>
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
                                <p className="text-2xl font-bold text-foreground">12</p>
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
                                <p className="text-2xl font-bold text-foreground">30</p>
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
                                <p className="text-2xl font-bold text-foreground">2</p>
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
                        <div className="flex flex-col items-center">
                            <div className="rounded-full p-5 bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg mb-2">
                                <Award className="h-8 w-8 text-white" />
                            </div>
                            <p className="font-medium text-center">Active Learner</p>
                            <p className="text-xs text-muted-foreground text-center">Attended 10+ workshops</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="rounded-full p-5 bg-gradient-to-br from-purple-400 to-fuchsia-500 shadow-lg mb-2">
                                <Share2 className="h-8 w-8 text-white" />
                            </div>
                            <p className="font-medium text-center">Social Butterfly</p>
                            <p className="text-xs text-muted-foreground text-center">Shared 20+ events</p>
                        </div>

                        <div className="flex flex-col items-center opacity-40">
                            <div className="rounded-full p-5 bg-gradient-to-br from-gray-400 to-gray-500 shadow-lg mb-2">
                                <Trophy className="h-8 w-8 text-white" />
                            </div>
                            <p className="font-medium text-center">Top Volunteer</p>
                            <p className="text-xs text-muted-foreground text-center">Locked (500 points)</p>
                        </div>

                        <div className="flex flex-col items-center opacity-40">
                            <div className="rounded-full p-5 bg-gradient-to-br from-gray-400 to-gray-500 shadow-lg mb-2">
                                <Clock className="h-8 w-8 text-white" />
                            </div>
                            <p className="font-medium text-center">Early Bird</p>
                            <p className="text-xs text-muted-foreground text-center">Locked (8+ early registrations)</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <Tabs defaultValue="events" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="events">Events</TabsTrigger>
                        <TabsTrigger value="gallery">Gallery</TabsTrigger>
                        <TabsTrigger value="budget">Budget</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
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
                </Tabs>
            </div>
        </div>
    );
};

export default MemberDashboard; 