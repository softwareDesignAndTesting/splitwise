/**
 * Observer Pattern Tests
 * Tests the implementation of Observer Pattern for expense events
 */

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

    test('should notify all observers', () => {
      const observer1 = new SettlementRecalculationObserver(mockSettlementService);
      const observer2 = new AnalyticsUpdateObserver(mockAnalyticsService);
      
      expenseSubject.attach(observer1);
      expenseSubject.attach(observer2);
      
      expenseSubject.notify('expense.created', { groupId: 'group1' });
      
      expect(mockSettlementService.recalculateSettlements).toHaveBeenCalledWith('group1');
      expect(mockAnalyticsService.updateGroupAnalytics).toHaveBeenCalledWith('group1');
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
      
      expect(mockSettlementService.recalculateSettlements).toHaveBeenCalledWith('group1');
    });

    test('should trigger settlement recalculation on expense.updated', async () => {
      const observer = new SettlementRecalculationObserver(mockSettlementService);
      await observer.update('expense.updated', { expense: { groupId: 'group1' } });
      
      expect(mockSettlementService.recalculateSettlements).toHaveBeenCalledWith('group1');
    });

    test('should trigger settlement recalculation on expense.deleted', async () => {
      const observer = new SettlementRecalculationObserver(mockSettlementService);
      await observer.update('expense.deleted', { groupId: 'group1' });
      
      expect(mockSettlementService.recalculateSettlements).toHaveBeenCalledWith('group1');
    });

    test('should not trigger for unrelated events', async () => {
      const observer = new SettlementRecalculationObserver(mockSettlementService);
      await observer.update('user.created', { groupId: 'group1' });
      
      expect(mockSettlementService.recalculateSettlements).not.toHaveBeenCalled();
    });
  });

  describe('AnalyticsUpdateObserver', () => {
    test('should trigger analytics update on expense events', async () => {
      const observer = new AnalyticsUpdateObserver(mockAnalyticsService);
      await observer.update('expense.created', { groupId: 'group1' });
      
      expect(mockAnalyticsService.updateGroupAnalytics).toHaveBeenCalledWith('group1');
    });
  });
});

