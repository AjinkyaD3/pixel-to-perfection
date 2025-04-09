const Event = require('../models/Event');
const Student = require('../models/Student');
const Budget = require('../models/Budget');
const { ErrorResponse } = require('../utils/errorResponse');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');
const QRCode = require('qrcode');
const ExcelJS = require('exceljs');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, status, search } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    // Add filters if provided
    if (type) query.type = type;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { 'speaker.name': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Count documents
    const total = await Event.countDocuments(query);
    
    // Execute query with pagination
    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .populate('budget', 'totalAmount spentAmount status')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    res.status(200).json({
      success: true,
      count: events.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: events
    });
  } catch (error) {
    logger.error(`Error retrieving events: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, isActive: true })
      .populate('createdBy', 'name email')
      .populate('budget', 'totalAmount spentAmount status expenses')
      .populate('registeredStudents', 'name rollNo email division year')
      .populate('checkIns.student', 'name rollNo email');
    
    if (!event) {
      return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    logger.error(`Error retrieving event: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private (Admin, Committee)
exports.createEvent = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse('Validation error', 400, errors.array()));
    }
    
    // Ensure all required fields are present
    const {
      title,
      type,
      description,
      date,
      time,
      venue,
      maxCapacity,
      speaker,
      posterUrl
    } = req.body;
    
    if (!title || !type || !description || !date || !time || !venue || !maxCapacity) {
      return next(new ErrorResponse('Please provide all required fields', 400));
    }
    
    // Create event with all required fields
    const event = await Event.create({
      title,
      type,
      description,
      date,
      time,
      venue,
      maxCapacity,
      speaker: speaker || {},
      posterUrl,
      createdBy: req.user.id,
      status: 'upcoming'
    });
    
    // Create budget if amount is provided
    if (req.body.budget && req.body.budget.totalAmount) {
      const budget = await Budget.create({
        eventId: event._id,
        totalAmount: req.body.budget.totalAmount,
        createdBy: req.user.id
      });
      
      // Update event with budget reference
      event.budget = budget._id;
      await event.save();
    }
    
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    logger.error(`Error creating event: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin, Committee)
exports.updateEvent = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse('Validation error', 400, errors.array()));
    }
    
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is authorized to update (admin or the creator)
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update this event', 403));
    }
    
    // Update event
    event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    // Update budget if provided
    if (req.body.budget && req.body.budget.totalAmount) {
      if (event.budget) {
        await Budget.findByIdAndUpdate(
          event.budget,
          { totalAmount: req.body.budget.totalAmount },
          { new: true, runValidators: true }
        );
      } else {
        const budget = await Budget.create({
          eventId: event._id,
          totalAmount: req.body.budget.totalAmount,
          createdBy: req.user.id
        });
        
        event.budget = budget._id;
        await event.save();
      }
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    logger.error(`Error updating event: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin, Committee)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is authorized to delete (admin or the creator)
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to delete this event', 403));
    }
    
    // Soft delete (set isActive to false)
    event.isActive = false;
    await event.save();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Error deleting event: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private (Student, Admin, Committee)
