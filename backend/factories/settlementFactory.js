const settlementRepository = require('../repositories/settlementRepository');

/**
 * Settlement Factory Pattern - Implements Factory Pattern
 * Creates different types of settlement objects based on context
 * Follows Open/Closed Principle - can be extended with new settlement types
 */

/**
 * Base Settlement class
 */
class Settlement {
  constructor(from, to, amount, groupId) {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.groupId = groupId;
    this.settled = false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save() {
    return await settlementRepository.create({
      userId: this.from,
      payerId: this.to,
      groupId: this.groupId,
      amountToPay: this.amount,
      settled: this.settled,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    });
  }
}

/**
 * Standard Settlement - Regular debt settlement
 */
class StandardSettlement extends Settlement {
  constructor(from, to, amount, groupId) {
    super(from, to, amount, groupId);
    this.type = 'standard';
  }
}

/**
 * Partial Settlement - For partial payments
 */
class PartialSettlement extends Settlement {
  constructor(from, to, amount, groupId, originalAmount) {
    super(from, to, amount, groupId);
    this.type = 'partial';
    this.originalAmount = originalAmount;
    this.remainingAmount = originalAmount - amount;
  }
}

/**
 * Settlement Factory - Creates appropriate settlement type
 */
class SettlementFactory {
  /**
   * Create a standard settlement
   * @param {String} from - User ID who owes money
   * @param {String} to - User ID who is owed money
   * @param {Number} amount - Settlement amount
   * @param {String} groupId - Group ID
   * @returns {StandardSettlement}
   */
  static createStandardSettlement(from, to, amount, groupId) {
    return new StandardSettlement(from, to, amount, groupId);
  }

  /**
   * Create a partial settlement
   * @param {String} from - User ID who owes money
   * @param {String} to - User ID who is owed money
   * @param {Number} amount - Partial payment amount
   * @param {String} groupId - Group ID
   * @param {Number} originalAmount - Original debt amount
   * @returns {PartialSettlement}
   */
  static createPartialSettlement(from, to, amount, groupId, originalAmount) {
    return new PartialSettlement(from, to, amount, groupId, originalAmount);
  }

  /**
   * Create settlement based on context
   * @param {String} from - User ID who owes money
   * @param {String} to - User ID who is owed money
   * @param {Number} amount - Settlement amount
   * @param {String} groupId - Group ID
   * @param {Object} options - Additional options (originalAmount for partial)
   * @returns {Settlement}
   */
  static createSettlement(from, to, amount, groupId, options = {}) {
    if (options.originalAmount && options.originalAmount > amount) {
      return this.createPartialSettlement(from, to, amount, groupId, options.originalAmount);
    }
    return this.createStandardSettlement(from, to, amount, groupId);
  }

  /**
   * Create multiple settlements from settlement data array
   * @param {Array} settlementsData - Array of {from, to, amount, groupId}
   * @returns {Array<Settlement>}
   */
  static createSettlements(settlementsData) {
    return settlementsData.map(data => 
      this.createSettlement(data.from, data.to, data.amount, data.groupId, data.options || {})
    );
  }
}

module.exports = {
  Settlement,
  StandardSettlement,
  PartialSettlement,
  SettlementFactory
};

