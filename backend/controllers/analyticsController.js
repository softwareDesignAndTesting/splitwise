const Expense = require('../model/expenseModel');

const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const expenses = await Expense.find({
      $or: [
        { 'paidBy.userId': userId },
        { 'splitMember.userId': userId }
      ]
    }).populate('paidBy.userId', 'name')
      .populate('splitMember.userId', 'name')
      .populate('groupId', 'name');

    if (expenses.length === 0) {
      return res.json({
        success: true,
        data: {
          categoryBreakdown: [],
          groupSpending: [],
          monthlyTrend: {
            totalSpent: 0,
            totalExpenses: 0,
            avgPerExpense: 0,
            topCategory: 'None'
          }
        }
      });
    }

    let totalUserSpending = 0;
    const categoryStats = {};
    const groupStats = {};

    expenses.forEach(exp => {
      const userSplit = exp.splitMember.find(member => 
        member.userId._id.toString() === userId.toString()
      );
      
      if (userSplit) {
        const userAmount = userSplit.amount || (exp.amount / exp.splitMember.length);
        totalUserSpending += userAmount;

        const desc = exp.description.toLowerCase();
        let category = 'Other';
        
        if (desc.includes('food') || desc.includes('lunch') || desc.includes('dinner') || 
            desc.includes('restaurant') || desc.includes('meal') || desc.includes('cafe')) {
          category = 'Food';
        } else if (desc.includes('transport') || desc.includes('taxi') || desc.includes('bus') || 
                   desc.includes('flight') || desc.includes('uber') || desc.includes('travel')) {
          category = 'Transport';
        } else if (desc.includes('entertainment') || desc.includes('movie') || desc.includes('game') || 
                   desc.includes('party') || desc.includes('club') || desc.includes('fun')) {
          category = 'Entertainment';
        } else if (desc.includes('utility') || desc.includes('electricity') || desc.includes('water') || 
                   desc.includes('internet') || desc.includes('bill') || desc.includes('rent')) {
          category = 'Utilities';
        } else if (desc.includes('grocery') || desc.includes('shopping') || desc.includes('market')) {
          category = 'Shopping';
        }

        categoryStats[category] = (categoryStats[category] || 0) + userAmount;

        const groupName = exp.groupId?.name || 'Unknown Group';
        groupStats[groupName] = (groupStats[groupName] || 0) + userAmount;
      }
    });

    const categoryBreakdown = Object.entries(categoryStats).map(([category, amount]) => ({
      category,
      amount: Math.round(amount),
      percentage: totalUserSpending > 0 ? ((amount / totalUserSpending) * 100).toFixed(1) : '0'
    })).sort((a, b) => b.amount - a.amount);

    const groupSpending = Object.entries(groupStats).map(([group, amount]) => ({
      group,
      amount: Math.round(amount),
      percentage: totalUserSpending > 0 ? ((amount / totalUserSpending) * 100).toFixed(1) : '0'
    })).sort((a, b) => b.amount - a.amount);

    const monthlyTrend = {
      totalSpent: Math.round(totalUserSpending),
      totalExpenses: expenses.length,
      avgPerExpense: expenses.length > 0 ? Math.round(totalUserSpending / expenses.length) : 0,
      topCategory: categoryBreakdown.length > 0 ? categoryBreakdown[0].category : 'None'
    };

    res.json({
      success: true,
      data: {
        categoryBreakdown,
        groupSpending,
        monthlyTrend
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getGroupAnalytics = async (req, res) => {
  try {
    const { groupId } = req.params;
    
    const expenses = await Expense.find({ groupId })
      .populate('paidBy.userId', 'name')
      .populate('splitMember.userId', 'name')
      .populate('groupId', 'name');

    if (expenses.length === 0) {
      return res.json({
        success: true,
        data: {
          totalExpenses: 0,
          totalAmount: 0,
          memberContributions: [],
          expensesByCategory: []
        }
      });
    }

    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const memberStats = {};
    const categoryStats = {};

    expenses.forEach(exp => {
      exp.paidBy.forEach(payer => {
        const memberName = payer.userId.name;
        memberStats[memberName] = (memberStats[memberName] || 0) + payer.amount;
      });

      const desc = exp.description.toLowerCase();
      let category = 'Other';
      
      if (desc.includes('food') || desc.includes('lunch') || desc.includes('dinner') || 
          desc.includes('restaurant') || desc.includes('meal')) {
        category = 'Food';
      } else if (desc.includes('transport') || desc.includes('taxi') || desc.includes('flight') || 
                 desc.includes('travel')) {
        category = 'Transport';
      } else if (desc.includes('entertainment') || desc.includes('movie') || desc.includes('party')) {
        category = 'Entertainment';
      } else if (desc.includes('utility') || desc.includes('electricity') || desc.includes('bill')) {
        category = 'Utilities';
      } else if (desc.includes('grocery') || desc.includes('shopping')) {
        category = 'Shopping';
      }

      categoryStats[category] = (categoryStats[category] || 0) + exp.amount;
    });

    const memberContributions = Object.entries(memberStats).map(([member, amount]) => ({
      member,
      amount: Math.round(amount),
      percentage: ((amount / totalAmount) * 100).toFixed(1)
    })).sort((a, b) => b.amount - a.amount);

    const expensesByCategory = Object.entries(categoryStats).map(([category, amount]) => ({
      category,
      amount: Math.round(amount),
      percentage: ((amount / totalAmount) * 100).toFixed(1)
    })).sort((a, b) => b.amount - a.amount);

    res.json({
      success: true,
      data: {
        totalExpenses: expenses.length,
        totalAmount: Math.round(totalAmount),
        memberContributions,
        expensesByCategory
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getUserAnalytics, getGroupAnalytics };