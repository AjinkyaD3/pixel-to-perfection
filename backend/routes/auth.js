const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const validateRequest = require('../middleware/validateRequest');

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

// Test route
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth routes are working!'
  });
});

// Public routes
router.post('/signup',  signup);
router.post('/login',   login);
router.post('/google', googleLogin);
router.post('/forgot-password',  forgotPassword);
router.post('/reset-password/:token',  resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/update-password', protect, updatePassword);

module.exports = router;

 