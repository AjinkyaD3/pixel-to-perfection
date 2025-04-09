const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  rollNo: {
    type: String,
    required: [true, 'Please provide a roll number'],
    unique: true,
    trim: true
  },
  division: {
    type: String,
    required: [true, 'Please provide a division'],
    enum: ['A', 'B', 'C']
  },
  year: {
    type: String,
    required: [true, 'Please provide a year'],
    enum: ['FE', 'SE', 'TE', 'BE']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  skills: [{
    type: String,
    trim: true
  }],
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
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

// Update the updatedAt field before saving
studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create index for efficient querying
studentSchema.index({ rollNo: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ year: 1, division: 1 });

module.exports = mongoose.model('Student', studentSchema); 