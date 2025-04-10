import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Calendar, Star, Award, ChevronRight, Trophy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PointsActivity from '@/components/PointsActivity';

// Define PointsActivity type locally
interface PointsActivityType {
    id: string;
    userId: string;
    description: string;
    points: number;
    category: string;
    createdAt: string;
}

const StudentDashboard = () => {
    const navigate = useNavigate();

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
        }
    ];

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
                        <p className="text-muted-foreground mt-1">View upcoming events and track your progress</p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                                <p className="text-2xl font-bold text-foreground">350</p>
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
                                <p className="text-2xl font-bold text-foreground">8</p>
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
                                <Award className="h-6 w-6 text-neon-pink" />
                            </div>
                            <div>
                                <p className="text-muted-foreground">Badges Earned</p>
                                <p className="text-2xl font-bold text-foreground">1</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Student Badges */}
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
                            <p className="font-medium text-center">Event Enthusiast</p>
                            <p className="text-xs text-muted-foreground text-center">Attended 5+ events</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="events" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="events">Upcoming Events</TabsTrigger>
                        <TabsTrigger value="registered">My Registrations</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                    </TabsList>

                    {/* Events Tab */}
                    <TabsContent value="events">
                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Events</CardTitle>
                                <CardDescription>Events you might be interested in</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>No upcoming events found. Check back soon!</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Registered Events Tab */}
                    <TabsContent value="registered">
                        <Card>
                            <CardHeader>
                                <CardTitle>My Registrations</CardTitle>
                                <CardDescription>Events you've registered for</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>You haven't registered for any events yet.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>
                                    Your recent activities and point-earning events
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
                                    You need 150 more points to unlock the Top Participant badge
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
                                            <h4 className="font-medium">Top Participant</h4>
                                            <p className="text-xs text-muted-foreground">Earn 500+ points from events</p>
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

export default StudentDashboard; 