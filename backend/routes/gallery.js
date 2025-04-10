const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { generalLimiter } = require('../middleware/rateLimiter');
const { check } = require('express-validator');
const { uploadImage } = require('../services/cloudUploader');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Import controllers
const {
  getGalleryImages,
  getGalleryImage,
  uploadGalleryImage,
  deleteGalleryImage,
  getImagesByEvent
} = require('../controllers/gallery');

// Apply rate limiting to all routes
router.use(generalLimiter);

// Get all gallery images
router.get('/', getGalleryImages);

// Get single gallery image
router.get('/:id', getGalleryImage);

// Get images by event
router.get('/event/:eventId', getImagesByEvent);

// Upload gallery image
router.post(
  '/',
  [
    protect,
    authorize('admin', 'committee'),
    upload.single('image'),
    [
      check('title', 'Title is required').notEmpty(),
      check('description', 'Description is required').optional()
    ],
    validateRequest
  ],
  uploadGalleryImage
);

// Delete gallery image
router.delete(
  '/:id',
  [
    protect,
    authorize('admin', 'committee')
  ],
  deleteGalleryImage
);

module.exports = router; 