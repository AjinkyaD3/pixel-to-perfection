const Member = require('../models/Member');
const User = require('../models/User');
const { ErrorResponse } = require('../utils/errorResponse');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// @desc    Get all members
// @route   GET /api/members
// @access  Public
exports.getMembers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, position, search } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    // Add filters if provided
    if (role) query.role = role;
    if (position) query.position = position;
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Count documents
    const total = await Member.countDocuments(query);
    
    // Execute query with pagination
    const members = await Member.find(query)
      .sort({ role: 1, position: 1, name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    res.status(200).json({
      success: true,
      count: members.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: members
    });
  } catch (error) {
    logger.error(`Error retrieving members: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Get single member
// @route   GET /api/members/:id
// @access  Public
exports.getMember = async (req, res, next) => {
  try {
    const member = await Member.findOne({ _id: req.params.id, isActive: true });
    
    if (!member) {
      return next(new ErrorResponse(`Member not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    logger.error(`Error retrieving member: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Create member
// @route   POST /api/members
// @access  Private (Admin)
exports.createMember = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse('Validation error', 400, errors.array()));
    }
    
    // Extract and validate required fields
    const { name, email, role, position, avatar, bio, socialLinks, skills } = req.body;
    
    if (!name || !email || !role || !position) {
      return next(new ErrorResponse('Please provide all required fields: name, email, role, and position', 400));
    }
    
    // Validate role is among allowed values
    const validRoles = ['President', 'Vice President', 'Secretary', 'Treasurer', 'Technical Head', 'Event Head', 'Publicity Head', 'Member'];
    if (!validRoles.includes(role)) {
      return next(new ErrorResponse(`Role must be one of: ${validRoles.join(', ')}`, 400));
    }
    
    // Check if email already exists
    const existingMember = await Member.findOne({ email });
    
    if (existingMember) {
      return next(new ErrorResponse(`Member with email ${email} already exists`, 400));
    }
    
    // Create member with all required fields
    const member = await Member.create({
      name,
      email,
      role,
      position,
      avatar: avatar || 'default-avatar.png',
      bio,
      socialLinks: socialLinks || {},
      skills: skills || []
    });
    
    // If the member is added as a committee member, create a user account for them
    if (role === 'committee') {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      
      if (!existingUser) {
        // Generate a random password
        const tempPassword = Math.random().toString(36).slice(-8);
        
        // Create user
        await User.create({
          name,
          email,
          password: tempPassword,
          role: 'committee'
        });
        
        // Send password reset email (this would be implemented in a real-world application)
        logger.info(`Committee member added with temporary password: ${tempPassword}`);
      }
    }
    
    res.status(201).json({
      success: true,
      data: member
    });
  } catch (error) {
    logger.error(`Error creating member: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private (Admin)
exports.updateMember = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse('Validation error', 400, errors.array()));
    }
    
    let member = await Member.findById(req.params.id);
    
    if (!member) {
      return next(new ErrorResponse(`Member not found with id of ${req.params.id}`, 404));
    }
    
    // Check if email is changed and if it already exists
    if (req.body.email && req.body.email !== member.email) {
      const existingMember = await Member.findOne({ email: req.body.email });
      
      if (existingMember) {
        return next(new ErrorResponse(`Member with email ${req.body.email} already exists`, 400));
      }
    }
    
    // Update member
    member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    // If role has changed to or from 'committee', update user accounts accordingly
    if (req.body.role !== member.role) {
      // If changed to committee, create a user account
      if (req.body.role === 'committee') {
        const existingUser = await User.findOne({ email: member.email });
        
        if (!existingUser) {
          // Generate a random password
          const tempPassword = Math.random().toString(36).slice(-8);
          
          // Create user
          await User.create({
            name: member.name,
            email: member.email,
            password: tempPassword,
            role: 'committee'
          });
          
          // Send password reset email (this would be implemented in a real-world application)
          logger.info(`Committee member added with temporary password: ${tempPassword}`);
        }
      } 
      // If changed from committee, update user role or deactivate account
      else if (member.role === 'committee') {
        const user = await User.findOne({ email: member.email });
        
        if (user) {
          user.isActive = false;
          await user.save();
        }
      }
    }
    
    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    logger.error(`Error updating member: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private (Admin)
exports.deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    
    if (!member) {
      return next(new ErrorResponse(`Member not found with id of ${req.params.id}`, 404));
    }
    
    // Soft delete (set isActive to false)
    member.isActive = false;
    await member.save();
    
    // If committee member, deactivate user account
    if (member.role === 'committee') {
      const user = await User.findOne({ email: member.email });
      
      if (user) {
        user.isActive = false;
        await user.save();
      }
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Error deleting member: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Upload members via CSV
// @route   POST /api/members/upload
// @access  Private (Admin)
exports.uploadMembers = async (req, res, next) => {
  try {
    // Check if file exists
    if (!req.files || !req.files.file) {
      return next(new ErrorResponse('Please upload a CSV file', 400));
    }
    
    const file = req.files.file;
    
    // Check if file is CSV
    if (file.mimetype !== 'text/csv') {
      return next(new ErrorResponse('Please upload a CSV file', 400));
    }
    
    // Create temp file path
    const uploadPath = path.join(__dirname, '../uploads', file.name);
    
    // Move file to upload path
    await file.mv(uploadPath);
    
    // Parse CSV
    const results = [];
    const errors = [];
    
    fs.createReadStream(uploadPath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Delete temp file
        fs.unlinkSync(uploadPath);
        
        // Process each row
        for (const row of results) {
          try {
            // Validate required fields
            if (!row.name || !row.email || !row.role || !row.position) {
              errors.push({
                email: row.email || 'unknown',
                error: 'Missing required fields'
              });
              continue;
            }
            
            // Check if member already exists
            const existingMember = await Member.findOne({ email: row.email });
            
            if (existingMember) {
              // Update existing member
              await Member.findByIdAndUpdate(
                existingMember._id,
                {
                  name: row.name,
                  role: row.role,
                  position: row.position,
                  department: row.department || '',
                  bio: row.bio || '',
                  avatar: row.avatar || 'default-avatar.png',
                  socialLinks: {
                    linkedin: row.linkedin || '',
                    github: row.github || '',
                    twitter: row.twitter || ''
                  },
                  isActive: true
                },
                { new: true, runValidators: true }
              );
            } else {
              // Create new member
              await Member.create({
                name: row.name,
                email: row.email,
                role: row.role,
                position: row.position,
                department: row.department || '',
                bio: row.bio || '',
                avatar: row.avatar || 'default-avatar.png',
                socialLinks: {
                  linkedin: row.linkedin || '',
                  github: row.github || '',
                  twitter: row.twitter || ''
                }
              });
              
              // If committee member, create user account
              if (row.role === 'committee') {
                const existingUser = await User.findOne({ email: row.email });
                
                if (!existingUser) {
                  // Generate a random password
                  const tempPassword = Math.random().toString(36).slice(-8);
                  
                  // Create user
                  await User.create({
                    name: row.name,
                    email: row.email,
                    password: tempPassword,
                    role: 'committee'
                  });
                  
                  // Send password reset email (this would be implemented in a real-world application)
                  logger.info(`Committee member added with temporary password: ${tempPassword}`);
                }
              }
            }
          } catch (error) {
            errors.push({
              email: row.email || 'unknown',
              error: error.message
            });
          }
        }
        
        res.status(200).json({
          success: true,
          data: {
            totalProcessed: results.length,
            successCount: results.length - errors.length,
            errorCount: errors.length,
            errors
          }
        });
      });
  } catch (error) {
    logger.error(`Error uploading members: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

module.exports = exports; 