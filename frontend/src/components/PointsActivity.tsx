import React from 'react';
import { Calendar, Share2, Trophy, Zap } from 'lucide-react';
import { PointsActivity as PointsActivityType } from '@/types';
import { motion } from 'framer-motion';

interface PointsActivityProps {
    activities: PointsActivityType[];
}

const PointsActivity: React.FC<PointsActivityProps> = ({ activities }) => {
    const getActivityIcon = (category: string) => {
        switch (category) {
            case 'event':
                return <Calendar className="h-4 w-4 text-neon-blue" />;
            case 'registration':
                return <Zap className="h-4 w-4 text-neon-green" />;
            case 'social':
                return <Share2 className="h-4 w-4 text-neon-purple" />;
            case 'contribution':
                return <Trophy className="h-4 w-4 text-neon-pink" />;
            default:
                return <Zap className="h-4 w-4 text-neon-blue" />;
        }
    };

    return (
        <div className="space-y-3">
            {activities.map((activity, index) => (
                <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30"
                >
                    <div className="flex items-center">
                        <div className="mr-3 p-2 rounded-full bg-background">
                            {getActivityIcon(activity.category)}
                        </div>
                        <div>
                            <p className="text-sm font-medium">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(activity.createdAt).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center text-neon-blue font-medium">
                        +{activity.points} <Zap className="h-3 w-3 ml-1" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default PointsActivity; 