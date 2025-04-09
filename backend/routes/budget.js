const express = require('express');
const { check } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Import controllers
const {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  addExpense,
  updateExpenseStatus,
  deleteExpense,
  getBudgetAnalytics
} = require('../controllers/budget');

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Create router
const router = express.Router();

// Apply rate limiting to all budget routes
const budgetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

router.use(budgetLimiter);

// Get all budgets and create a new budget
router
  .route('/')
  .get(protect, authorize('admin', 'committee'), getBudgets)
  .post(
    protect,
    authorize('admin', 'committee'),
    [
      check('eventId', 'Event ID is required').not().isEmpty(),
      check('totalAmount', 'Total budget amount is required').isNumeric()
    ],
    createBudget
  );

// Get budget analytics
router.get(
  '/analytics',
  protect,
  authorize('admin'),
  getBudgetAnalytics
);

// Get, update, and delete single budget
router
  .route('/:id')
  .get(protect, authorize('admin', 'committee'), getBudget)
  .put(
    protect,
    authorize('admin', 'committee'),
    [
      check('totalAmount', 'Total amount must be a number').optional().isNumeric(),
      check('status', 'Status must be valid').optional().isIn(['active', 'completed', 'cancelled'])
    ],
    updateBudget
  )
  .delete(protect, authorize('admin'), deleteBudget);

// Add expense to budget
router.post(
  '/:id/expenses',
  protect,
  authorize('admin', 'committee'),
  [
    check('category', 'Category is required').not().isEmpty(),
    check('amount', 'Amount is required and must be a number').isNumeric(),
    check('description', 'Description is required').not().isEmpty()
  ],
  addExpense
);

// Update expense status
router.put(
  '/:id/expenses/:expenseId',
  protect,
  authorize('admin'),
  [
    check('status', 'Status is required and must be valid').isIn(['approved', 'rejected', 'pending'])
  ],
  updateExpenseStatus
);

// Delete expense
router.delete(
  '/:id/expenses/:expenseId',
  protect,
  authorize('admin', 'committee'),
  deleteExpense
);

module.exports = router; 