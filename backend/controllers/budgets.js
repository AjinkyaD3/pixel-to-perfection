const Budget = require('../models/Budget');
const Event = require('../models/Event');
const { ErrorResponse } = require('../utils/errorResponse');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');
const PDFDocument = require('pdfkit');

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Public
exports.getBudgets = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, eventId } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    // Add filters if provided
    if (status) query.status = status;
    if (eventId) query.eventId = eventId;
    
    // Count documents
    const total = await Budget.countDocuments(query);
    
    // Execute query with pagination
    const budgets = await Budget.find(query)
      .populate('eventId', 'title date venue')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
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

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Public
exports.getBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, isActive: true })
      .populate('eventId', 'title date time venue status')
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

// @desc    Create budget
// @route   POST /api/budgets
// @access  Private (Admin, Committee)
exports.createBudget = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse('Validation error', 400, errors.array()));
    }
    
    // Extract and validate required fields
    const { eventId, totalAmount, spentAmount, expenses, status } = req.body;
    
    if (!eventId || !totalAmount) {
      return next(new ErrorResponse('Please provide all required fields: eventId and totalAmount', 400));
    }
    
    // Validate status if provided
    if (status) {
      const validStatuses = ['active', 'closed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return next(new ErrorResponse(`Status must be one of: ${validStatuses.join(', ')}`, 400));
      }
    }
    
    // Check if event exists
    const event = await Event.findById(eventId);
    
    if (!event) {
      return next(new ErrorResponse(`Event not found with id of ${eventId}`, 404));
    }
    
    // Check if budget already exists for this event
    const existingBudget = await Budget.findOne({ eventId, isActive: true });
    
    if (existingBudget) {
      return next(new ErrorResponse(`Budget already exists for this event`, 400));
    }
    
    // Create budget with all required fields
    const budget = await Budget.create({
      eventId,
      totalAmount,
      spentAmount: spentAmount || 0,
      expenses: expenses || [],
      status: status || 'active',
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

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private (Admin, Committee)
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

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private (Admin, Committee)
exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return next(new ErrorResponse(`Budget not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is authorized to delete (admin or the creator)
    if (req.user.role !== 'admin' && budget.createdBy.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to delete this budget', 403));
    }
    
    // Soft delete (set isActive to false)
    budget.isActive = false;
    await budget.save();
    
    // Remove budget reference from event
    await Event.findByIdAndUpdate(
      budget.eventId,
      { $unset: { budget: 1 } }
    );
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Error deleting budget: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Add expense
// @route   POST /api/budgets/:id/expenses
// @access  Private (Admin, Committee)
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
    const { category, amount, description, date, receipt, notes } = req.body;
    
    if (!category || !amount || !description || !receipt) {
      return next(new ErrorResponse('Please provide all required expense fields: category, amount, description, and receipt', 400));
    }
    
    // Validate category is among allowed values
    const validCategories = ['venue', 'food', 'transportation', 'materials', 'marketing', 'speaker', 'other'];
    if (!validCategories.includes(category)) {
      return next(new ErrorResponse(`Category must be one of: ${validCategories.join(', ')}`, 400));
    }
    
    // Add expense to budget with all required fields
    budget.expenses.push({
      category,
      amount,
      description,
      date: date || new Date(),
      receipt,
      notes,
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

// @desc    Update expense
// @route   PUT /api/budgets/:id/expenses/:expenseId
// @access  Private (Admin, Committee)
exports.updateExpense = async (req, res, next) => {
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
    
    // Find expense
    const expenseIndex = budget.expenses.findIndex(
      expense => expense._id.toString() === req.params.expenseId
    );
    
    if (expenseIndex === -1) {
      return next(new ErrorResponse(`Expense not found with id of ${req.params.expenseId}`, 404));
    }
    
    // Check if user is authorized to update (admin or the creator)
    if (req.user.role !== 'admin' && 
        budget.expenses[expenseIndex].paidBy.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update this expense', 403));
    }
    
    // Extract and validate updated fields
    const { category, amount, description, receipt, date, notes } = req.body;
    
    // Validate required fields if they are being updated
    if ((category !== undefined && !category) || 
        (amount !== undefined && !amount) || 
        (description !== undefined && !description) || 
        (receipt !== undefined && !receipt)) {
      return next(new ErrorResponse('Cannot update with empty required fields: category, amount, description, and receipt must have values', 400));
    }
    
    // Validate category if it's being updated
    if (category) {
      const validCategories = ['venue', 'food', 'transportation', 'materials', 'marketing', 'speaker', 'other'];
      if (!validCategories.includes(category)) {
        return next(new ErrorResponse(`Category must be one of: ${validCategories.join(', ')}`, 400));
      }
    }
    
    // Create updated expense object with only the fields that are provided
    const updatedExpense = { ...budget.expenses[expenseIndex].toObject() };
    
    if (category !== undefined) updatedExpense.category = category;
    if (amount !== undefined) updatedExpense.amount = amount;
    if (description !== undefined) updatedExpense.description = description;
    if (receipt !== undefined) updatedExpense.receipt = receipt;
    if (date !== undefined) updatedExpense.date = date;
    if (notes !== undefined) updatedExpense.notes = notes;
    
    // Reset status to pending when updated
    updatedExpense.status = 'pending';
    
    // Update expense
    budget.expenses[expenseIndex] = updatedExpense;
    
    await budget.save();
    
    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (error) {
    logger.error(`Error updating expense: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/budgets/:id/expenses/:expenseId
// @access  Private (Admin, Committee)
exports.deleteExpense = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return next(new ErrorResponse(`Budget not found with id of ${req.params.id}`, 404));
    }
    
    // Find expense
    const expenseIndex = budget.expenses.findIndex(
      expense => expense._id.toString() === req.params.expenseId
    );
    
    if (expenseIndex === -1) {
      return next(new ErrorResponse(`Expense not found with id of ${req.params.expenseId}`, 404));
    }
    
    // Check if user is authorized to delete (admin or the creator)
    if (req.user.role !== 'admin' && 
        budget.expenses[expenseIndex].paidBy.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to delete this expense', 403));
    }
    
    // Remove expense
    budget.expenses.splice(expenseIndex, 1);
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

// @desc    Approve expense
// @route   PUT /api/budgets/:id/expenses/:expenseId/approve
// @access  Private (Admin, Committee)
exports.approveExpense = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return next(new ErrorResponse(`Budget not found with id of ${req.params.id}`, 404));
    }
    
    // Find expense
    const expenseIndex = budget.expenses.findIndex(
      expense => expense._id.toString() === req.params.expenseId
    );
    
    if (expenseIndex === -1) {
      return next(new ErrorResponse(`Expense not found with id of ${req.params.expenseId}`, 404));
    }
    
    // Only admin can approve expenses
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to approve expenses', 403));
    }
    
    // Update expense status
    budget.expenses[expenseIndex].status = 'approved';
    await budget.save();
    
    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (error) {
    logger.error(`Error approving expense: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Get budget analytics
// @route   GET /api/budgets/analytics
// @access  Private (Admin, Committee)
exports.getBudgetAnalytics = async (req, res, next) => {
  try {
    // Get total budget allocation and spending
    const budgetSummary = await Budget.aggregate([
      { $match: { isActive: true } },
      { 
        $group: { 
          _id: null, 
          totalAllocated: { $sum: '$totalAmount' },
          totalSpent: { $sum: '$spentAmount' }
        } 
      }
    ]);
    
    // Get expenses by category
    const expensesByCategory = await Budget.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$expenses' },
      { $match: { 'expenses.status': 'approved' } },
      { 
        $group: { 
          _id: '$expenses.category', 
          total: { $sum: '$expenses.amount' }
        } 
      },
      { $sort: { total: -1 } }
    ]);
    
    // Get budgets by event type
    const budgetsByEventType = await Budget.aggregate([
      { 
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: '_id',
          as: 'event'
        }
      },
      { $unwind: '$event' },
      { 
        $group: { 
          _id: '$event.type', 
          totalAllocated: { $sum: '$totalAmount' },
          totalSpent: { $sum: '$spentAmount' },
          count: { $sum: 1 }
        } 
      },
      { $sort: { totalAllocated: -1 } }
    ]);
    
    // Get monthly budget allocation for the past year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const monthlyBudgets = await Budget.aggregate([
      { $match: { isActive: true, createdAt: { $gte: oneYearAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          allocated: { $sum: '$totalAmount' },
          spent: { $sum: '$spentAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        summary: budgetSummary[0] || { totalAllocated: 0, totalSpent: 0 },
        expensesByCategory,
        budgetsByEventType,
        monthlyBudgets
      }
    });
  } catch (error) {
    logger.error(`Error getting budget analytics: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Export budget to PDF
// @route   GET /api/budgets/:id/export
// @access  Private (Admin, Committee)
exports.exportBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id)
      .populate('eventId', 'title date time venue')
      .populate('createdBy', 'name email')
      .populate('expenses.paidBy', 'name email');
    
    if (!budget) {
      return next(new ErrorResponse(`Budget not found with id of ${req.params.id}`, 404));
    }
    
    // Create PDF document
    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=budget-${budget._id}.pdf`);
    
    // Pipe the PDF to the response
    doc.pipe(res);
    
    // Add content to PDF
    doc.fontSize(25).text('Budget Report', {
      align: 'center'
    });
    
    doc.moveDown();
    doc.fontSize(15).text(`Event: ${budget.eventId.title}`);
    doc.fontSize(12).text(`Date: ${new Date(budget.eventId.date).toLocaleDateString()}`);
    doc.fontSize(12).text(`Venue: ${budget.eventId.venue}`);
    doc.fontSize(12).text(`Created By: ${budget.createdBy.name}`);
    doc.moveDown();
    
    // Budget Summary
    doc.fontSize(15).text('Budget Summary');
    doc.fontSize(12).text(`Total Amount: $${budget.totalAmount.toFixed(2)}`);
    doc.fontSize(12).text(`Spent Amount: $${budget.spentAmount.toFixed(2)}`);
    doc.fontSize(12).text(`Remaining Amount: $${(budget.totalAmount - budget.spentAmount).toFixed(2)}`);
    doc.moveDown();
    
    // Expenses
    doc.fontSize(15).text('Expenses');
    doc.moveDown();
    
    // Create expense table
    const expenseTable = {
      headers: ['Category', 'Amount', 'Description', 'Date', 'Paid By', 'Status'],
      rows: []
    };
    
    budget.expenses.forEach(expense => {
      expenseTable.rows.push([
        expense.category,
        `$${expense.amount.toFixed(2)}`,
        expense.description,
        new Date(expense.date).toLocaleDateString(),
        expense.paidBy ? expense.paidBy.name : 'N/A',
        expense.status
      ]);
    });
    
    // Draw expense table
    const startX = 50;
    let startY = doc.y;
    const cellPadding = 5;
    const columnWidths = [80, 60, 150, 80, 80, 70];
    
    // Draw table headers
    doc.fontSize(10).font('Helvetica-Bold');
    let currentX = startX;
    
    expenseTable.headers.forEach((header, i) => {
      doc.text(header, currentX, startY, {
        width: columnWidths[i],
        align: 'left'
      });
      currentX += columnWidths[i];
    });
    
    // Draw table rows
    doc.font('Helvetica');
    startY += 20;
    
    expenseTable.rows.forEach(row => {
      currentX = startX;
      const rowHeight = 20;
      
      row.forEach((cell, i) => {
        doc.text(cell, currentX, startY, {
          width: columnWidths[i],
          align: 'left'
        });
        currentX += columnWidths[i];
      });
      
      startY += rowHeight;
    });
    
    // Finalize PDF
    doc.end();
  } catch (error) {
    logger.error(`Error exporting budget: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

module.exports = exports; 