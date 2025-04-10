const User = require('../models/User');
const { ErrorResponse } = require('../utils/errorResponse');

// Badge definitions
const badges = [
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

// @desc    Get leaderboard
// @route   GET /api/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res, next) => {
    try {
        const { limit = 10 } = req.query;
        
        // Get users sorted by points in descending order
        const users = await User.find({ 
            isActive: true, 
            points: { $gt: 0 } 
        })
        .select('name email profilePicture points eventAttendance socialShares contributions earlyRegistrations')
        .sort({ points: -1 })
        .limit(parseInt(limit, 10));

        // Transform users into leaderboard entries with ranks and badges
        const leaderboard = users.map((user, index) => {
            // Determine which badges the user has earned based on points
            const earnedBadges = badges.filter(badge => user.points >= badge.requiredPoints);
            
            return {
                id: user._id,
                userId: user._id,
                name: user.name,
                avatar: user.profilePicture || '', 
                points: user.points || 0,
                rank: index + 1,
                badges: earnedBadges,
                eventsAttended: user.eventAttendance || 0,
                socialShares: user.socialShares || 0,
                contributions: user.contributions || 0,
                earlyRegistrations: user.earlyRegistrations || 0
            };
        });

        res.status(200).json({
            success: true,
            count: leaderboard.length,
            data: leaderboard
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get available badges
// @route   GET /api/leaderboard/badges
// @access  Public
exports.getBadges = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            count: badges.length,
            data: badges
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user stats and ranking
// @route   GET /api/leaderboard/me
// @access  Private
exports.getMyRanking = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        // Get current user
        const user = await User.findById(userId);
        
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }
        
        // Find user's rank
        const betterRankedUsers = await User.countDocuments({
            points: { $gt: user.points }
        });
        
        // Determine which badges the user has earned
        const earnedBadges = badges.filter(badge => user.points >= badge.requiredPoints);
        
        const userRanking = {
            id: user._id,
            userId: user._id,
            name: user.name,
            avatar: user.profilePicture || '',
            points: user.points || 0,
            rank: betterRankedUsers + 1,
            badges: earnedBadges,
            eventsAttended: user.eventAttendance || 0,
            socialShares: user.socialShares || 0,
            contributions: user.contributions || 0,
            earlyRegistrations: user.earlyRegistrations || 0
        };
        
        res.status(200).json({
            success: true,
            data: userRanking
        });
    } catch (error) {
        next(error);
    }
}; 