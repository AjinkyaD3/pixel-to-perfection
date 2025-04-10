const express = require('express');
const router = express.Router();
const { uploadSingle, uploadMultiple, uploadFields } = require('../utils/fileUpload');
const { protect, authorize } = require('../middleware/auth');
const { generalLimiter } = require('../middleware/rateLimiter');

// Controller function to handle successful uploads
const handleUpload = (req, res) => {
  try {
    // For single file uploads
    if (req.file) {
      // Fix double slashes in path
      const pathPart = req.file.path.split('uploads')[1].replace(/\\/g, '/').replace(/^\/+/, '');
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${pathPart}`.replace(/([^:])\/+/g, '$1/');
      return res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        file: {
          filename: req.file.filename,
          path: req.file.path,
          url: fileUrl,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });
    }
    
    // For multiple files uploads
    if (req.files) {
      // If it's an array (uploadMultiple)
      if (Array.isArray(req.files)) {
        const files = req.files.map(file => {
          // Fix double slashes in path
          const pathPart = file.path.split('uploads')[1].replace(/\\/g, '/').replace(/^\/+/, '');
          const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${pathPart}`.replace(/([^:])\/+/g, '$1/');
          return {
            filename: file.filename,
            path: file.path,
            url: fileUrl,
            size: file.size,
            mimetype: file.mimetype
          };
        });
        
        return res.status(200).json({
          success: true,
          message: 'Files uploaded successfully',
          files
        });
      }
      
      // If it's an object (uploadFields)
      const fileFields = {};
      Object.keys(req.files).forEach(fieldName => {
        fileFields[fieldName] = req.files[fieldName].map(file => {
          // Fix double slashes in path
          const pathPart = file.path.split('uploads')[1].replace(/\\/g, '/').replace(/^\/+/, '');
          const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${pathPart}`.replace(/([^:])\/+/g, '$1/');
          return {
            filename: file.filename,
            path: file.path,
            url: fileUrl,
            size: file.size,
            mimetype: file.mimetype
          };
        });
      });
      
      return res.status(200).json({
        success: true,
        message: 'Files uploaded successfully',
        fileFields
      });
    }
    
    // No files uploaded
    return res.status(400).json({
      success: false,
      message: 'No files were uploaded.'
    });
  } catch (error) {
    console.error('Error in upload handler:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing uploaded files',
      error: error.message
    });
  }
};

// Error handler for multer errors
const uploadErrorHandler = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 10MB.'
    });
  }
  
  if (err.message.includes('File upload only supports')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  return res.status(500).json({
    success: false,
    message: 'Error uploading file',
    error: err.message
  });
};

// Apply rate limiting to all upload routes
router.use(generalLimiter);

// Routes for single file uploads
router.post('/single', protect, uploadSingle('file'), handleUpload);

// Routes for image uploads specifically for profiles, events, etc.
router.post('/image', protect, uploadSingle('image'), handleUpload);
router.post('/profile-image', protect, uploadSingle('profileImage'), handleUpload);
router.post('/event-image', protect, authorize('admin', 'committee'), uploadSingle('eventImage'), handleUpload);

// Routes for multiple file uploads (like gallery uploads)
router.post('/multiple', protect, uploadMultiple('files', 10), handleUpload);

// Routes for gallery uploads
router.post('/gallery', protect, authorize('admin', 'committee'), uploadMultiple('images', 20), handleUpload);

// Routes for announcement attachments
router.post('/attachments', protect, authorize('admin', 'committee'), uploadMultiple('attachments', 5), handleUpload);

// Error handling middleware
router.use(uploadErrorHandler);

module.exports = router; 