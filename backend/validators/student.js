const { body } = require('express-validator');

exports.createStudentValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('rollNo')
    .trim()
    .notEmpty()
    .withMessage('Roll number is required')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Roll number must contain only uppercase letters and numbers'),
  
  body('division')
    .trim()
    .notEmpty()
    .withMessage('Division is required')
    .isIn(['A', 'B', 'C'])
    .withMessage('Invalid division'),
  
  body('year')
    .trim()
    .notEmpty()
    .withMessage('Year is required')
    .isIn(['FE', 'SE', 'TE', 'BE'])
    .withMessage('Invalid year'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  body('skills.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Skill cannot be empty'),
];

exports.updateStudentValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('division')
    .optional()
    .trim()
    .isIn(['A', 'B', 'C'])
    .withMessage('Invalid division'),
  
  body('year')
    .optional()
    .trim()
    .isIn(['FE', 'SE', 'TE', 'BE'])
    .withMessage('Invalid year'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  body('skills.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Skill cannot be empty'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
];

exports.uploadCsvValidation = [
  body('file')
    .custom((value, { req }) => {
      if (!req.files || !req.files.file) {
        throw new Error('CSV file is required');
      }
      
      const file = req.files.file;
      const allowedMimeTypes = ['text/csv', 'application/vnd.ms-excel'];
      
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new Error('Only CSV files are allowed');
      }
      
      return true;
    }),
];

module.exports = {
  createStudentValidation,
  updateStudentValidation,
  uploadCsvValidation
}; 