const { body } = require('express-validator');

const createAnnouncementValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters'),
  
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Announcement type is required')
    .isIn(['info', 'deadline', 'critical'])
    .withMessage('Invalid announcement type'),
  
  body('targetAudience')
    .trim()
    .notEmpty()
    .withMessage('Target audience is required')
    .isIn(['all', 'students', 'committee', 'admin'])
    .withMessage('Invalid target audience'),
  
  body('year')
    .trim()
    .notEmpty()
    .withMessage('Year is required')
    .isIn(['all', 'FE', 'SE', 'TE', 'BE'])
    .withMessage('Invalid year'),
  
  body('division')
    .trim()
    .notEmpty()
    .withMessage('Division is required')
    .isIn(['all', 'A', 'B', 'C'])
    .withMessage('Invalid division'),
  
  body('pinned')
    .optional()
    .isBoolean()
    .withMessage('Pinned must be a boolean'),
  
  body('attachments')
    .optional()
    .isArray()
    .withMessage('Attachments must be an array'),
  
  body('attachments.*.name')
    .if(body('attachments').exists())
    .notEmpty()
    .withMessage('Attachment name is required')
    .trim(),
  
  body('attachments.*.url')
    .if(body('attachments').exists())
    .notEmpty()
    .withMessage('Attachment URL is required')
    .isURL()
    .withMessage('Invalid attachment URL'),
  
  body('attachments.*.type')
    .if(body('attachments').exists())
    .notEmpty()
    .withMessage('Attachment type is required')
    .isIn(['pdf', 'doc', 'image', 'other'])
    .withMessage('Invalid attachment type')
];

const updateAnnouncementValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('message')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters'),
  
  body('type')
    .optional()
    .trim()
    .isIn(['info', 'deadline', 'critical'])
    .withMessage('Invalid announcement type'),
  
  body('targetAudience')
    .optional()
    .trim()
    .isIn(['all', 'students', 'committee', 'admin'])
    .withMessage('Invalid target audience'),
  
  body('year')
    .optional()
    .trim()
    .isIn(['all', 'FE', 'SE', 'TE', 'BE'])
    .withMessage('Invalid year'),
  
  body('division')
    .optional()
    .trim()
    .isIn(['all', 'A', 'B', 'C'])
    .withMessage('Invalid division'),
  
  body('pinned')
    .optional()
    .isBoolean()
    .withMessage('Pinned must be a boolean'),
  
  body('status')
    .optional()
    .isIn(['active', 'archived'])
    .withMessage('Invalid status'),
  
  body('attachments')
    .optional()
    .isArray()
    .withMessage('Attachments must be an array'),
  
  body('attachments.*.name')
    .if(body('attachments').exists())
    .notEmpty()
    .withMessage('Attachment name is required')
    .trim(),
  
  body('attachments.*.url')
    .if(body('attachments').exists())
    .notEmpty()
    .withMessage('Attachment URL is required')
    .isURL()
    .withMessage('Invalid attachment URL'),
  
  body('attachments.*.type')
    .if(body('attachments').exists())
    .notEmpty()
    .withMessage('Attachment type is required')
    .isIn(['pdf', 'doc', 'image', 'other'])
    .withMessage('Invalid attachment type')
];

module.exports = {
  createAnnouncementValidation,
  updateAnnouncementValidation
}; 