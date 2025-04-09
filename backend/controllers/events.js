const Event = require('../models/Event');
const Student = require('../models/Student');
const { ErrorResponse } = require('../utils/errorResponse');
const logger = require('../utils/logger');
const QRCode = require('qrcode');
const ExcelJS = require('exceljs');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    const { type, status, search, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (type) query.type = type;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('registeredStudents', 'name rollNo email')
      .populate('createdBy', 'name email');

    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      data: events
    });
  } catch (error) {
    logger.error('Error getting events:', error);
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('registeredStudents', 'name rollNo email')
      .populate('createdBy', 'name email')
      .populate('budget');

    if (!event || !event.isActive) {
      return next(new ErrorResponse('Event not found', 404));
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    logger.error('Error getting event:', error);
    next(error);
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private (Admin, Committee)
exports.createEvent = async (req, res, next) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    logger.error('Error creating event:', error);
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin, Committee)
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event || !event.isActive) {
      return next(new ErrorResponse('Event not found', 404));
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    logger.error('Error updating event:', error);
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin, Committee)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || !event.isActive) {
      return next(new ErrorResponse('Event not found', 404));
    }

    event.isActive = false;
    await event.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error('Error deleting event:', error);
    next(error);
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private (Student)
exports.registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || !event.isActive) {
      return next(new ErrorResponse('Event not found', 404));
    }

    if (event.status !== 'upcoming') {
      return next(new ErrorResponse('Event registration is closed', 400));
    }

    if (event.registeredStudents.length >= event.maxCapacity) {
      return next(new ErrorResponse('Event is full', 400));
    }

    if (event.registeredStudents.includes(req.user.id)) {
      return next(new ErrorResponse('Already registered for this event', 400));
    }

    event.registeredStudents.push(req.user.id);
    await event.save();

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    logger.error('Error registering for event:', error);
    next(error);
  }
};

// @desc    Check in to event
// @route   POST /api/events/:id/checkin
// @access  Private (Admin, Committee)
exports.checkIn = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event || !event.isActive) {
      return next(new ErrorResponse('Event not found', 404));
    }

    if (!event.registeredStudents.includes(studentId)) {
      return next(new ErrorResponse('Student is not registered for this event', 400));
    }

    const existingCheckIn = event.checkIns.find(checkIn => checkIn.student.toString() === studentId);
    if (existingCheckIn) {
      return next(new ErrorResponse('Student has already checked in', 400));
    }

    event.checkIns.push({
      student: studentId,
      timestamp: Date.now()
    });

    await event.save();

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    logger.error('Error checking in to event:', error);
    next(error);
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
    const { startDate, endDate } = req.query;
    const query = { isActive: true };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const events = await Event.find(query)
      .populate('registeredStudents')
      .populate('checkIns.student');

    const analytics = {
      totalEvents: events.length,
      totalRegistrations: events.reduce((acc, event) => acc + event.registeredStudents.length, 0),
      totalCheckIns: events.reduce((acc, event) => acc + event.checkIns.length, 0),
      eventsByType: {},
      attendanceRate: 0
    };

    events.forEach(event => {
      analytics.eventsByType[event.type] = (analytics.eventsByType[event.type] || 0) + 1;
    });

    if (analytics.totalRegistrations > 0) {
      analytics.attendanceRate = (analytics.totalCheckIns / analytics.totalRegistrations) * 100;
    }

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    logger.error('Error getting event analytics:', error);
    next(error);
  }
};

// @desc    Export events to Excel
// @route   GET /api/events/export
// @access  Private (Admin, Committee)
exports.exportEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ isActive: true })
      .populate('registeredStudents', 'name rollNo email')
      .populate('createdBy', 'name email');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Events');

    worksheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Time', key: 'time', width: 15 },
      { header: 'Venue', key: 'venue', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Registrations', key: 'registrations', width: 15 },
      { header: 'Check-ins', key: 'checkIns', width: 15 },
      { header: 'Created By', key: 'createdBy', width: 30 }
    ];

    events.forEach(event => {
      worksheet.addRow({
        title: event.title,
        type: event.type,
        date: event.date.toISOString().split('T')[0],
        time: event.time,
        venue: event.venue,
        status: event.status,
        registrations: event.registeredStudents.length,
        checkIns: event.checkIns.length,
        createdBy: event.createdBy.name
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=events.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    logger.error('Error exporting events:', error);
    next(error);
  }
}; 