const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { generalLimiter } = require('../middleware/rateLimiter');
const {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  addExpense,
  updateExpense,
  deleteExpense,
  approveExpense,
  getBudgetAnalytics,
  exportBudget
} = require('../controllers/budgets');

// Apply rate limiting to all routes
router.use(generalLimiter);

// Get all budgets
router.get('/', getBudgets);

// Get single budget
router.get('/:id', getBudget);

// Create budget (protected route)
router.post(
  '/',
  [
    protect,
    authorize('admin', 'committee'),
    [
      check('eventId', 'Event ID is required').notEmpty(),
      check('totalAmount', 'Total amount is required').isNumeric(),
      check('expenses', 'Expenses array is required').isArray()
    ],
    validateRequest
  ],
  createBudget
);

// Update budget (protected route)
router.put(
  '/:id',
  [
    protect,
    authorize('admin', 'committee'),
    [
      check('totalAmount', 'Total amount is required').isNumeric()
    ],
    validateRequest
  ],
  updateBudget
);

// Delete budget (protected route)
router.delete(
  '/:id',
  [
    protect,
    authorize('admin', 'committee')
  ],
  deleteBudget
);

// Add expense (protected route)
router.post(
  '/:id/expenses',
  [
    protect,
    authorize('admin', 'committee'),
    [
      check('category', 'Category is required').notEmpty(),
      check('amount', 'Amount is required').isNumeric(),
      check('description', 'Description is required').notEmpty(),
      check('date', 'Date is required').notEmpty(),
      check('receipt', 'Receipt is required').notEmpty()
    ],
    validateRequest
  ],
  addExpense
);

// Update expense (protected route)
router.put(
  '/:id/expenses/:expenseId',
  [
    protect,
    authorize('admin', 'committee'),
    [
      check('category', 'Category is required').notEmpty(),
      check('amount', 'Amount is required').isNumeric(),
      check('description', 'Description is required').notEmpty(),
      check('date', 'Date is required').notEmpty(),
      check('receipt', 'Receipt is required').notEmpty()
    ],
    validateRequest
  ],
  updateExpense
);

// Delete expense (protected route)
router.delete(
  '/:id/expenses/:expenseId',
  [
    protect,
    authorize('admin', 'committee')
  ],
  deleteExpense
);

// Approve expense (protected route)
router.put(
  '/:id/expenses/:expenseId/approve',
  [
    protect,
    authorize('admin', 'committee')
  ],
  approveExpense
);

// Get budget analytics (protected route)
router.get(
  '/analytics',
  [
    protect,
    authorize('admin', 'committee')
  ],
  getBudgetAnalytics
);

// Export budget to PDF (protected route)
router.get(
  '/:id/export',
  [
    protect,
    authorize('admin', 'committee')
  ],
  exportBudget
);

module.exports = router; 