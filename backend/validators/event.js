const { body } = require('express-validator');

const createEventValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Event type is required')
    .isIn(['workshop', 'seminar', 'competition', 'hackathon', 'other'])
    .withMessage('Invalid event type'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const eventDate = new Date(value);
      const today = new Date();
      if (eventDate < today) {
        throw new Error('Event date cannot be in the past');
      }
      return true;
    }),
  
  body('time')
    .trim()
    .notEmpty()
    .withMessage('Time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format (HH:mm)'),
  
  body('venue')
    .trim()
    .notEmpty()
    .withMessage('Venue is required'),
  
  body('speaker')
    .optional()
    .isObject()
    .withMessage('Speaker must be an object')
    .custom((value) => {
      if (!value.name) {
        throw new Error('Speaker name is required');
      }
      return true;
    }),
  
  body('maxCapacity')
    .notEmpty()
    .withMessage('Maximum capacity is required')
    .isInt({ min: 1 })
    .withMessage('Maximum capacity must be at least 1'),
  
  body('budget')
    .optional()
    .isMongoId()
    .withMessage('Invalid budget ID')
];

const updateEventValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('type')
    .optional()
    .trim()
    .isIn(['workshop', 'seminar', 'competition', 'hackathon', 'other'])
    .withMessage('Invalid event type'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const eventDate = new Date(value);
      const today = new Date();
      if (eventDate < today) {
        throw new Error('Event date cannot be in the past');
      }
      return true;
    }),
  
  body('time')
    .optional()
    .trim()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format (HH:mm)'),
  
  body('venue')
    .optional()
    .trim(),
  
  body('speaker')
    .optional()
    .isObject()
    .withMessage('Speaker must be an object')
    .custom((value) => {
      if (value && !value.name) {
        throw new Error('Speaker name is required');
      }
      return true;
    }),
  
  body('maxCapacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Maximum capacity must be at least 1'),
  
  body('status')
    .optional()
    .isIn(['upcoming', 'ongoing', 'completed', 'cancelled'])
    .withMessage('Invalid event status')
];

const uploadPosterValidation = [
  body()
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error('Poster image is required');
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new Error('File must be JPEG, PNG, or WebP');
      }
      if (req.file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('File size must not exceed 5MB');
      }
      return true;
    })
];

module.exports = {
  createEventValidation,
  updateEventValidation,
  uploadPosterValidation
}; 