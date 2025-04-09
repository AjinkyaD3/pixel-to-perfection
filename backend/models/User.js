const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
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
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'committee', 'student'],
    default: 'student'
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  verified: {
    type: Boolean,
    default: true
  },
  refreshToken: {
    type: String,
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  verificationToken: String,
  verificationExpire: Date,
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  rollNumber: {
    type: String,
    required: function() {
      return this.role === 'student';
    },
  },
  year: {
    type: String,
    enum: ['FE', 'SE', 'TE', 'BE'],
    required: function() {
      return this.role === 'student';
    },
  },
  division: {
    type: String,
    enum: ['A', 'B', 'C'],
    required: function() {
      return this.role === 'student';
    },
  },
  skills: [{
    type: String,
  }],
  profilePicture: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  googleId: String,
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Generate JWT token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Generate refresh token
userSchema.methods.getRefreshToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );
};

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Generate verification token
userSchema.methods.getVerificationToken = function() {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  this.verificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  this.verificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return verificationToken;
};

module.exports = mongoose.model('User', userSchema); 