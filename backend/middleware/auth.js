const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user) {
      return next(new ErrorResponse('No user found with this id', 404));
    }

    if (!user.isActive) {
      return next(new ErrorResponse('User account is deactivated', 403));
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

// Verify refresh token
exports.verifyRefreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new ErrorResponse('No refresh token provided', 400));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user) {
      return next(new ErrorResponse('No user found with this id', 404));
    }

    if (user.refreshToken !== refreshToken) {
      return next(new ErrorResponse('Invalid refresh token', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse('Invalid refresh token', 401));
  }
};

// Verify email token
exports.verifyEmailToken = async (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    return next(new ErrorResponse('No verification token provided', 400));
  }

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse('Invalid or expired verification token', 400));
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationExpire = undefined;
    await user.save();

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse('Error verifying email', 500));
  }
}; 