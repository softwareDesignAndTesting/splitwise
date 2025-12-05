const ExpenseSheet = require('../model/expenseSheetModel');

/**
 * Settlement Repository - Implements Repository Pattern
 * Abstracts data access logic for Settlement operations
 * Follows Dependency Inversion Principle
 */
class SettlementRepository {
  async create(settlementData) {
    return await ExpenseSheet.create(settlementData);
  }

  async findUnsettledByGroup(groupId) {
    return await ExpenseSheet.find({
      groupId,
      settled: false
    });
  }

  async findByUserAndGroup(groupId, userId) {
    return await ExpenseSheet.find({
      groupId,
      $or: [
        { userId },
        { payerId: userId }
      ]
    })
      .populate('userId', 'name email')
      .populate('payerId', 'name email')
      .sort({ createdAt: -1 });
  }

  async deleteUnsettledByGroup(groupId) {
    return await ExpenseSheet.deleteMany({ groupId, settled: false });
  }

  async markAsSettled(id) {
    return await ExpenseSheet.findByIdAndUpdate(
      id,
      { settled: true, updatedAt: new Date() },
      { new: true }
    );
  }

  async findById(id) {
    return await ExpenseSheet.findById(id);
  }
}

module.exports = new SettlementRepository();

