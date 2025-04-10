import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Star, Share2, Calendar, Zap } from 'lucide-react';
import { LeaderboardEntry, Badge as BadgeType } from '@/types';
import ThreeDBackground from '@/components/ThreeDBackground';

// Sample data
const mockBadges: BadgeType[] = [
    {
        id: '1',
        name: 'Top Volunteer',
        description: 'Contributed to organizing 5+ events',
        icon: 'trophy',
        color: 'gold',
        requiredPoints: 500
    },
    {
        id: '2',
        name: 'Active Learner',
        description: 'Attended 10+ technical workshops',
        icon: 'book',
        color: 'blue',
        requiredPoints: 300
    },
    {
        id: '3',
        name: 'Social Butterfly',
        description: 'Shared 20+ events on social media',
        icon: 'share',
        color: 'purple',
        requiredPoints: 200
    },
    {
        id: '4',
        name: 'Early Bird',
        description: 'Registered early for 8+ events',
        icon: 'clock',
        color: 'green',
        requiredPoints: 160
    },
    {
        id: '5',
        name: 'Rising Star',
        description: 'Earned 100+ points in a month',
        icon: 'star',
        color: 'orange',
        requiredPoints: 100
    }
];

const mockLeaderboard: LeaderboardEntry[] = [
    {
        id: '1',
        userId: 'user1',
        name: 'Alex Johnson',
        avatar: '/avatars/alex.jpg',
        points: 780,
        rank: 1,
        badges: [mockBadges[0], mockBadges[1], mockBadges[2]],
        eventsAttended: 15,
        earlyRegistrations: 12,
        socialShares: 25,
        contributions: 8
    },
    {
        id: '2',
        userId: 'user2',
        name: 'Maya Patel',
        avatar: '/avatars/maya.jpg',
        points: 650,
        rank: 2,
        badges: [mockBadges[1], mockBadges[2]],
        eventsAttended: 12,
        earlyRegistrations: 10,
        socialShares: 30,
        contributions: 5
    },
    {
        id: '3',
        userId: 'user3',
        name: 'Zain Ahmed',
        avatar: '/avatars/zain.jpg',
        points: 520,
        rank: 3,
        badges: [mockBadges[0], mockBadges[4]],
        eventsAttended: 10,
        earlyRegistrations: 8,
        socialShares: 15,
        contributions: 7
    },
    {
        id: '4',
        userId: 'user4',
        name: 'Sofia Rodriguez',
        avatar: '/avatars/sofia.jpg',
        points: 480,
        rank: 4,
        badges: [mockBadges[2], mockBadges[3]],
        eventsAttended: 8,
        earlyRegistrations: 8,
        socialShares: 22,
        contributions: 4
    },
    {
        id: '5',
        userId: 'user5',
        name: 'Jamal Wilson',
        avatar: '/avatars/jamal.jpg',
        points: 420,
        rank: 5,
        badges: [mockBadges[3], mockBadges[4]],
        eventsAttended: 9,
        earlyRegistrations: 7,
        socialShares: 18,
        contributions: 3
    }
];

// Badge Icon component
const BadgeIcon: React.FC<{ badge: BadgeType, size?: 'sm' | 'md' | 'lg' }> = ({ badge, size = 'md' }) => {
    const getIcon = () => {
        switch (badge.icon) {
            case 'trophy':
                return <Trophy className={size === 'lg' ? "h-8 w-8" : size === 'md' ? "h-6 w-6" : "h-4 w-4"} />;
            case 'book':
                return <Award className={size === 'lg' ? "h-8 w-8" : size === 'md' ? "h-6 w-6" : "h-4 w-4"} />;
            case 'share':
                return <Share2 className={size === 'lg' ? "h-8 w-8" : size === 'md' ? "h-6 w-6" : "h-4 w-4"} />;
            case 'clock':
                return <Calendar className={size === 'lg' ? "h-8 w-8" : size === 'md' ? "h-6 w-6" : "h-4 w-4"} />;
            case 'star':
                return <Star className={size === 'lg' ? "h-8 w-8" : size === 'md' ? "h-6 w-6" : "h-4 w-4"} />;
            default:
                return <Medal className={size === 'lg' ? "h-8 w-8" : size === 'md' ? "h-6 w-6" : "h-4 w-4"} />;
        }
    };

    const getColor = () => {
        switch (badge.color) {
            case 'gold':
                return 'from-amber-300 to-yellow-500';
            case 'blue':
                return 'from-blue-400 to-indigo-500';
            case 'purple':
                return 'from-purple-400 to-fuchsia-500';
            case 'green':
                return 'from-emerald-400 to-green-500';
            case 'orange':
                return 'from-orange-300 to-amber-500';
            default:
                return 'from-blue-400 to-indigo-500';
        }
    };

    const sizePadding = size === 'lg' ? 'p-4' : size === 'md' ? 'p-3' : 'p-2';

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className={`rounded-full ${sizePadding} bg-gradient-to-br ${getColor()} shadow-lg relative`}
        >
            <div className="relative z-10 text-white">{getIcon()}</div>
        </motion.div>
    );
};

