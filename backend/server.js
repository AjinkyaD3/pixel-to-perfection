const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const eventRoutes = require('./routes/events');
const budgetRoutes = require('./routes/budgets');
const announcementRoutes = require('./routes/announcements');
const memberRoutes = require('./routes/members');
const leaderboardRoutes = require('./routes/leaderboard');
const uploadRoutes = require('./routes/uploads');
const galleryRoutes = require('./routes/gallery');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

// Initialize express app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

// Connect to MongoDB - only if not already connected in test environment
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI, {
    // Add more robust connection options
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    retryWrites: true,
    w: 'majority'
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
      console.error('MongoDB connection error:', err);
      console.log('Attempting to connect with fallback URI...');
      
      // Try a fallback URI if available
      const fallbackUri = process.env.MONGODB_FALLBACK_URI || 'mongodb://localhost:27017/aces-platform';
      
      // Second attempt with fallback
      mongoose.connect(fallbackUri)
        .then(() => console.log('Connected to MongoDB fallback'))
        .catch(fallbackErr => console.error('MongoDB fallback connection error:', fallbackErr));
    });
}

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(generalLimiter);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/gallery', galleryRoutes);

// Error handling
app.use(errorHandler);

// Start server only if this file is run directly (not imported in tests)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app for testing
module.exports = app;
module.exports.io = io; 