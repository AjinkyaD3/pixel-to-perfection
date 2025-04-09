const { io } = require('../server');
const Announcement = require('../models/Announcement');
const Student = require('../models/Student');
const Member = require('../models/Member');

class NotificationService {
  static async sendAnnouncement(announcement) {
    try {
      // Get target audience
      let recipients = [];
      
      switch (announcement.targetAudience) {
        case 'all':
          // Get all active students and committee members
          const [students, members] = await Promise.all([
            Student.find({ isActive: true }).select('_id'),
            Member.find({ isActive: true }).select('_id')
          ]);
          recipients = [...students, ...members];
          break;
          
        case 'students':
          recipients = await Student.find({ isActive: true }).select('_id');
          break;
          
        case 'committee':
          recipients = await Member.find({ isActive: true }).select('_id');
          break;
          
        case 'specific_year':
          recipients = await Student.find({ 
            isActive: true,
            year: announcement.year 
          }).select('_id');
          break;
      }

      // Send announcement to each recipient
      recipients.forEach(recipient => {
        io.to(recipient._id.toString()).emit('newAnnouncement', {
          announcement: {
            _id: announcement._id,
            title: announcement.title,
            content: announcement.content,
            type: announcement.type,
            createdAt: announcement.createdAt
          }
        });
      });

      return true;
    } catch (error) {
      throw new Error('Failed to send announcement');
    }
  }

  static async sendEventNotification(event, type) {
    try {
      // Get registered students for the event
      const students = await Student.find({
        _id: { $in: event.registeredStudents },
        isActive: true
      }).select('_id');

      // Send notification to each registered student
      students.forEach(student => {
        io.to(student._id.toString()).emit('eventNotification', {
          event: {
            _id: event._id,
            title: event.title,
            type: type,
            date: event.date,
            time: event.time
          }
        });
      });

      return true;
    } catch (error) {
      throw new Error('Failed to send event notification');
    }
  }

  static async sendBudgetNotification(budget, type) {
    try {
      // Get committee members with financial roles
      const members = await Member.find({
        role: { $in: ['Treasurer', 'President'] },
        isActive: true
      }).select('_id');

      // Send notification to each member
      members.forEach(member => {
        io.to(member._id.toString()).emit('budgetNotification', {
          budget: {
            _id: budget._id,
            eventId: budget.eventId,
            type: type,
            totalAmount: budget.totalAmount,
            spentAmount: budget.spentAmount
          }
        });
      });

      return true;
    } catch (error) {
      throw new Error('Failed to send budget notification');
    }
  }
}

module.exports = NotificationService; 