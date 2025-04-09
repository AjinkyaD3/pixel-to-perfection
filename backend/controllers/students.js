const { validationResult } = require('express-validator');
const csv = require('fast-csv');
const Student = require('../models/Student');
const ErrorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');

// @desc    Get all students with pagination and filters
// @route   GET /api/students
// @access  Private
exports.getStudents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = { isActive: true };
    
    // Add filters if provided
    if (req.query.year) query.year = req.query.year;
    if (req.query.division) query.division = req.query.division;
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { rollNo: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Student.countDocuments(query);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return next(new ErrorResponse('Student not found', 404));
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private
exports.createStudent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    // Check if student with same roll number or email exists
    const existingStudent = await Student.findOne({
      $or: [
        { rollNo: req.body.rollNo },
        { email: req.body.email }
      ]
    });

    if (existingStudent) {
      return next(new ErrorResponse('Student with this roll number or email already exists', 400));
    }

    const student = await Student.create(req.body);

    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private
exports.updateStudent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    let student = await Student.findById(req.params.id);
    
    if (!student) {
      return next(new ErrorResponse('Student not found', 404));
    }

    // Check if email is being updated and is unique
    if (req.body.email && req.body.email !== student.email) {
      const existingStudent = await Student.findOne({ email: req.body.email });
      if (existingStudent) {
        return next(new ErrorResponse('Email already exists', 400));
      }
    }

    student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return next(new ErrorResponse('Student not found', 404));
    }

    // Soft delete by setting isActive to false
    student.isActive = false;
    await student.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload students via CSV
// @route   POST /api/students/upload
// @access  Private
exports.uploadStudents = async (req, res, next) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return next(new ErrorResponse(validationErrors.array()[0].msg, 400));
    }

    const file = req.files.file;
    const students = [];
    const uploadErrors = [];

    const stream = csv.parse({ headers: true })
      .on('data', (data) => {
        students.push({
          name: data.name,
          rollNo: data.rollNo,
          division: data.division,
          year: data.year,
          email: data.email,
          skills: data.skills ? data.skills.split(',').map(skill => skill.trim()) : []
        });
      })
      .on('end', async () => {
        for (const student of students) {
          try {
            const existingStudent = await Student.findOne({
              $or: [
                { rollNo: student.rollNo },
                { email: student.email }
              ]
            });

            if (existingStudent) {
              uploadErrors.push(`Student with roll number ${student.rollNo} or email ${student.email} already exists`);
              continue;
            }

            await Student.create(student);
          } catch (error) {
            uploadErrors.push(`Error creating student ${student.rollNo}: ${error.message}`);
          }
        }

        res.status(200).json({
          success: true,
          data: {
            totalProcessed: students.length,
            successCount: students.length - uploadErrors.length,
            errorCount: uploadErrors.length,
            errors: uploadErrors
          }
        });
      });

    stream.write(file.data);
    stream.end();
  } catch (error) {
    next(error);
  }
}; 