const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { generalLimiter } = require('../middleware/rateLimiter');
const {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  pinAnnouncement,
  getAnnouncementAnalytics
} = require('../controllers/announcements');

// Apply rate limiting to all routes
router.use(generalLimiter);

// Get all announcements
router.get('/', getAnnouncements);

// Get single announcement
router.get('/:id', getAnnouncement);

// Create announcement (protected route)
router.post(
  '/',
  [
    protect,
    authorize('admin', 'committee'),
    [
      check('title', 'Title is required').notEmpty(),
      check('content', 'Content is required').notEmpty(),
      check('type', 'Type is required').notEmpty(),
      check('targetAudience', 'Target audience is required').notEmpty()
    ],
    validateRequest
  ],
  createAnnouncement
);

// Update announcement (protected route)
router.put(
  '/:id',
  [
    protect,
    authorize('admin', 'committee'),
    [
      check('title', 'Title is required').notEmpty(),
      check('content', 'Content is required').notEmpty(),
      check('type', 'Type is required').notEmpty(),
      check('targetAudience', 'Target audience is required').notEmpty()
    ],
    validateRequest
  ],
  updateAnnouncement
);

// Delete announcement (protected route)
router.delete(
  '/:id',
  [
    protect,
    authorize('admin', 'committee')
  ],
  deleteAnnouncement
);

// Pin/unpin announcement (protected route)
router.put(
  '/:id/pin',
  [
    protect,
    authorize('admin', 'committee')
  ],
  pinAnnouncement
);

// Get announcement analytics (protected route)
router.get(
  '/analytics',
  [
    protect,
    authorize('admin', 'committee')
  ],
  getAnnouncementAnalytics
);

module.exports = router; 