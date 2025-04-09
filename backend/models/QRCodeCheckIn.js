const mongoose = require('mongoose');

const qrCodeCheckInSchema = new mongoose.Schema({
  registrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
    required: [true, 'Please provide a registration ID']
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Please provide an event ID']
  },
  scannedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide the user who scanned the QR code']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  location: {
    latitude: Number,
    longitude: Number,
    accuracy: Number
  },
  deviceInfo: {
    userAgent: String,
    platform: String
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
qrCodeCheckInSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for efficient querying
qrCodeCheckInSchema.index({ registrationId: 1 });
qrCodeCheckInSchema.index({ eventId: 1 });
qrCodeCheckInSchema.index({ scannedBy: 1 });
qrCodeCheckInSchema.index({ timestamp: -1 });

module.exports = mongoose.model('QRCodeCheckIn', qrCodeCheckInSchema); 