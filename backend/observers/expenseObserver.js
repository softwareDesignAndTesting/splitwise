/**
 * Observer Pattern Implementation
 * Allows expense-related events to notify observers (e.g., settlement recalculation)
 * Follows Open/Closed Principle - can add new observers without modifying existing code
 */

/**
 * Base Observer interface
 */
class Observer {
  update(event, data) {
    throw new Error('update method must be implemented');
  }
}

/**
 * Subject (Observable) - Expense events subject
 */
class ExpenseSubject {
  constructor() {
    this.observers = [];
  }

  /**
   * Attach an observer
   * @param {Observer} observer - Observer instance
   */
  attach(observer) {
    if (!(observer instanceof Observer)) {
      throw new Error('Observer must be an instance of Observer class');
    }
    this.observers.push(observer);
  }

  /**
   * Detach an observer
   * @param {Observer} observer - Observer instance
   */
  detach(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  /**
   * Notify all observers of an event
   * @param {String} event - Event name (e.g., 'expense.created', 'expense.updated', 'expense.deleted')
   * @param {Object} data - Event data
   */
  notify(event, data) {
    this.observers.forEach(observer => {
      try {
        observer.update(event, data);
      } catch (error) {
        console.error(`Error notifying observer:`, error);
      }
    });
  }
}

/**
 * Settlement Recalculation Observer
 * Automatically triggers settlement recalculation when expenses change
 */
class SettlementRecalculationObserver extends Observer {
  constructor(settlementService) {
    super();
    this.settlementService = settlementService;
    // Import the working utils/algo.js
    this.algoUtils = require('../utils/algo');
  }

  async update(event, data) {
    if (['expense.created', 'expense.updated', 'expense.deleted'].includes(event)) {
      const groupId = data.groupId || data.expense?.groupId;
      if (groupId) {
        try {
          console.log(`Settlement recalculation triggered by event: ${event} for group: ${groupId}`);
          
          // Use utils/algo.js for settlement calculation
          const settlements = await this.algoUtils.processGroupSettlements(groupId);
          console.log(`✅ Settlements calculated using utils/algo.js:`, settlements.length, 'settlements');
          
          // Save settlements to database
          if (settlements.length > 0) {
            const settlementRepository = require('../repositories/settlementRepository');
            
            // Clear old unsettled settlements for this group
            await settlementRepository.deleteUnsettledByGroup(groupId);
            
            // Create new settlements
            for (const settlement of settlements) {
              await settlementRepository.create({
                userId: settlement.from,
                payerId: settlement.to,
                groupId: groupId,
                amountToPay: settlement.amount,
                settled: false,
                createdAt: new Date(),
                updatedAt: new Date()
              });
            }
            
            console.log(`💾 Saved ${settlements.length} settlements to database`);
          }
          
          // Also trigger settlement service if available
          if (this.settlementService) {
            await this.settlementService.recalculateSettlements(groupId);
          }
        } catch (error) {
          console.error('Error in settlement recalculation:', error);
        }
      }
    }
  }
}

/**
 * Analytics Update Observer
 * Updates analytics when expenses change
 */
class AnalyticsUpdateObserver extends Observer {
  constructor(analyticsService) {
    super();
    this.analyticsService = analyticsService;
  }

  async update(event, data) {
    if (['expense.created', 'expense.updated', 'expense.deleted'].includes(event)) {
      const groupId = data.groupId || data.expense?.groupId;
      if (groupId) {
        try {
          console.log(`Analytics update triggered by event: ${event} for group: ${groupId}`);
          // Trigger analytics update
          await this.analyticsService.updateGroupAnalytics(groupId);
        } catch (error) {
          console.error('Error in analytics update:', error);
        }
      }
    }
  }
}

// Singleton instance of ExpenseSubject
const expenseSubject = new ExpenseSubject();

module.exports = {
  Observer,
  ExpenseSubject,
  SettlementRecalculationObserver,
  AnalyticsUpdateObserver,
  expenseSubject
};

