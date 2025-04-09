const csv = require('csv-parse');
const logger = require('../utils/logger');

/**
 * Parse CSV file buffer and return array of student objects
 * @param {Buffer} fileBuffer - The CSV file buffer
 * @returns {Promise<Array>} Array of student objects
 */
const parseStudentCSV = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const students = [];
    const parser = csv({
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    // Handle parsing
    parser.on('readable', () => {
      let record;
      while ((record = parser.read())) {
        // Transform CSV record to student object
        const student = {
          name: record.name,
          rollNo: record.rollNo,
          division: record.division,
          year: record.year,
          email: record.email,
          skills: record.skills ? record.skills.split(',').map(skill => skill.trim()) : []
        };

        // Validate required fields
        if (!student.name || !student.rollNo || !student.division || !student.year || !student.email) {
          throw new Error(`Missing required fields in row: ${JSON.stringify(record)}`);
        }

        // Validate roll number format
        if (!/^[0-9]{8}$/.test(student.rollNo)) {
          throw new Error(`Invalid roll number format in row: ${JSON.stringify(record)}`);
        }

        // Validate division
        if (!['A', 'B', 'C'].includes(student.division)) {
          throw new Error(`Invalid division in row: ${JSON.stringify(record)}`);
        }

        // Validate year
        if (!['FE', 'SE', 'TE', 'BE'].includes(student.year)) {
          throw new Error(`Invalid year in row: ${JSON.stringify(record)}`);
        }

        // Validate email format
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(student.email)) {
          throw new Error(`Invalid email format in row: ${JSON.stringify(record)}`);
        }

        students.push(student);
      }
    });

    // Handle errors
    parser.on('error', (error) => {
      logger.error('Error parsing CSV:', error);
      reject(new Error('Failed to parse CSV file'));
    });

    // Handle end of parsing
    parser.on('end', () => {
      resolve(students);
    });

    // Write buffer to parser
    parser.write(fileBuffer);
    parser.end();
  });
};

/**
 * Validate CSV file headers
 * @param {Array} headers - Array of CSV headers
 * @returns {boolean} Whether headers are valid
 */
const validateHeaders = (headers) => {
  const requiredHeaders = ['name', 'rollNo', 'division', 'year', 'email'];
  const optionalHeaders = ['skills'];
  const validHeaders = [...requiredHeaders, ...optionalHeaders];

  // Check if all required headers are present
  const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
  }

  // Check if there are any invalid headers
  const invalidHeaders = headers.filter(header => !validHeaders.includes(header));
  if (invalidHeaders.length > 0) {
    throw new Error(`Invalid headers found: ${invalidHeaders.join(', ')}`);
  }

  return true;
};

/**
 * Process CSV file and return validated student data
 * @param {Buffer} fileBuffer - The CSV file buffer
 * @returns {Promise<Array>} Array of validated student objects
 */
const processStudentCSV = async (fileBuffer) => {
  try {
    // Parse CSV and get student data
    const students = await parseStudentCSV(fileBuffer);

    // Validate headers if there are any records
    if (students.length > 0) {
      const headers = Object.keys(students[0]);
      validateHeaders(headers);
    }

    return students;
  } catch (error) {
    logger.error('Error processing CSV:', error);
    throw error;
  }
};

module.exports = {
  processStudentCSV
}; 