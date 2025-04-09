const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['President', 'Vice President', 'Secretary', 'Treasurer', 'Technical Head', 'Event Head', 'Publicity Head', 'Member']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  bio: {
    type: String,
    trim: true
  },
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String
  },
  skills: [{
    type: String,
    trim: true
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
memberSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes
memberSchema.index({ email: 1 });
memberSchema.index({ role: 1 });
memberSchema.index({ isActive: 1 });

module.exports = mongoose.model('Member', memberSchema); 