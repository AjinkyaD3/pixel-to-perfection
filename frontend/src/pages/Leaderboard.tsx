import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Star, Share2, Calendar, Zap, Loader2 } from 'lucide-react';
import ThreeDBackground from '@/components/ThreeDBackground';
import { leaderboardService } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import type { LeaderboardEntry, Badge as BadgeType } from '@/types';

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
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [badges, setBadges] = useState<BadgeType[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                setLoading(true);
                
                // Fetch leaderboard data from API
                const leaderboardResponse = await leaderboardService.getLeaderboard({ limit: 10 });
                setLeaderboard(leaderboardResponse.data);
                
                // Fetch badges from API
                const badgesResponse = await leaderboardService.getBadges();
                setBadges(badgesResponse.data);
                
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load leaderboard data',
                    variant: 'destructive'
                });
            } finally {
                setLoading(false);
            }
        };
        
        fetchLeaderboardData();
    }, [toast]);

    if (loading) {
        return (
            <div className="relative min-h-screen">
                <ThreeDBackground />
                <Navbar />
                <div className="relative z-10 container mx-auto py-24 flex justify-center items-center">
                    <div className="text-center">
                        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
                        <p className="text-xl font-medium">Loading leaderboard data...</p>
                    </div>
                </div>
            </div>
        );
    }

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
                            {leaderboard.slice(0, 3).map((entry, index) => (
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

                        {/* Rest of Leaderboard */}
                        <Card className="backdrop-blur-sm bg-background/60 border-border/50">
                            <CardHeader>
                                <CardTitle>Leaderboard Standings</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-border/30">
                                                <th className="px-4 py-3 text-left">Rank</th>
                                                <th className="px-4 py-3 text-left">Member</th>
                                                <th className="px-4 py-3 text-left">Badges</th>
                                                <th className="px-4 py-3 text-right">Points</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leaderboard.map((entry) => (
                                                <tr key={entry.id} className="border-b border-border/30">
                                                    <td className="px-4 py-3">{entry.rank}</td>
                                                    <td className="px-4 py-3">{entry.name}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex -space-x-1">
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
                                                    </td>
                                                    <td className="px-4 py-3 text-right">{entry.points} pts</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="badges" className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {badges.map((badge, index) => (
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