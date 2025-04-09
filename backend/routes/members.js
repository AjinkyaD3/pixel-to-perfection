const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { generalLimiter } = require('../middleware/rateLimiter');
const {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  uploadMembers
} = require('../controllers/members');

// Apply rate limiting to all routes
router.use(generalLimiter);

// Get all members
router.get('/', getMembers);

// Get single member
router.get('/:id', getMember);

// Create member (protected route)
router.post(
  '/',
  [
    protect,
    authorize('admin'),
    [
      check('name', 'Name is required').notEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('role', 'Role is required').notEmpty(),
      check('position', 'Position is required').notEmpty()
    ],
    validateRequest
  ],
  createMember
);

// Update member (protected route)
router.put(
  '/:id',
  [
    protect,
    authorize('admin'),
    [
      check('name', 'Name is required').notEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('role', 'Role is required').notEmpty(),
      check('position', 'Position is required').notEmpty()
    ],
    validateRequest
  ],
  updateMember
);

// Delete member (protected route)
router.delete(
  '/:id',
  [
    protect,
    authorize('admin')
  ],
  deleteMember
);

// Upload members via CSV (protected route)
router.post(
  '/upload',
  [
    protect,
    authorize('admin'),
    [
      check('file', 'File is required').notEmpty()
    ],
    validateRequest
  ],
  uploadMembers
);

module.exports = router; 