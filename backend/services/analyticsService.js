const Event = require('../models/Event');
const Budget = require('../models/Budget');
const Student = require('../models/Student');
const Member = require('../models/Member');

class AnalyticsService {
  static async getEventAnalytics() {
    try {
      const events = await Event.find({ isActive: true });
      
      const analytics = {
        totalEvents: events.length,
        eventsByType: {},
        attendance: {
          total: 0,
          average: 0
        },
        upcomingEvents: 0,
        completedEvents: 0
      };

      events.forEach(event => {
        // Count events by type
        analytics.eventsByType[event.type] = (analytics.eventsByType[event.type] || 0) + 1;
        
        // Calculate attendance
        analytics.attendance.total += event.checkIns.length;
        
        // Count upcoming and completed events
        if (event.status === 'upcoming') {
          analytics.upcomingEvents++;
        } else if (event.status === 'completed') {
          analytics.completedEvents++;
        }
      });

      // Calculate average attendance
      analytics.attendance.average = analytics.totalEvents > 0 
        ? analytics.attendance.total / analytics.totalEvents 
        : 0;

      return analytics;
    } catch (error) {
      throw new Error('Failed to generate event analytics');
    }
  }

  static async getBudgetAnalytics() {
    try {
      const budgets = await Budget.find({ isActive: true });
      
      const analytics = {
        totalBudget: 0,
        totalSpent: 0,
        expensesByCategory: {},
        pendingExpenses: 0,
        approvedExpenses: 0
      };

      budgets.forEach(budget => {
        analytics.totalBudget += budget.totalAmount;
        analytics.totalSpent += budget.spentAmount;
        
        // Count expenses by category
        budget.expenses.forEach(expense => {
          analytics.expensesByCategory[expense.category] = 
            (analytics.expensesByCategory[expense.category] || 0) + expense.amount;
          
          // Count pending and approved expenses
          if (expense.status === 'pending') {
            analytics.pendingExpenses++;
          } else if (expense.status === 'approved') {
            analytics.approvedExpenses++;
          }
        });
      });

      return analytics;
    } catch (error) {
      throw new Error('Failed to generate budget analytics');
    }
  }

  static async getStudentAnalytics() {
    try {
      const students = await Student.find({ isActive: true });
      
      const analytics = {
        totalStudents: students.length,
        studentsByYear: {},
        studentsByDivision: {},
        averageSkills: 0,
        totalEventsAttended: 0
      };

      let totalSkills = 0;
      let totalEvents = 0;

      students.forEach(student => {
        // Count students by year
        analytics.studentsByYear[student.year] = 
          (analytics.studentsByYear[student.year] || 0) + 1;
        
        // Count students by division
        analytics.studentsByDivision[student.division] = 
          (analytics.studentsByDivision[student.division] || 0) + 1;
        
        // Calculate total skills and events
        totalSkills += student.skills.length;
        totalEvents += student.events.length;
      });

      // Calculate averages
      analytics.averageSkills = analytics.totalStudents > 0 
        ? totalSkills / analytics.totalStudents 
        : 0;
      
      analytics.totalEventsAttended = totalEvents;

      return analytics;
    } catch (error) {
      throw new Error('Failed to generate student analytics');
    }
  }

  static async getMemberAnalytics() {
    try {
      const members = await Member.find({ isActive: true });
      
      const analytics = {
        totalMembers: members.length,
        membersByRole: {},
        averageSkills: 0
      };

      let totalSkills = 0;

      members.forEach(member => {
        // Count members by role
        analytics.membersByRole[member.role] = 
          (analytics.membersByRole[member.role] || 0) + 1;
        
        // Calculate total skills
        totalSkills += member.skills.length;
      });

      // Calculate average skills
      analytics.averageSkills = analytics.totalMembers > 0 
        ? totalSkills / analytics.totalMembers 
        : 0;

      return analytics;
    } catch (error) {
      throw new Error('Failed to generate member analytics');
    }
  }
}

module.exports = AnalyticsService; 