const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { generalLimiter } = require('../middleware/rateLimiter');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  checkInEvent,
  generateQRCode,
  getEventAnalytics
} = require('../controllers/events');

// Apply rate limiting to all routes
router.use(generalLimiter);

// Get all events
router.get('/', getEvents);

// Get single event
router.get('/:id', getEvent);

// Create event (protected route)
router.post(
  '/',
  [
    protect,
    authorize('admin', 'committee'),
    [
      check('title', 'Title is required').notEmpty(),
      check('type', 'Type is required').notEmpty(),
      check('description', 'Description is required').notEmpty(),
      check('date', 'Date is required').notEmpty(),
      check('time', 'Time is required').notEmpty(),
      check('venue', 'Venue is required').notEmpty(),
      check('maxCapacity', 'Maximum capacity is required').isNumeric(),
      check('speaker.name', 'Speaker name is required').notEmpty()
    ],
    validateRequest
  ],
  createEvent
);

// Update event (protected route)
router.put(
  '/:id',
  [
    protect,
    authorize('admin', 'committee'),
    [
      check('title', 'Title is required').notEmpty(),
      check('type', 'Type is required').notEmpty(),
      check('description', 'Description is required').notEmpty(),
      check('date', 'Date is required').notEmpty(),
      check('time', 'Time is required').notEmpty(),
      check('venue', 'Venue is required').notEmpty(),
      check('maxCapacity', 'Maximum capacity is required').isNumeric(),
      check('speaker.name', 'Speaker name is required').notEmpty()
    ],
    validateRequest
  ],
  updateEvent
);

// Delete event (protected route)
router.delete(
  '/:id',
  [
    protect,
    authorize('admin', 'committee')
  ],
  deleteEvent
);

// Register for event
router.post(
  '/:id/register',
  [
    protect,
    authorize('student')
  ],
  registerForEvent
);

// Check-in for event
router.post(
  '/:id/checkin',
  [
    protect,
    authorize('committee')
  ],
  checkInEvent
);

// Generate QR code for event (protected route)
router.get(
  '/:id/qrcode',
  [
    protect,
    authorize('admin', 'committee')
  ],
  generateQRCode
);

// Get event analytics (protected route)
router.get(
  '/analytics',
  [
    protect,
    authorize('admin', 'committee')
  ],
  getEventAnalytics
);

module.exports = router; 