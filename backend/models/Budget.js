const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required']
  },
  spentAmount: {
    type: Number,
    default: 0
  },
  expenses: [{
    category: {
      type: String,
      required: [true, 'Expense category is required'],
      enum: ['venue', 'food', 'transportation', 'materials', 'marketing', 'speaker', 'other']
    },
    amount: {
      type: Number,
      required: [true, 'Expense amount is required']
    },
    description: {
      type: String,
      required: [true, 'Expense description is required']
    },
    date: {
      type: Date,
      required: [true, 'Expense date is required']
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receipt: {
      type: String,
      required: [true, 'Receipt is required']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    notes: String
  }],
  status: {
    type: String,
    enum: ['active', 'closed', 'cancelled'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save middleware to update updatedAt and calculate spentAmount
budgetSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculate total spent amount from approved expenses
  this.spentAmount = this.expenses
    .filter(expense => expense.status === 'approved')
    .reduce((total, expense) => total + expense.amount, 0);
  
  next();
});

// Create indexes
budgetSchema.index({ eventId: 1 });
budgetSchema.index({ status: 1 });
budgetSchema.index({ createdBy: 1 });
budgetSchema.index({ 'expenses.date': 1 });

module.exports = mongoose.model('Budget', budgetSchema); 