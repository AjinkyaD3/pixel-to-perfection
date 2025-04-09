const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { generalLimiter } = require('../middleware/rateLimiter');
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  uploadStudents,
  getStudentAnalytics,
  exportStudents
} = require('../controllers/students');

// Apply rate limiting to all routes
router.use(generalLimiter);

// Get all students
router.get('/', getStudents);

// Get single student
router.get('/:id', getStudent);

// Create student (protected route)
router.post(
  '/',
  [
    protect,
    authorize('admin', 'committee'),
    [
      check('rollNumber', 'Roll number is required').notEmpty(),
      check('name', 'Name is required').notEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('year', 'Year is required').notEmpty(),
      check('division', 'Division is required').notEmpty()
    ],
    validateRequest
  ],
  createStudent
);

// Update student (protected route)
router.put(
  '/:id',
  [
    protect,
    authorize('admin', 'committee'),
    [
      check('rollNumber', 'Roll number is required').notEmpty(),
      check('name', 'Name is required').notEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('year', 'Year is required').notEmpty(),
      check('division', 'Division is required').notEmpty()
    ],
    validateRequest
  ],
  updateStudent
);

// Delete student (protected route)
router.delete(
  '/:id',
  [
    protect,
    authorize('admin', 'committee')
  ],
  deleteStudent
);

// Upload students via CSV (protected route)
router.post(
  '/upload',
  [
    protect,
    authorize('admin', 'committee'),
    [
      check('file', 'File is required').notEmpty()
    ],
    validateRequest
  ],
  uploadStudents
);

// Get student analytics (protected route)
router.get(
  '/analytics',
  [
    protect,
    authorize('admin', 'committee')
  ],
  getStudentAnalytics
);

// Export students to Excel (protected route)
router.get(
  '/export',
  [
    protect,
    authorize('admin', 'committee')
  ],
  exportStudents
);

module.exports = router; 