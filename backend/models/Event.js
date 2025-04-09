const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Event type is required'],
    enum: ['workshop', 'seminar', 'competition', 'hackathon', 'other']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required']
  },
  venue: {
    type: String,
    required: [true, 'Venue is required']
  },
  speaker: {
    name: {
      type: String,
      required: [true, 'Speaker name is required']
    },
    designation: String,
    organization: String,
    bio: String
  },
  posterUrl: {
    type: String,
    default: 'default-poster.png'
  },
  maxCapacity: {
    type: Number,
    required: [true, 'Maximum capacity is required']
  },
  registeredStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  budget: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget'
  },
  qrCode: String,
  checkIns: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  feedback: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
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

// Pre-save middleware to update updatedAt
eventSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes
eventSchema.index({ date: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Event', eventSchema); 