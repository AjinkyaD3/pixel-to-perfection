const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class ExportService {
  static async exportStudentsToExcel(students) {
    try {
      // Prepare data for Excel
      const data = students.map(student => ({
        'Roll No': student.rollNo,
        'Name': student.name,
        'Year': student.year,
        'Division': student.division,
        'Email': student.email,
        'Skills': student.skills.join(', '),
        'Events Attended': student.events.length
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

      // Generate Excel file
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      return buffer;
    } catch (error) {
      throw new Error('Failed to export students to Excel');
    }
  }

  static async exportEventsToExcel(events) {
    try {
      // Prepare data for Excel
      const data = events.map(event => ({
        'Title': event.title,
        'Type': event.type,
        'Date': event.date,
        'Time': event.time,
        'Venue': event.venue,
        'Speaker': event.speaker.name,
        'Capacity': event.maxCapacity,
        'Registered': event.registeredStudents.length,
        'Attended': event.checkIns.length,
        'Status': event.status
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Events');

      // Generate Excel file
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      return buffer;
    } catch (error) {
      throw new Error('Failed to export events to Excel');
    }
  }

  static async exportBudgetToPDF(budget) {
    try {
      // Create PDF document
      const doc = new PDFDocument();
      const chunks = [];

      // Collect PDF chunks
      doc.on('data', chunk => chunks.push(chunk));

      // Add content to PDF
      doc.fontSize(20).text('Budget Report', { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(14).text('Event Details');
      doc.fontSize(12).text(`Total Budget: ₹${budget.totalAmount}`);
      doc.text(`Spent Amount: ₹${budget.spentAmount}`);
      doc.text(`Remaining Amount: ₹${budget.totalAmount - budget.spentAmount}`);
      doc.moveDown();

      doc.fontSize(14).text('Expenses');
      budget.expenses.forEach(expense => {
        doc.fontSize(12).text(`Category: ${expense.category}`);
        doc.text(`Amount: ₹${expense.amount}`);
        doc.text(`Description: ${expense.description}`);
        doc.text(`Date: ${expense.date}`);
        doc.text(`Status: ${expense.status}`);
        doc.moveDown();
      });

      // Finalize PDF
      doc.end();

      // Wait for PDF to be generated
      return new Promise((resolve, reject) => {
        doc.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer);
        });
        doc.on('error', reject);
      });
    } catch (error) {
      throw new Error('Failed to export budget to PDF');
    }
  }

  static async exportAttendanceToExcel(event) {
    try {
      // Prepare data for Excel
      const data = event.checkIns.map(checkIn => ({
        'Student ID': checkIn.student.toString(),
        'Check-in Time': checkIn.timestamp
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

      // Generate Excel file
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      return buffer;
    } catch (error) {
      throw new Error('Failed to export attendance to Excel');
    }
  }
}

module.exports = ExportService; 