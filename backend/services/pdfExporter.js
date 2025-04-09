const PDFDocument = require('pdfkit');
const logger = require('../utils/logger');

/**
 * Generate a PDF report for event budget
 * @param {Object} budget - The budget object
 * @param {Object} event - The event object
 * @returns {Promise<Buffer>} The PDF buffer
 */
const generateBudgetReport = async (budget, event) => {
  try {
    const doc = new PDFDocument();
    const chunks = [];

    // Collect PDF chunks
    doc.on('data', chunk => chunks.push(chunk));

    // Header
    doc
      .fontSize(20)
      .text('Budget Report', { align: 'center' })
      .moveDown();

    // Event Details
    doc
      .fontSize(14)
      .text('Event Details')
      .moveDown(0.5);

    doc
      .fontSize(12)
      .text(`Event: ${event.title}`)
      .text(`Date: ${new Date(event.date).toLocaleDateString()}`)
      .text(`Venue: ${event.venue}`)
      .moveDown();

    // Budget Summary
    doc
      .fontSize(14)
      .text('Budget Summary')
      .moveDown(0.5);

    doc
      .fontSize(12)
      .text(`Total Budget: ₹${budget.totalAmount}`)
      .text(`Total Spent: ₹${budget.spentAmount}`)
      .text(`Remaining: ₹${budget.totalAmount - budget.spentAmount}`)
      .moveDown();

    // Expenses Table
    if (budget.expenses && budget.expenses.length > 0) {
      doc
        .fontSize(14)
        .text('Expenses')
        .moveDown(0.5);

      // Table headers
      const tableTop = doc.y;
      doc
        .fontSize(10)
        .text('Category', 50, tableTop)
        .text('Description', 150, tableTop)
        .text('Amount', 300, tableTop)
        .text('Status', 400, tableTop)
        .moveDown();

      let yPosition = doc.y;

      // Table rows
      budget.expenses.forEach(expense => {
        // Add new page if needed
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }

        doc
          .fontSize(10)
          .text(expense.category, 50, yPosition)
          .text(expense.description, 150, yPosition)
          .text(`₹${expense.amount}`, 300, yPosition)
          .text(expense.status, 400, yPosition);

        yPosition += 20;
      });
    }

    // Footer
    doc
      .fontSize(10)
      .text(
        `Generated on ${new Date().toLocaleString()}`,
        50,
        doc.page.height - 50,
        { align: 'center' }
      );

    // End the document
    doc.end();

    // Return promise that resolves with the PDF buffer
    return new Promise((resolve, reject) => {
      const pdf = Buffer.concat(chunks);
      resolve(pdf);
    });
  } catch (error) {
    logger.error('Error generating budget report:', error);
    throw new Error('Failed to generate budget report');
  }
};

/**
 * Generate a PDF report for event attendance
 * @param {Object} event - The event object
 * @param {Array} registrations - The registrations array
 * @returns {Promise<Buffer>} The PDF buffer
 */
const generateAttendanceReport = async (event, registrations) => {
  try {
    const doc = new PDFDocument();
    const chunks = [];

    // Collect PDF chunks
    doc.on('data', chunk => chunks.push(chunk));

    // Header
    doc
      .fontSize(20)
      .text('Attendance Report', { align: 'center' })
      .moveDown();

    // Event Details
    doc
      .fontSize(14)
      .text('Event Details')
      .moveDown(0.5);

    doc
      .fontSize(12)
      .text(`Event: ${event.title}`)
      .text(`Date: ${new Date(event.date).toLocaleDateString()}`)
      .text(`Venue: ${event.venue}`)
      .text(`Total Registrations: ${registrations.length}`)
      .text(`Checked In: ${registrations.filter(r => r.checkInStatus === 'checked-in').length}`)
      .moveDown();

    // Attendance Table
    if (registrations.length > 0) {
      doc
        .fontSize(14)
        .text('Attendance')
        .moveDown(0.5);

      // Table headers
      const tableTop = doc.y;
      doc
        .fontSize(10)
        .text('Name', 50, tableTop)
        .text('Roll No', 200, tableTop)
        .text('Check-in Time', 300, tableTop)
        .text('Status', 400, tableTop)
        .moveDown();

      let yPosition = doc.y;

      // Table rows
      registrations.forEach(registration => {
        // Add new page if needed
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }

        doc
          .fontSize(10)
          .text(registration.studentId.name, 50, yPosition)
          .text(registration.studentId.rollNo, 200, yPosition)
          .text(registration.checkInTime ? new Date(registration.checkInTime).toLocaleTimeString() : '-', 300, yPosition)
          .text(registration.checkInStatus, 400, yPosition);

        yPosition += 20;
      });
    }

    // Footer
    doc
      .fontSize(10)
      .text(
        `Generated on ${new Date().toLocaleString()}`,
        50,
        doc.page.height - 50,
        { align: 'center' }
      );

    // End the document
    doc.end();

    // Return promise that resolves with the PDF buffer
    return new Promise((resolve, reject) => {
      const pdf = Buffer.concat(chunks);
      resolve(pdf);
    });
  } catch (error) {
    logger.error('Error generating attendance report:', error);
    throw new Error('Failed to generate attendance report');
  }
};

module.exports = {
  generateBudgetReport,
  generateAttendanceReport
}; 