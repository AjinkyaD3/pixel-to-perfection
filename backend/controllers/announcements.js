const Announcement = require('../models/Announcement');
const { ErrorResponse } = require('../utils/errorResponse');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
exports.getAnnouncements = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, targetAudience, search, isPinned } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    // Add filters if provided
    if (type) query.type = type;
    if (targetAudience) query.targetAudience = targetAudience;
    if (isPinned === 'true') query.isPinned = true;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Count documents
    const total = await Announcement.countDocuments(query);
    
    // Execute query with pagination
    const announcements = await Announcement.find(query)
      .populate('createdBy', 'name email')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    res.status(200).json({
      success: true,
      count: announcements.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: announcements
    });
  } catch (error) {
    logger.error(`Error retrieving announcements: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Public
exports.getAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findOne({ _id: req.params.id, isActive: true })
      .populate('createdBy', 'name email');
    
    if (!announcement) {
      return next(new ErrorResponse(`Announcement not found with id of ${req.params.id}`, 404));
    }
    
    // Increment views count
    announcement.views += 1;
    await announcement.save();
    
    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    logger.error(`Error retrieving announcement: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private (Admin, Committee)
exports.createAnnouncement = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse('Validation error', 400, errors.array()));
    }
    
    // Extract and validate required fields
    const { title, content, type, targetAudience, year, attachments, pinned } = req.body;
    
    if (!title || !content || !type || !targetAudience) {
      return next(new ErrorResponse('Please provide all required fields: title, content, type, and targetAudience', 400));
    }
    
    // Validate type is among allowed values
    const validTypes = ['general', 'event', 'important', 'urgent'];
    if (!validTypes.includes(type)) {
      return next(new ErrorResponse(`Type must be one of: ${validTypes.join(', ')}`, 400));
    }
    
    // Validate targetAudience is among allowed values
    const validAudiences = ['all', 'committee', 'students', 'specific_year'];
    if (!validAudiences.includes(targetAudience)) {
      return next(new ErrorResponse(`Target audience must be one of: ${validAudiences.join(', ')}`, 400));
    }
    
    // Check if year is required but missing
    if (targetAudience === 'specific_year' && !year) {
      return next(new ErrorResponse('Year is required when target audience is specific_year', 400));
    }
    
    // Validate year if provided
    if (year) {
      const validYears = ['FE', 'SE', 'TE', 'BE'];
      if (!validYears.includes(year)) {
        return next(new ErrorResponse(`Year must be one of: ${validYears.join(', ')}`, 400));
      }
    }
    
    // Create announcement with user ID
    const announcement = await Announcement.create({
      title,
      content,
      type,
      targetAudience,
      year: targetAudience === 'specific_year' ? year : undefined,
      attachments: attachments || [],
      pinned: pinned || false,
      createdBy: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    logger.error(`Error creating announcement: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private (Admin, Committee)
exports.updateAnnouncement = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse('Validation error', 400, errors.array()));
    }
    
    let announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return next(new ErrorResponse(`Announcement not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is authorized to update (admin or the creator)
    if (req.user.role !== 'admin' && announcement.createdBy.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update this announcement', 403));
    }
    
    // Update announcement
    announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    logger.error(`Error updating announcement: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Admin, Committee)
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return next(new ErrorResponse(`Announcement not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is authorized to delete (admin or the creator)
    if (req.user.role !== 'admin' && announcement.createdBy.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to delete this announcement', 403));
    }
    
    // Soft delete (set isActive to false)
    announcement.isActive = false;
    await announcement.save();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Error deleting announcement: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Pin/unpin announcement
// @route   PUT /api/announcements/:id/pin
// @access  Private (Admin, Committee)
exports.pinAnnouncement = async (req, res, next) => {
  try {
    let announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return next(new ErrorResponse(`Announcement not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is authorized (admin only)
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to pin/unpin announcements', 403));
    }
    
    // Toggle pin status
    announcement.isPinned = !announcement.isPinned;
    await announcement.save();
    
    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    logger.error(`Error pinning/unpinning announcement: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Get announcement analytics
// @route   GET /api/announcements/analytics
// @access  Private (Admin, Committee)
exports.getAnnouncementAnalytics = async (req, res, next) => {
  try {
    // Get announcement counts by type
    const announcementsByType = await Announcement.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Get announcement counts by target audience
    const announcementsByAudience = await Announcement.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$targetAudience', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Get monthly announcement counts for the past year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const monthlyAnnouncements = await Announcement.aggregate([
      { $match: { isActive: true, createdAt: { $gte: oneYearAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get most viewed announcements
    const mostViewed = await Announcement.find({ isActive: true })
      .select('title type targetAudience views createdAt')
      .sort({ views: -1 })
      .limit(10);
    
    res.status(200).json({
      success: true,
      data: {
        totalAnnouncements: await Announcement.countDocuments({ isActive: true }),
        announcementsByType,
        announcementsByAudience,
        monthlyAnnouncements,
        mostViewed
      }
    });
  } catch (error) {
    logger.error(`Error getting announcement analytics: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

module.exports = exports; 