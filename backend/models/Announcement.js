const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
}, { _id: false });

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['general', 'event', 'important', 'urgent']
  },
  targetAudience: {
    type: String,
    required: [true, 'Target audience is required'],
    enum: ['all', 'committee', 'students', 'specific_year']
  },
  year: {
    type: String,
    enum: ['FE', 'SE', 'TE', 'BE'],
    required: function() {
      return this.targetAudience === 'specific_year';
    }
  },
  attachments: [attachmentSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pinned: {
    type: Boolean,
    default: false
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

// Pre-save middleware to update updatedAt
announcementSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes
announcementSchema.index({ type: 1 });
announcementSchema.index({ targetAudience: 1 });
announcementSchema.index({ createdBy: 1 });
announcementSchema.index({ pinned: 1, createdAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema); 