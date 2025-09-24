const Expense = require('../model/expenseModel');

const getUserAnalytics = async (req, res) => {
  try {
    console.log('=== ANALYTICS BACKEND ===');
    console.log('User from token:', req.user);
    const userId = req.user._id;
    console.log('User ID:', userId);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get last 30 days expenses where user is involved
    const expenses = await Expense.find({
      $or: [
        { 'paidBy.userId': userId },
        { 'splitMember.userId': userId }
      ],
      createdAt: { $gte: thirtyDaysAgo }
    }).populate('paidBy.userId', 'name').populate('splitMember.userId', 'name').populate('groupId', 'name');

    // Calculate total amount user was involved in
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Category breakdown (using description as category)
    const categoryStats = expenses.reduce((stats, exp) => {
      const category = exp.description.toLowerCase().includes('food') ? 'Food' :
                      exp.description.toLowerCase().includes('transport') ? 'Transport' :
                      exp.description.toLowerCase().includes('entertainment') ? 'Entertainment' :
                      exp.description.toLowerCase().includes('utility') ? 'Utilities' : 'Other';
      stats[category] = (stats[category] || 0) + exp.amount;
      return stats;
    }, {});

    const categoryBreakdown = Object.entries(categoryStats).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalAmount > 0 ? ((amount / totalAmount) * 100).toFixed(1) : 0
    }));

    // Group spending analysis
    const groupStats = expenses.reduce((stats, exp) => {
      const groupName = exp.groupId?.name || 'Unknown Group';
      stats[groupName] = (stats[groupName] || 0) + exp.amount;
      return stats;
    }, {});

    const groupSpending = Object.entries(groupStats).map(([group, amount]) => ({
      group,
      amount,
      percentage: totalAmount > 0 ? ((amount / totalAmount) * 100).toFixed(1) : 0
    }));

    // Monthly trends
    const monthlyTrend = {
      totalSpent: totalAmount,
      totalExpenses: expenses.length,
      avgPerExpense: expenses.length > 0 ? (totalAmount / expenses.length).toFixed(2) : 0,
      topCategory: categoryBreakdown.length > 0 ? categoryBreakdown.sort((a, b) => b.amount - a.amount)[0].category : 'None'
    };

    res.json({
      success: true,
      data: {
        categoryBreakdown: categoryBreakdown.sort((a, b) => b.amount - a.amount),
        groupSpending: groupSpending.sort((a, b) => b.amount - a.amount),
        monthlyTrend
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getUserAnalytics };