const LeaderboardPage: React.FC = () => {
    const [view, setView] = useState<'leaderboard' | 'badges'>('leaderboard');

    return (
        <div className="relative min-h-screen ">
            <ThreeDBackground />
            <Navbar />

            <div className="relative z-10 container mx-auto py-16 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-neon-gradient animate-gradient-animation bg-300% mb-4">
                        Community Leaderboard
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Earn points by participating in events, registering early, sharing on social media, and contributing to the community.
                    </p>
                </div>

                <Tabs defaultValue="leaderboard" className="max-w-5xl mx-auto">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                        <TabsTrigger value="badges">Available Badges</TabsTrigger>
                    </TabsList>

                    <TabsContent value="leaderboard" className="space-y-8">
                        {/* Top Contributors */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {mockLeaderboard.slice(0, 3).map((entry, index) => (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    className={`bg-gradient-to-br ${index === 0
                                        ? 'from-yellow-500/10 to-yellow-600/5 border-yellow-500/20'
                                        : index === 1
                                            ? 'from-gray-400/10 to-gray-500/5 border-gray-400/20'
                                            : 'from-amber-700/10 to-amber-800/5 border-amber-700/20'
                                        } backdrop-blur-md rounded-xl p-6 border shadow-lg`}
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="relative mb-4">
                                            <div className={`absolute -top-3 -right-3 rounded-full p-2 ${index === 0
                                                ? 'bg-yellow-500 text-white'
                                                : index === 1
                                                    ? 'bg-gray-400 text-white'
                                                    : 'bg-amber-700 text-white'
                                                }`}>
                                                {index === 0 ? (
                                                    <Trophy className="h-5 w-5" />
                                                ) : (
                                                    <Medal className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div className={`text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center absolute -top-2 -left-2 ${index === 0
                                                ? 'bg-yellow-500 text-white'
                                                : index === 1
                                                    ? 'bg-gray-400 text-white'
                                                    : 'bg-amber-700 text-white'
                                                }`}>
                                                {entry.rank}
                                            </div>
                                            <Avatar className={`h-24 w-24 border-4 ${index === 0
                                                ? 'border-yellow-500/30'
                                                : index === 1
                                                    ? 'border-gray-400/30'
                                                    : 'border-amber-700/30'
                                                }`}>
                                                <AvatarImage src={entry.avatar} />
                                                <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <h3 className="text-xl font-bold mt-2">{entry.name}</h3>
                                        <div className={`flex items-center mt-1 mb-3 ${index === 0
                                            ? 'text-yellow-500'
                                            : index === 1
                                                ? 'text-gray-400'
                                                : 'text-amber-700'
                                            }`}>
                                            <Zap className="h-5 w-5 mr-1" />
                                            <span className="font-bold text-lg">{entry.points} points</span>
                                        </div>

                                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                                            {entry.badges.map((badge) => (
                                                <div key={badge.id} className="inline-block">
                                                    <BadgeIcon badge={badge} size="sm" />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 w-full mt-4 text-sm text-muted-foreground">
                                            <div className="flex items-center justify-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                <span>{entry.eventsAttended} events</span>
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <Share2 className="h-4 w-4 mr-1" />
                                                <span>{entry.socialShares} shares</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Full Leaderboard */}
                        <div className="bg-background/80 backdrop-blur-xl rounded-xl p-6 border border-border/50">
                            <h2 className="text-2xl font-bold mb-6">All Participants</h2>
                            <div className="space-y-4">
                                {mockLeaderboard.map((entry) => (
                                    <motion.div
                                        key={entry.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: entry.rank * 0.05 }}
                                        whileHover={{ scale: 1.01 }}
                                        className={`flex items-center justify-between p-4 rounded-lg ${entry.rank <= 3
                                            ? 'bg-gradient-to-r from-background/40 to-background/70 border border-border/30'
                                            : 'bg-background/40 border border-border/20'} 
                                            hover:bg-background/50 transition-all`}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-8 h-8 flex items-center justify-center font-bold text-lg mr-4 rounded-full
                                                ${entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                                                    entry.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                                                        entry.rank === 3 ? 'bg-amber-700/20 text-amber-700' :
                                                            'bg-slate-700/20 text-slate-400'}`}>
                                                {entry.rank}
                                            </div>
                                            <Avatar className="h-10 w-10 mr-4 border-2 border-slate-800">
                                                <AvatarImage src={entry.avatar} />
                                                <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-medium">{entry.name}</h3>
                                                <div className="flex space-x-3 text-xs text-muted-foreground mt-1">
                                                    <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {entry.eventsAttended}</span>
                                                    <span className="flex items-center"><Share2 className="h-3 w-3 mr-1" /> {entry.socialShares}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="flex -space-x-1 mr-4">
                                                {entry.badges.slice(0, 3).map((badge) => (
                                                    <div key={badge.id} className="inline-block h-7 w-7 rounded-full">
                                                        <BadgeIcon badge={badge} size="sm" />
                                                    </div>
                                                ))}
                                                {entry.badges.length > 3 && (
                                                    <div className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-slate-800 text-xs font-medium text-white">
                                                        +{entry.badges.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <div className={`font-bold px-3 py-1 rounded-full ${entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                                                entry.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                                                    entry.rank === 3 ? 'bg-amber-700/20 text-amber-700' :
                                                        'bg-blue-500/20 text-blue-500'
                                                }`}>
                                                {entry.points} pts
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="badges" className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mockBadges.map((badge, index) => (
                                <motion.div
                                    key={badge.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <Card className="backdrop-blur-xl bg-gradient-to-br from-background/80 to-background/50 overflow-hidden border-border/30 hover:shadow-lg transition-all">
                                        <CardHeader className="pb-2 relative">
                                            <div className="absolute -right-8 -top-8 opacity-10">
                                                <BadgeIcon badge={badge} size="lg" />
                                            </div>
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg">{badge.name}</CardTitle>
                                                    <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
                                                </div>
                                                <BadgeIcon badge={badge} size="md" />
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="mt-4">
                                                <Badge variant="outline" className="bg-background/50 font-semibold">
                                                    {badge.requiredPoints} points required
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-br from-background/80 to-background/50 backdrop-blur-xl rounded-xl p-6 border border-border/30 mt-8">
                            <h2 className="text-2xl font-bold mb-6">How to Earn Points</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div
                                    className="flex items-start"
                                    whileHover={{ x: 5 }}
                                >
                                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-neon-blue/10 mr-4">
                                        <Calendar className="h-6 w-6 text-neon-blue" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg">Event Attendance</h3>
                                        <p className="text-muted-foreground">20 points per event attended</p>
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="flex items-start"
                                    whileHover={{ x: 5 }}
                                >
                                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-neon-purple/10 mr-4">
                                        <Star className="h-6 w-6 text-neon-purple" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg">Early Registration</h3>
                                        <p className="text-muted-foreground">15 points for registering 7+ days early</p>
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="flex items-start"
                                    whileHover={{ x: 5 }}
                                >
                                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-neon-green/10 mr-4">
                                        <Share2 className="h-6 w-6 text-neon-green" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg">Social Sharing</h3>
                                        <p className="text-muted-foreground">10 points per event shared on social media</p>
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="flex items-start"
                                    whileHover={{ x: 5 }}
                                >
                                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-neon-pink/10 mr-4">
                                        <Trophy className="h-6 w-6 text-neon-pink" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg">Contributions</h3>
                                        <p className="text-muted-foreground">50 points for helping organize events</p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <Footer />
        </div>
    );
};

export default LeaderboardPage; 