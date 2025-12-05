const Expense = require('../model/expenseModel');

/**
 * Expense Repository - Implements Repository Pattern
 * Abstracts data access logic for Expense operations
 * Follows Dependency Inversion Principle
 */
class ExpenseRepository {
  async create(expenseData) {
    return await Expense.create(expenseData);
  }

  async findById(id) {
    return await Expense.findById(id)
      .populate('groupId', 'name')
      .populate('paidBy.userId', 'name email')
      .populate('splitMember.userId', 'name email');
  }

  async findAll() {
    return await Expense.find()
      .populate('groupId', 'name')
      .populate('paidBy.userId', 'name email')
      .populate('splitMember', 'name email')
      .sort({ createdAt: -1 });
  }

  async findByGroup(groupId) {
    return await Expense.find({ groupId })
      .populate('groupId', 'name')
      .populate('paidBy.userId', 'name email')
      .populate('splitMember', 'name email')
      .sort({ createdAt: -1 });
  }

  async findByUserInvolvement(userId) {
    return await Expense.find({
      $or: [
        { 'paidBy.userId': userId },
        { splitMember: userId }
      ]
    })
    .populate('groupId', 'name')
    .populate('paidBy.userId', 'name email')
    .populate('splitMember', 'name email')
    .sort({ createdAt: -1 });
  }

  async update(id, updateData) {
    return await Expense.findByIdAndUpdate(id, updateData, { new: true })
      .populate('groupId', 'name')
      .populate('paidBy.userId', 'name email')
      .populate('splitMember', 'name email');
  }

  async delete(id) {
    return await Expense.findByIdAndDelete(id);
  }

  async exists(id) {
    const expense = await Expense.findById(id);
    return !!expense;
  }
}

module.exports = new ExpenseRepository();

