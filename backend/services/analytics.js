const Student = require('../models/Student');
const Event = require('../models/Event');
const Budget = require('../models/Budget');
const Registration = require('../models/Registration');
const logger = require('../utils/logger');

/**
 * Get dashboard overview statistics
 * @returns {Promise<Object>} Dashboard statistics
 */
const getDashboardStats = async () => {
  try {
    const totalStudents = await Student.countDocuments({ isActive: true });
    const totalEvents = await Event.countDocuments({ isActive: true });
    const upcomingEvents = await Event.countDocuments({
      isActive: true,
      status: 'upcoming',
      date: { $gte: new Date() }
    });
    const totalRegistrations = await Registration.countDocuments({ isActive: true });

    const recentEvents = await Event.find({ isActive: true })
      .sort({ date: -1 })
      .limit(5)
      .select('title date venue status');

    const stats = {
      totalStudents,
      totalEvents,
      upcomingEvents,
      totalRegistrations,
      recentEvents
    };

    return stats;
  } catch (error) {
    logger.error('Error getting dashboard stats:', error);
    throw new Error('Failed to get dashboard statistics');
  }
};

/**
 * Get student skills analytics
 * @returns {Promise<Array>} Skills statistics
 */
const getSkillsAnalytics = async () => {
  try {
    const skillsStats = await Student.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$skills' },
      {
        $group: {
          _id: '$skills',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return skillsStats;
  } catch (error) {
    logger.error('Error getting skills analytics:', error);
    throw new Error('Failed to get skills statistics');
  }
};

/**
 * Get event participation analytics
 * @returns {Promise<Object>} Participation statistics
 */
const getParticipationAnalytics = async () => {
  try {
    const yearWiseStats = await Registration.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'students',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $group: {
          _id: '$student.year',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const eventTypeStats = await Event.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalRegistrations: { $sum: { $size: '$registeredStudents' } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const monthlyStats = await Registration.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: {
            year: { $year: '$registrationDate' },
            month: { $month: '$registrationDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return {
      yearWiseParticipation: yearWiseStats,
      eventTypeDistribution: eventTypeStats,
      monthlyRegistrations: monthlyStats
    };
  } catch (error) {
    logger.error('Error getting participation analytics:', error);
    throw new Error('Failed to get participation statistics');
  }
};

/**
 * Get budget utilization analytics
 * @returns {Promise<Object>} Budget statistics
 */
const getBudgetAnalytics = async () => {
  try {
    const totalBudget = await Budget.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
          spent: { $sum: '$spentAmount' }
        }
      }
    ]);

    const categoryWiseExpenses = await Budget.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$expenses' },
      {
        $group: {
          _id: '$expenses.category',
          totalAmount: { $sum: '$expenses.amount' }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    const monthlyExpenses = await Budget.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$expenses' },
      {
        $group: {
          _id: {
            year: { $year: '$expenses.date' },
            month: { $month: '$expenses.date' }
          },
          totalAmount: { $sum: '$expenses.amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return {
      totalBudget: totalBudget[0] || { total: 0, spent: 0 },
      categoryWiseExpenses,
      monthlyExpenses
    };
  } catch (error) {
    logger.error('Error getting budget analytics:', error);
    throw new Error('Failed to get budget statistics');
  }
};

/**
 * Get event count analytics
 * @returns {Promise<Object>} Event count statistics
 */
const getEventCountAnalytics = async () => {
  try {
    const statusWiseCount = await Event.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyCount = await Event.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const typeWiseCount = await Event.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return {
      statusWiseCount,
      monthlyCount,
      typeWiseCount
    };
  } catch (error) {
    logger.error('Error getting event count analytics:', error);
    throw new Error('Failed to get event count statistics');
  }
};

module.exports = {
  getDashboardStats,
  getSkillsAnalytics,
  getParticipationAnalytics,
  getBudgetAnalytics,
  getEventCountAnalytics
}; 