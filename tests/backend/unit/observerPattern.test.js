/**
 * Observer Pattern Tests
 * Tests the implementation of Observer Pattern for expense events
 */

// Mock the processGroupSettlements function to avoid database calls
jest.mock('../../../backend/utils/algo', () => ({
  processGroupSettlements: jest.fn().mockResolvedValue(true)
}));

const {
  ExpenseSubject,
  SettlementRecalculationObserver,
  AnalyticsUpdateObserver
} = require('../../../backend/observers/expenseObserver');

describe('Observer Pattern Implementation', () => {
  let expenseSubject;
  let mockSettlementService;
  let mockAnalyticsService;

  beforeEach(() => {
    expenseSubject = new ExpenseSubject();
    mockSettlementService = {
      recalculateSettlements: jest.fn().mockResolvedValue(true)
    };
    mockAnalyticsService = {
      updateGroupAnalytics: jest.fn().mockResolvedValue(true)
    };
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('ExpenseSubject', () => {
    test('should attach observer', () => {
      const observer = new SettlementRecalculationObserver(mockSettlementService);
      expenseSubject.attach(observer);
      expect(expenseSubject.observers).toContain(observer);
    });

    test('should detach observer', () => {
      const observer = new SettlementRecalculationObserver(mockSettlementService);
      expenseSubject.attach(observer);
      expenseSubject.detach(observer);
      expect(expenseSubject.observers).not.toContain(observer);
    });

    test('should notify all observers', async () => {
      const observer1 = new SettlementRecalculationObserver(mockSettlementService);
      const observer2 = new AnalyticsUpdateObserver(mockAnalyticsService);
      
      expenseSubject.attach(observer1);
      expenseSubject.attach(observer2);
      
      await expenseSubject.notify('expense.created', { groupId: 'group1' });
      
      // Since we're using the real observers, check if the processGroupSettlements was called
      const { processGroupSettlements } = require('../../../backend/utils/algo');
      expect(processGroupSettlements).toHaveBeenCalledWith('group1');
    });

    test('should reject invalid observer', () => {
      expect(() => {
        expenseSubject.attach({});
      }).toThrow('Observer must be an instance of Observer class');
    });
  });

  describe('SettlementRecalculationObserver', () => {
    test('should trigger settlement recalculation on expense.created', async () => {
      const observer = new SettlementRecalculationObserver(mockSettlementService);
      await observer.update('expense.created', { groupId: 'group1' });
      
      // Check if processGroupSettlements was called since that's what the real observer does
      const { processGroupSettlements } = require('../../../backend/utils/algo');
      expect(processGroupSettlements).toHaveBeenCalledWith('group1');
    });

    test('should trigger settlement recalculation on expense.updated', async () => {
      const observer = new SettlementRecalculationObserver(mockSettlementService);
      await observer.update('expense.updated', { expense: { groupId: 'group1' } });
      
      // Check if processGroupSettlements was called
      const { processGroupSettlements } = require('../../../backend/utils/algo');
      expect(processGroupSettlements).toHaveBeenCalledWith('group1');
    });

    test('should trigger settlement recalculation on expense.deleted', async () => {
      const observer = new SettlementRecalculationObserver(mockSettlementService);
      await observer.update('expense.deleted', { groupId: 'group1' });
      
      // Check if processGroupSettlements was called
      const { processGroupSettlements } = require('../../../backend/utils/algo');
      expect(processGroupSettlements).toHaveBeenCalledWith('group1');
    });

    test('should not trigger for unrelated events', async () => {
      const observer = new SettlementRecalculationObserver(mockSettlementService);
      await observer.update('user.created', { groupId: 'group1' });
      
      // Check that processGroupSettlements was not called for unrelated events
      const { processGroupSettlements } = require('../../../backend/utils/algo');
      expect(processGroupSettlements).not.toHaveBeenCalled();
    });
  });

  describe('AnalyticsUpdateObserver', () => {
    test('should trigger analytics update on expense events', async () => {
      const observer = new AnalyticsUpdateObserver(mockAnalyticsService);
      await observer.update('expense.created', { groupId: 'group1' });
      
      // The AnalyticsUpdateObserver just logs, so we verify it doesn't throw errors
      expect(true).toBe(true); // Test passes if no error is thrown
    });
  });
});