exports.registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
    }
    
    if (event.status !== 'upcoming') {
      return next(new ErrorResponse(`Registration closed for this event`, 400));
    }
    
    let studentId;
    
    // If admin/committee registering a student
    if ((req.user.role === 'admin' || req.user.role === 'committee') && req.body.studentId) {
      studentId = req.body.studentId;
    } else {
      // Get student associated with the logged-in user
      const student = await Student.findOne({ email: req.user.email });
      
      if (!student) {
        return next(new ErrorResponse('Student profile not found', 404));
      }
      
      studentId = student._id;
    }
    
    // Check if student already registered
    if (event.registeredStudents.includes(studentId)) {
      return next(new ErrorResponse('Student already registered for this event', 400));
    }
    
    // Check if event has reached capacity
    if (event.registeredStudents.length >= event.maxCapacity) {
      return next(new ErrorResponse('Event has reached maximum capacity', 400));
    }
    
    // Add student to registered students
    event.registeredStudents.push(studentId);
    await event.save();
    
    res.status(200).json({
      success: true,
      message: 'Successfully registered for the event',
      data: event
    });
  } catch (error) {
    logger.error(`Error registering for event: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

/**
 * @desc    Check in student to event
 * @route   POST /api/events/:id/checkin
 * @access  Private/Admin/Committee
 */
exports.checkInEvent = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    
    if (!studentId) {
      return next(new ErrorResponse('Student ID is required', 400));
    }
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
    }
    
    // Check if student is registered for the event
    const isRegistered = event.registeredStudents.some(student => student.toString() === studentId);
    
    if (!isRegistered) {
      return next(new ErrorResponse(`Student not registered for this event`, 400));
    }
    
    // Check if student is already checked in
    const isCheckedIn = event.checkIns.some(checkin => checkin.student.toString() === studentId);
    
    if (isCheckedIn) {
      return next(new ErrorResponse(`Student already checked in`, 400));
    }
    
    // Add student to check-ins
    event.checkIns.push({
      student: studentId,
      checkedInBy: req.user.id,
      time: new Date()
    });
    
    await event.save();
    
    res.status(200).json({
      success: true,
      data: {
        message: 'Student checked in successfully',
        event: event.title,
        checkedIn: true
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate QR code for event
// @route   GET /api/events/:id/qrcode
// @access  Private (Admin, Committee)
exports.generateQRCode = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || !event.isActive) {
      return next(new ErrorResponse('Event not found', 404));
    }

    const qrData = {
      eventId: event._id,
      title: event.title,
      date: event.date,
      time: event.time
    };

    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
    event.qrCode = qrCode;
    await event.save();

    res.status(200).json({
      success: true,
      data: qrCode
    });
  } catch (error) {
    logger.error('Error generating QR code:', error);
    next(error);
  }
};

// @desc    Get event analytics
// @route   GET /api/events/analytics
// @access  Private (Admin, Committee)
exports.getEventAnalytics = async (req, res, next) => {
  try {
    // Get event counts by type
    const eventsByType = await Event.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Get event counts by status
    const eventsByStatus = await Event.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Get monthly event counts for the past year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const monthlyEvents = await Event.aggregate([
      { $match: { isActive: true, date: { $gte: oneYearAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get attendance rates for the past 10 events
    const recentEvents = await Event.find({ isActive: true })
      .sort({ date: -1 })
      .limit(10);
    
    const attendanceData = recentEvents.map(event => {
      const registeredCount = event.registeredStudents.length;
      const checkedInCount = event.checkIns.length;
      const rate = registeredCount > 0 ? (checkedInCount / registeredCount) * 100 : 0;
      
      return {
        eventId: event._id,
        title: event.title,
        date: event.date,
        registeredCount,
        checkedInCount,
        attendanceRate: parseFloat(rate.toFixed(2))
      };
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalEvents: await Event.countDocuments({ isActive: true }),
        eventsByType,
        eventsByStatus,
        monthlyEvents,
        attendanceData
      }
    });
  } catch (error) {
    logger.error(`Error getting event analytics: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Export events to Excel
// @route   GET /api/events/export
// @access  Private (Admin, Committee)
exports.exportEvents = async (req, res, next) => {
  try {
    const { startDate, endDate, type, status } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    // Add date range if provided
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    // Add filters if provided
    if (type) query.type = type;
    if (status) query.status = status;
    
    // Get events
    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .populate('budget', 'totalAmount spentAmount')
      .sort({ date: -1 });
    
    if (events.length === 0) {
      return next(new ErrorResponse('No events found with the given criteria', 404));
    }
    
    // Create Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Events');
    
    // Add columns
    worksheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Time', key: 'time', width: 15 },
      { header: 'Venue', key: 'venue', width: 20 },
      { header: 'Speaker', key: 'speaker', width: 25 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Capacity', key: 'maxCapacity', width: 10 },
      { header: 'Registered', key: 'registered', width: 10 },
      { header: 'Check-ins', key: 'checkins', width: 10 },
      { header: 'Budget', key: 'budget', width: 15 },
      { header: 'Spent', key: 'spent', width: 15 },
      { header: 'Created By', key: 'createdBy', width: 25 },
      { header: 'Created At', key: 'createdAt', width: 20 }
    ];
    
    // Add rows
    events.forEach(event => {
      worksheet.addRow({
        title: event.title,
        type: event.type,
        date: event.date.toISOString().split('T')[0],
        time: event.time,
        venue: event.venue,
        speaker: event.speaker ? event.speaker.name : 'N/A',
        status: event.status,
        maxCapacity: event.maxCapacity,
        registered: event.registeredStudents.length,
        checkins: event.checkIns.length,
        budget: event.budget ? `$${event.budget.totalAmount.toFixed(2)}` : 'N/A',
        spent: event.budget ? `$${event.budget.spentAmount.toFixed(2)}` : 'N/A',
        createdBy: event.createdBy ? event.createdBy.name : 'N/A',
        createdAt: event.createdAt.toISOString().split('T')[0]
      });
    });
    
    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    
    // Set the response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=events.xlsx'
    );
    
    // Write to the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    logger.error(`Error exporting events: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

module.exports = exports; 