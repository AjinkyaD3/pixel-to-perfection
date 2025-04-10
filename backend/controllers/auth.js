const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { ErrorResponse } = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const { OAuth2Client } = require('google-auth-library');
const logger = require('../utils/logger');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Create JWT Token
const getSignedJwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      rollNumber,
      year,
      division,
      skills,
      profilePicture,
      registrationCode
    } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse("User already exists", 400));
    }

    // 2. Validate role and registration code
    if (role === 'admin' && registrationCode !== process.env.ADMIN_REGISTRATION_CODE) {
      return next(new ErrorResponse("Invalid admin registration code", 401));
    }

    if (role === 'committee' && registrationCode !== process.env.COMMITTEE_REGISTRATION_CODE) {
      return next(new ErrorResponse("Invalid committee registration code", 401));
    }

    // 3. Create new user with all required fields
    const user = await User.create({
      name,
      email,
      password,
      role,
      rollNumber,
      year,
      division,
      skills: skills || [],
      profilePicture,
      verified: true, // Auto-verify for development (remove for production)
    });

    // 4. Generate email verification token (commented for development)
    // const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: true });

    // 5. Send verification email (commented for development)
    // await sendVerificationEmail(user.email, verificationToken);

    // 6. Auto-login after signup - return token response like login
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new ErrorResponse('This account has been deactivated', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if user is verified
    if (!user.verified) {
      return next(new ErrorResponse('Please verify your email first', 401));
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    logger.error(`Login error: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res, next) => {
  try {
    const { tokenId } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { name, email, picture } = ticket.getPayload();

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Update user if exists
      user.name = name;
      user.avatar = picture;
      user.provider = 'google';
      await user.save();
    } else {
      // Create new user if doesn't exist
      user = await User.create({
        name,
        email,
        avatar: picture,
        provider: 'google',
        verified: true
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorResponse('No user found with this email', 404));
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>You are receiving this email because you requested a password reset.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
      `
    });

    res.status(200).json({
      success: true,
      data: 'Email sent'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse('Invalid or expired token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify reset token
// @route   GET /api/auth/verify-reset-token/:token
// @access  Public
exports.verifyResetToken = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse('Invalid or expired token', 400));
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
      return next(new ErrorResponse('Current password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new ErrorResponse('No refresh token provided', 400));
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
      return next(new ErrorResponse('Invalid refresh token', 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse('Invalid or expired token', 400));
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      data: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();
  const refreshToken = user.getRefreshToken();

  // Save refresh token to database
  user.refreshToken = refreshToken;
  user.save();

  const cookieExpire = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const options = {
    expires: new Date(Date.now() + cookieExpire),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  // Create user object without sensitive data
  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    verified: user.verified,
    createdAt: user.createdAt
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      refreshToken,
      user: userData
    });
}; 