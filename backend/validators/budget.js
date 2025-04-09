const { body } = require('express-validator');

const createBudgetValidation = [
  body('eventId')
    .notEmpty()
    .withMessage('Event ID is required')
    .isMongoId()
    .withMessage('Invalid event ID'),
  
  body('totalAmount')
    .notEmpty()
    .withMessage('Total amount is required')
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
  
  body('expenses')
    .optional()
    .isArray()
    .withMessage('Expenses must be an array'),
  
  body('expenses.*.category')
    .if(body('expenses').exists())
    .notEmpty()
    .withMessage('Expense category is required')
    .isIn(['venue', 'food', 'equipment', 'marketing', 'prizes', 'transport', 'other'])
    .withMessage('Invalid expense category'),
  
  body('expenses.*.amount')
    .if(body('expenses').exists())
    .notEmpty()
    .withMessage('Expense amount is required')
    .isFloat({ min: 0 })
    .withMessage('Expense amount must be a positive number'),
  
  body('expenses.*.description')
    .if(body('expenses').exists())
    .notEmpty()
    .withMessage('Expense description is required')
    .trim(),
  
  body('expenses.*.date')
    .if(body('expenses').exists())
    .notEmpty()
    .withMessage('Expense date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('expenses.*.paidBy')
    .if(body('expenses').exists())
    .notEmpty()
    .withMessage('Paid by is required')
    .isMongoId()
    .withMessage('Invalid user ID'),
  
  body('expenses.*.receipt')
    .if(body('expenses').exists())
    .optional()
    .isURL()
    .withMessage('Invalid receipt URL'),
  
  body('expenses.*.status')
    .if(body('expenses').exists())
    .optional()
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Invalid expense status')
];

const updateBudgetValidation = [
  body('totalAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
  
  body('expenses')
    .optional()
    .isArray()
    .withMessage('Expenses must be an array'),
  
  body('expenses.*.category')
    .if(body('expenses').exists())
    .notEmpty()
    .withMessage('Expense category is required')
    .isIn(['venue', 'food', 'equipment', 'marketing', 'prizes', 'transport', 'other'])
    .withMessage('Invalid expense category'),
  
  body('expenses.*.amount')
    .if(body('expenses').exists())
    .notEmpty()
    .withMessage('Expense amount is required')
    .isFloat({ min: 0 })
    .withMessage('Expense amount must be a positive number'),
  
  body('expenses.*.description')
    .if(body('expenses').exists())
    .notEmpty()
    .withMessage('Expense description is required')
    .trim(),
  
  body('expenses.*.date')
    .if(body('expenses').exists())
    .notEmpty()
    .withMessage('Expense date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('expenses.*.paidBy')
    .if(body('expenses').exists())
    .notEmpty()
    .withMessage('Paid by is required')
    .isMongoId()
    .withMessage('Invalid user ID'),
  
  body('expenses.*.receipt')
    .if(body('expenses').exists())
    .optional()
    .isURL()
    .withMessage('Invalid receipt URL'),
  
  body('expenses.*.status')
    .if(body('expenses').exists())
    .optional()
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Invalid expense status'),
  
  body('status')
    .optional()
    .isIn(['active', 'closed'])
    .withMessage('Invalid budget status')
];

module.exports = {
  createBudgetValidation,
  updateBudgetValidation
}; 