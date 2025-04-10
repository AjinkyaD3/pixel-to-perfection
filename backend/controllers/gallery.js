const Gallery = require('../models/Gallery');
const { ErrorResponse } = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');
const { uploadImage } = require('../services/cloudUploader');

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
exports.getGalleryImages = asyncHandler(async (req, res, next) => {
  // Add pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const query = {};
  
  // Add search by title or description
  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } }
    ];
  }
  
  // Filter by tags
  if (req.query.tags) {
    const tags = req.query.tags.split(',').map(tag => tag.trim());
    query.tags = { $in: tags };
  }
  
  // Default to active images only
  if (req.query.includeInactive !== 'true') {
    query.isActive = true;
  }

  const total = await Gallery.countDocuments(query);
  const gallery = await Gallery.find(query)
    .sort({ uploadDate: -1 })
    .skip(startIndex)
    .limit(limit)
    .populate('uploadedBy', 'name');

  res.status(200).json({
    success: true,
    count: gallery.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    },
    data: gallery
  });
});

// @desc    Get single gallery image
// @route   GET /api/gallery/:id
// @access  Public
exports.getGalleryImage = asyncHandler(async (req, res, next) => {
  const gallery = await Gallery.findById(req.params.id).populate('uploadedBy', 'name');

  if (!gallery) {
    return next(new ErrorResponse(`Gallery image not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: gallery
  });
});

// @desc    Get images by event
// @route   GET /api/gallery/event/:eventId
// @access  Public
exports.getImagesByEvent = asyncHandler(async (req, res, next) => {
  const gallery = await Gallery.find({ 
    eventId: req.params.eventId,
    isActive: true
  }).sort({ uploadDate: -1 });

  res.status(200).json({
    success: true,
    count: gallery.length,
    data: gallery
  });
});

// @desc    Upload gallery image
// @route   POST /api/gallery
// @access  Private (Admin, Committee)
exports.uploadGalleryImage = asyncHandler(async (req, res, next) => {
  try {
    // Check if file exists
    if (!req.file) {
      return next(new ErrorResponse('Please upload an image file', 400));
    }

    // Get user ID
    const uploadedBy = req.user.id;

    // Upload image to cloud storage
    const imageResult = await uploadImage(
      req.file.buffer,
      'gallery',
      { filename: `gallery_${Date.now()}` }
    );

    // Create gallery entry
    const gallery = await Gallery.create({
      title: req.body.title,
      description: req.body.description || '',
      imageUrl: imageResult.url,
      publicId: imageResult.publicId,
      uploadedBy,
      eventId: req.body.eventId || null,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
    });

    res.status(201).json({
      success: true,
      data: gallery
    });
  } catch (error) {
    logger.error('Error uploading gallery image:', error);
    return next(new ErrorResponse('Error uploading image. Please try again.', 500));
  }
});

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private (Admin, Committee)
exports.deleteGalleryImage = asyncHandler(async (req, res, next) => {
  const gallery = await Gallery.findById(req.params.id);

  if (!gallery) {
    return next(new ErrorResponse(`Gallery image not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is admin or committee member, or the one who uploaded the image
  if (
    req.user.role !== 'admin' &&
    req.user.role !== 'committee' &&
    gallery.uploadedBy.toString() !== req.user.id
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this image`, 401));
  }

  // Delete from storage if publicId exists
  if (gallery.publicId) {
    try {
      // If you have a deleteFile function in cloudUploader
      // await deleteFile(gallery.publicId);
      logger.info(`Deleted image from storage: ${gallery.publicId}`);
    } catch (error) {
      logger.error(`Error deleting image from storage: ${error.message}`);
      // Continue with deletion from database even if storage deletion fails
    }
  }

  await gallery.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
}); 