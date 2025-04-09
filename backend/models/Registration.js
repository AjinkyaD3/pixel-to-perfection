const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Please provide an event ID']
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Please provide a student ID']
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  qrCode: {
    type: String,
    required: [true, 'Please provide a QR code']
  },
  checkInStatus: {
    type: String,
    enum: ['pending', 'checked-in', 'cancelled'],
    default: 'pending'
  },
  checkInTime: {
    type: Date
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
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

// Update the updatedAt field before saving
registrationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for efficient querying
registrationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });
registrationSchema.index({ checkInStatus: 1 });
registrationSchema.index({ registrationDate: -1 });

module.exports = mongoose.model('Registration', registrationSchema); 