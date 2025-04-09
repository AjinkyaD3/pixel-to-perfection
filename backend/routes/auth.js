const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const validateRequest = require('../middleware/validateRequest');
const {
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updatePasswordValidation
} = require('../validators/auth');
const {
  signup,
  login,
  googleLogin,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken,
  updatePassword
} = require('../controllers/auth');

// Public routes
router.post('/signup', authLimiter, signupValidation, validateRequest, signup);
router.post('/login', authLimiter, loginValidation, validateRequest, login);
router.post('/google', authLimiter, googleLogin);
router.post('/forgot-password', authLimiter, forgotPasswordValidation, validateRequest, forgotPassword);
router.post('/reset-password/:token', authLimiter, resetPasswordValidation, validateRequest, resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/update-password', protect, updatePasswordValidation, validateRequest, updatePassword);

module.exports = router;

 