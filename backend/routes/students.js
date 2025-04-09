const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { 
  getStudents, 
  getStudent, 
  createStudent, 
  updateStudent, 
  deleteStudent,
  uploadStudents
} = require('../controllers/students');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply rate limiting to all student routes
const studentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

router.use(studentLimiter);

// Get all students and create a student
router.route('/')
  .get(protect, getStudents)
  .post(
    protect, 
    authorize('admin', 'committee'),
    [
      body('name').notEmpty().withMessage('Name is required'),
      body('rollNo').notEmpty().withMessage('Roll Number is required'),
      body('division').notEmpty().withMessage('Division is required'),
      body('year').notEmpty().withMessage('Year is required'),
      body('email').isEmail().withMessage('Please include a valid email')
    ],
    createStudent
  );

// Upload multiple students via CSV
router.post(
  '/upload',
  protect,
  authorize('admin'),
  uploadStudents
);

// Get, update and delete student
router.route('/:id')
  .get(protect, getStudent)
  .put(
    protect,
    authorize('admin', 'committee'),
    [
      body('name').optional(),
      body('rollNo').optional(),
      body('division').optional(),
      body('year').optional(),
      body('email').optional().isEmail().withMessage('Please include a valid email'),
      body('skills').optional().isArray().withMessage('Skills must be an array')
    ],
    updateStudent
  )
  .delete(
    protect,
    authorize('admin'),
    deleteStudent
  );

module.exports = router; 