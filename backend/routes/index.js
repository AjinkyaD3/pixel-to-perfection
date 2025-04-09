const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const studentRoutes = require('./students');
const eventRoutes = require('./events');
const budgetRoutes = require('./budget');

// Mount routes
router.use('/api/auth', authRoutes);
router.use('/api/students', studentRoutes);
router.use('/api/events', eventRoutes);
router.use('/api/budgets', budgetRoutes);

// API health check route
router.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 