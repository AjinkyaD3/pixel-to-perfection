import React from 'react';
import { Calendar, Zap, Users, Share2, Award } from 'lucide-react';
import { PointsActivity as PointsActivityType } from '@/types';

interface PointsActivityProps {
    activities: PointsActivityType[];
}

const PointsActivity: React.FC<PointsActivityProps> = ({ activities }) => {
    if (!activities || activities.length === 0) {
        return (
            <div className="text-center py-4 text-muted-foreground">
                No recent activities found.
            </div>
        );
    }
    
    // Get the category icon
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'event':
                return <Calendar className="h-4 w-4" />;
            case 'contribution':
                return <Users className="h-4 w-4" />;
            case 'social':
                return <Share2 className="h-4 w-4" />;
            case 'registration':
                return <Award className="h-4 w-4" />;
            default:
                return <Zap className="h-4 w-4" />;
        }
    };

    // Get the category color
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'event':
                return 'bg-blue-500/10 text-blue-500';
            case 'contribution':
                return 'bg-purple-500/10 text-purple-500';
            case 'social':
                return 'bg-green-500/10 text-green-500';
            case 'registration':
                return 'bg-amber-500/10 text-amber-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    };

    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg bg-background/50 border border-border/30 hover:bg-background/80 transition-colors">
                    <div className={`flex-shrink-0 rounded-full p-2 ${getCategoryColor(activity.category)}`}>
                        {getCategoryIcon(activity.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-muted-foreground">
                            {new Date(activity.createdAt).toLocaleDateString()} · {activity.category}
                        </p>
                    </div>
                    <div className="flex-shrink-0 font-semibold text-right">
                        +{activity.points} <span className="text-sm text-muted-foreground">pts</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PointsActivity; 