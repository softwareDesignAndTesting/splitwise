/**
 * Split Strategy Pattern - Implements Strategy Pattern
 * Follows Open/Closed Principle - Open for extension, closed for modification
 * Each strategy handles a specific split type
 */

/**
 * Base Strategy Interface
 * All split strategies must implement this interface
 */
class SplitStrategy {
  /**
   * Calculate split amounts for each member
   * @param {Number} totalAmount - Total expense amount
   * @param {Array} members - Array of member objects with userId
   * @param {Object} options - Strategy-specific options
   * @returns {Array} Array of split member objects with calculated amounts
   */
  calculateSplit(totalAmount, members, options = {}) {
    throw new Error('calculateSplit must be implemented by subclass');
  }

  /**
   * Validate split data
   * @param {Number} totalAmount - Total expense amount
   * @param {Array} members - Array of member objects
   * @param {Object} options - Strategy-specific options
   * @returns {Object} { valid: boolean, error: string }
   */
  validate(totalAmount, members, options = {}) {
    if (!totalAmount || totalAmount <= 0) {
      return { valid: false, error: 'Amount must be positive' };
    }
    if (!members || members.length === 0) {
      return { valid: false, error: 'At least one member is required' };
    }
    return { valid: true };
  }
}

/**
 * Equal Split Strategy - Divides amount equally among all members
 */
class EqualSplitStrategy extends SplitStrategy {
  calculateSplit(totalAmount, members, options = {}) {
    const memberCount = members.length;
    const amountPerMember = totalAmount / memberCount;
    
    return members.map(member => ({
      userId: member.userId,
      amount: Math.round(amountPerMember * 100) / 100 // Round to 2 decimal places
    }));
  }

  validate(totalAmount, members, options = {}) {
    const baseValidation = super.validate(totalAmount, members, options);
    if (!baseValidation.valid) return baseValidation;
    
    return { valid: true };
  }
}

/**
 * Custom Split Strategy - Uses custom amounts provided for each member
 */
class CustomSplitStrategy extends SplitStrategy {
  calculateSplit(totalAmount, members, options = {}) {
    // Members should already have amounts specified
    return members.map(member => ({
      userId: member.userId,
      amount: parseFloat(member.amount || 0)
    }));
  }

  validate(totalAmount, members, options = {}) {
    const baseValidation = super.validate(totalAmount, members, options);
    if (!baseValidation.valid) return baseValidation;

    const totalSplit = members.reduce((sum, member) => {
      return sum + parseFloat(member.amount || 0);
    }, 0);

    if (Math.abs(totalSplit - totalAmount) > 0.01) {
      return { 
        valid: false, 
        error: `Sum of split amounts (${totalSplit}) must equal total amount (${totalAmount})` 
      };
    }

    return { valid: true };
  }
}

/**
 * Percentage Split Strategy - Divides amount based on percentages
 */
class PercentageSplitStrategy extends SplitStrategy {
  calculateSplit(totalAmount, members, options = {}) {
    return members.map(member => {
      const percentage = parseFloat(member.percentage || 0);
      const amount = (totalAmount * percentage) / 100;
      return {
        userId: member.userId,
        amount: Math.round(amount * 100) / 100
      };
    });
  }

  validate(totalAmount, members, options = {}) {
    const baseValidation = super.validate(totalAmount, members, options);
    if (!baseValidation.valid) return baseValidation;

    const totalPercentage = members.reduce((sum, member) => {
      return sum + parseFloat(member.percentage || 0);
    }, 0);

    if (Math.abs(totalPercentage - 100) > 0.01) {
      return { 
        valid: false, 
        error: `Sum of percentages (${totalPercentage}) must equal 100%` 
      };
    }

    return { valid: true };
  }
}

/**
 * Split Strategy Factory - Creates appropriate strategy based on split type
 * Implements Factory Pattern for strategy creation
 */
class SplitStrategyFactory {
  static strategies = {
    'equally': new EqualSplitStrategy(),
    'equal': new EqualSplitStrategy(),
    'custom': new CustomSplitStrategy(),
    'percentage': new PercentageSplitStrategy()
  };

  /**
   * Get strategy for given split type
   * @param {String} splitType - Type of split ('equally', 'custom', 'percentage')
   * @returns {SplitStrategy} Strategy instance
   */
  static getStrategy(splitType) {
    const strategy = this.strategies[splitType?.toLowerCase()];
    if (!strategy) {
      throw new Error(`Unknown split type: ${splitType}. Supported types: equally, custom, percentage`);
    }
    return strategy;
  }

  /**
   * Register a new strategy (for extension)
   * @param {String} type - Strategy type identifier
   * @param {SplitStrategy} strategy - Strategy instance
   */
  static registerStrategy(type, strategy) {
    if (!(strategy instanceof SplitStrategy)) {
      throw new Error('Strategy must be an instance of SplitStrategy');
    }
    this.strategies[type.toLowerCase()] = strategy;
  }
}

module.exports = {
  SplitStrategy,
  EqualSplitStrategy,
  CustomSplitStrategy,
  PercentageSplitStrategy,
  SplitStrategyFactory
};

