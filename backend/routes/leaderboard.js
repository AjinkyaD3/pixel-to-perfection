const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { generalLimiter } = require('../middleware/rateLimiter');

const {
  getLeaderboard,
  getBadges,
  getMyRanking
} = require('../controllers/leaderboard');

// Apply rate limiting to all routes
router.use(generalLimiter);

// Get leaderboard (public)
router.get('/', getLeaderboard);

// Get available badges (public)
router.get('/badges', getBadges);

// Get current user stats and ranking (protected)
router.get('/me', protect, getMyRanking);

module.exports = router; 