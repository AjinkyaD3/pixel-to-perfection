const ExcelJS = require('exceljs');
const logger = require('../utils/logger');

/**
 * Generate an Excel file for student data
 * @param {Array} students - Array of student objects
 * @returns {Promise<Buffer>} The Excel file buffer
 */
const generateStudentExcel = async (students) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');

    // Add headers
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Roll No', key: 'rollNo', width: 15 },
      { header: 'Division', key: 'division', width: 10 },
      { header: 'Year', key: 'year', width: 10 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'Skills', key: 'skills', width: 40 }
    ];

    // Style headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Add data
    students.forEach(student => {
      worksheet.addRow({
        name: student.name,
        rollNo: student.rollNo,
        division: student.division,
        year: student.year,
        email: student.email,
        skills: student.skills ? student.skills.join(', ') : ''
      });
    });

    // Style cells
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.alignment = { vertical: 'middle', horizontal: 'left' };
      }
    });

    // Generate buffer
    return await workbook.xlsx.writeBuffer();
  } catch (error) {
    logger.error('Error generating student Excel:', error);
    throw new Error('Failed to generate student Excel');
  }
};

/**
 * Generate an Excel file for event data
 * @param {Array} events - Array of event objects
 * @returns {Promise<Buffer>} The Excel file buffer
 */
const generateEventExcel = async (events) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Events');

    // Add headers
    worksheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Time', key: 'time', width: 10 },
      { header: 'Venue', key: 'venue', width: 20 },
      { header: 'Speaker', key: 'speaker', width: 20 },
      { header: 'Max Capacity', key: 'maxCapacity', width: 15 },
      { header: 'Registered', key: 'registered', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    // Style headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Add data
    events.forEach(event => {
      worksheet.addRow({
        title: event.title,
        type: event.type,
        date: new Date(event.date).toLocaleDateString(),
        time: event.time,
        venue: event.venue,
        speaker: event.speaker ? event.speaker.name : '',
        maxCapacity: event.maxCapacity,
        registered: event.registeredStudents ? event.registeredStudents.length : 0,
        status: event.status
      });
    });

    // Style cells
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.alignment = { vertical: 'middle', horizontal: 'left' };
      }
    });

    // Generate buffer
    return await workbook.xlsx.writeBuffer();
  } catch (error) {
    logger.error('Error generating event Excel:', error);
    throw new Error('Failed to generate event Excel');
  }
};

/**
 * Generate an Excel file for budget data
 * @param {Array} budgets - Array of budget objects
 * @returns {Promise<Buffer>} The Excel file buffer
 */
const generateBudgetExcel = async (budgets) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Budgets');

    // Add headers
    worksheet.columns = [
      { header: 'Event', key: 'event', width: 30 },
      { header: 'Total Amount', key: 'totalAmount', width: 15 },
      { header: 'Spent Amount', key: 'spentAmount', width: 15 },
      { header: 'Remaining', key: 'remaining', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    // Style headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Add data
    budgets.forEach(budget => {
      worksheet.addRow({
        event: budget.eventId ? budget.eventId.title : '',
        totalAmount: budget.totalAmount,
        spentAmount: budget.spentAmount,
        remaining: budget.totalAmount - budget.spentAmount,
        status: budget.status
      });
    });

    // Add expenses worksheet
    const expensesSheet = workbook.addWorksheet('Expenses');
    expensesSheet.columns = [
      { header: 'Event', key: 'event', width: 30 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Paid By', key: 'paidBy', width: 20 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    // Style headers
    expensesSheet.getRow(1).font = { bold: true };
    expensesSheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Add expenses data
    budgets.forEach(budget => {
      if (budget.expenses && budget.expenses.length > 0) {
        budget.expenses.forEach(expense => {
          expensesSheet.addRow({
            event: budget.eventId ? budget.eventId.title : '',
            category: expense.category,
            amount: expense.amount,
            description: expense.description,
            date: new Date(expense.date).toLocaleDateString(),
            paidBy: expense.paidBy ? expense.paidBy.name : '',
            status: expense.status
          });
        });
      }
    });

    // Style cells
    expensesSheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.alignment = { vertical: 'middle', horizontal: 'left' };
      }
    });

    // Generate buffer
    return await workbook.xlsx.writeBuffer();
  } catch (error) {
    logger.error('Error generating budget Excel:', error);
    throw new Error('Failed to generate budget Excel');
  }
};

module.exports = {
  generateStudentExcel,
  generateEventExcel,
  generateBudgetExcel
}; 