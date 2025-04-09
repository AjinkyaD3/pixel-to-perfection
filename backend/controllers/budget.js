const Budget = require('../models/Budget');
const Event = require('../models/Event');
const { ErrorResponse } = require('../utils/errorResponse');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');

/**
 * @desc    Get all budgets
 * @route   GET /api/budgets
 * @access  Private (Admin, Committee)
 */
exports.getBudgets = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    // Add filters if provided
    if (status) query.status = status;
    
    // Count documents
    const total = await Budget.countDocuments(query);
    
    // Execute query with pagination
    const budgets = await Budget.find(query)
      .populate('eventId', 'title date type')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    // If search is provided, filter events by title
    if (search) {
      const events = await Event.find({
        title: { $regex: search, $options: 'i' },
        isActive: true
      }).select('_id');
      
      const eventIds = events.map(event => event._id);
      
      const filteredBudgets = await Budget.find({
        ...query,
        eventId: { $in: eventIds }
      })
        .populate('eventId', 'title date type')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      
      return res.status(200).json({
        success: true,
        count: filteredBudgets.length,
        total: await Budget.countDocuments({ ...query, eventId: { $in: eventIds } }),
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        data: filteredBudgets
      });
    }
    
    res.status(200).json({
      success: true,
      count: budgets.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: budgets
    });
  } catch (error) {
    logger.error(`Error retrieving budgets: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

/**
 * @desc    Get single budget
 * @route   GET /api/budgets/:id
 * @access  Private (Admin, Committee)
 */
exports.getBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, isActive: true })
      .populate('eventId', 'title date type venue status')
      .populate('createdBy', 'name email')
      .populate('expenses.paidBy', 'name email');
    
    if (!budget) {
      return next(new ErrorResponse(`Budget not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (error) {
    logger.error(`Error retrieving budget: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

/**
 * @desc    Create budget
 * @route   POST /api/budgets
 * @access  Private (Admin, Committee)
 */
exports.createBudget = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse('Validation error', 400, errors.array()));
    }
    
    // Check if event exists
    const event = await Event.findById(req.body.eventId);
    
    if (!event) {
      return next(new ErrorResponse(`Event not found with id of ${req.body.eventId}`, 404));
    }
    
    // Check if budget already exists for this event
    const existingBudget = await Budget.findOne({ eventId: req.body.eventId, isActive: true });
    
    if (existingBudget) {
      return next(new ErrorResponse(`Budget already exists for this event`, 400));
    }
    
    // Create budget
    const budget = await Budget.create({
      ...req.body,
      createdBy: req.user.id
    });
    
    // Update event with budget reference
    event.budget = budget._id;
    await event.save();
    
    res.status(201).json({
      success: true,
      data: budget
    });
  } catch (error) {
    logger.error(`Error creating budget: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

/**
 * @desc    Update budget
 * @route   PUT /api/budgets/:id
 * @access  Private (Admin, Committee)
 */
exports.updateBudget = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse('Validation error', 400, errors.array()));
    }
    
    let budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return next(new ErrorResponse(`Budget not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is authorized to update (admin or the creator)
    if (req.user.role !== 'admin' && budget.createdBy.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update this budget', 403));
    }
    
    // Update budget
    budget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (error) {
    logger.error(`Error updating budget: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

/**
 * @desc    Delete budget
 * @route   DELETE /api/budgets/:id
 * @access  Private (Admin)
 */
exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return next(new ErrorResponse(`Budget not found with id of ${req.params.id}`, 404));
    }
    
    // Only admin can delete budgets
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this budget', 403));
    }
    
    // Soft delete (set isActive to false)
    budget.isActive = false;
    await budget.save();
    
    // Remove reference from event
    const event = await Event.findById(budget.eventId);
    if (event) {
      event.budget = undefined;
      await event.save();
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Error deleting budget: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

/**
 * @desc    Add expense to budget
 * @route   POST /api/budgets/:id/expenses
 * @access  Private (Admin, Committee)
 */
exports.addExpense = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse('Validation error', 400, errors.array()));
    }
    
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return next(new ErrorResponse(`Budget not found with id of ${req.params.id}`, 404));
    }
    
    // Extract and validate required expense fields
    const { category, amount, description, receipt, date } = req.body;
    
    if (!category || !amount || !description || !receipt) {
      return next(new ErrorResponse('Please provide all required expense fields: category, amount, description, and receipt', 400));
    }
    
    // Validate category is among allowed values
    const allowedCategories = ['venue', 'food', 'transportation', 'materials', 'marketing', 'speaker', 'other'];
    if (!allowedCategories.includes(category)) {
      return next(new ErrorResponse(`Category must be one of: ${allowedCategories.join(', ')}`, 400));
    }
    
    // Add expense to budget
    budget.expenses.push({
      category,
      amount,
      description,
      receipt,
      date: date || new Date(),
      paidBy: req.user.id,
      status: 'pending'
    });
    
    await budget.save();
    
    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (error) {
    logger.error(`Error adding expense: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

/**
 * @desc    Update expense status
 * @route   PUT /api/budgets/:id/expenses/:expenseId
 * @access  Private (Admin)
 */
exports.updateExpenseStatus = async (req, res, next) => {
  try {
    // Only admin can approve/reject expenses
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update expense status', 403));
    }
    
    const { status, notes } = req.body;
    
    if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
      return next(new ErrorResponse('Invalid status value', 400));
    }
    
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return next(new ErrorResponse(`Budget not found with id of ${req.params.id}`, 404));
    }
    
    // Find expense
    const expense = budget.expenses.id(req.params.expenseId);
    
    if (!expense) {
      return next(new ErrorResponse(`Expense not found with id of ${req.params.expenseId}`, 404));
    }
    
    // Update expense status
    expense.status = status;
    if (notes) expense.notes = notes;
    
    await budget.save();
    
    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (error) {
    logger.error(`Error updating expense status: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

/**
 * @desc    Delete expense
 * @route   DELETE /api/budgets/:id/expenses/:expenseId
 * @access  Private (Admin, Committee)
 */
exports.deleteExpense = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return next(new ErrorResponse(`Budget not found with id of ${req.params.id}`, 404));
    }
    
    // Find expense
    const expense = budget.expenses.id(req.params.expenseId);
    
    if (!expense) {
      return next(new ErrorResponse(`Expense not found with id of ${req.params.expenseId}`, 404));
    }
    
    // Check if user is authorized to delete (admin, the budget creator, or the expense payer)
    if (
      req.user.role !== 'admin' && 
      budget.createdBy.toString() !== req.user.id && 
      expense.paidBy.toString() !== req.user.id
    ) {
      return next(new ErrorResponse('Not authorized to delete this expense', 403));
    }
    
    // Remove expense
    expense.remove();
    await budget.save();
    
    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (error) {
    logger.error(`Error deleting expense: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

/**
 * @desc    Get budget analytics
 * @route   GET /api/budgets/analytics
 * @access  Private (Admin)
 */
exports.getBudgetAnalytics = async (req, res, next) => {
  try {
    // Get total budget amount
    const totalBudget = await Budget.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    // Get total spent amount
    const totalSpent = await Budget.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$spentAmount' } } }
    ]);
    
    // Get expense breakdown by category
    const expensesByCategory = await Budget.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$expenses' },
      { $match: { 'expenses.status': 'approved' } },
      { $group: { _id: '$expenses.category', total: { $sum: '$expenses.amount' } } },
      { $sort: { total: -1 } }
    ]);
    
    // Get monthly expenses for the past year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const monthlyExpenses = await Budget.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$expenses' },
      { $match: { 'expenses.status': 'approved', 'expenses.date': { $gte: oneYearAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$expenses.date' } },
          total: { $sum: '$expenses.amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get budget allocation by event type
    const budgetByEventType = await Budget.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: '_id',
          as: 'event'
        }
      },
      { $unwind: '$event' },
      { $group: { _id: '$event.type', total: { $sum: '$totalAmount' } } },
      { $sort: { total: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalBudget: totalBudget.length > 0 ? totalBudget[0].total : 0,
        totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
        utilizationRate: totalBudget.length > 0 && totalBudget[0].total > 0 
          ? (totalSpent[0].total / totalBudget[0].total * 100).toFixed(2) 
          : 0,
        expensesByCategory,
        monthlyExpenses,
        budgetByEventType
      }
    });
  } catch (error) {
    logger.error(`Error getting budget analytics: ${error.message}`, { stack: error.stack });
    next(error);
  }
}; 