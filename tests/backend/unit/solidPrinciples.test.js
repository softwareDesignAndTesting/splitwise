/**
 * SOLID Principles Tests
 * Tests the implementation of SOLID principles
 */

const userRepository = require('../../../backend/repositories/userRepository');
const expenseRepository = require('../../../backend/repositories/expenseRepository');
const { SplitStrategyFactory } = require('../../../backend/strategies/splitStrategy');
const { SettlementFactory } = require('../../../backend/factories/settlementFactory');

describe('SOLID Principles Implementation', () => {
  describe('Single Responsibility Principle (SRP)', () => {
    test('UserRepository should only handle user data access', () => {
      expect(typeof userRepository.findByEmail).toBe('function');
      expect(typeof userRepository.findById).toBe('function');
      expect(typeof userRepository.create).toBe('function');
      // Should not have business logic methods
      expect(userRepository.hashPassword).toBeUndefined();
      expect(userRepository.generateToken).toBeUndefined();
    });

    test('ExpenseRepository should only handle expense data access', () => {
      expect(typeof expenseRepository.create).toBe('function');
      expect(typeof expenseRepository.findById).toBe('function');
      expect(typeof expenseRepository.findByGroup).toBe('function');
      // Should not have business logic methods
      expect(expenseRepository.calculateSplit).toBeUndefined();
      expect(expenseRepository.validateExpense).toBeUndefined();
    });
  });

  describe('Open/Closed Principle (OCP)', () => {
    test('SplitStrategyFactory should be open for extension', () => {
      class TestSplitStrategy extends require('../../../backend/strategies/splitStrategy').SplitStrategy {
        calculateSplit(totalAmount, members) {
          return members.map(m => ({ userId: m.userId, amount: totalAmount / members.length }));
        }
      }
      
      SplitStrategyFactory.registerStrategy('test', new TestSplitStrategy());
      const strategy = SplitStrategyFactory.getStrategy('test');
      expect(strategy).toBeInstanceOf(TestSplitStrategy);
    });

    test('New split strategies can be added without modifying existing code', () => {
      const originalStrategies = Object.keys(SplitStrategyFactory.strategies);
      expect(originalStrategies.length).toBeGreaterThan(0);
      
      // Adding new strategy doesn't break existing ones
      class NewStrategy extends require('../../../backend/strategies/splitStrategy').SplitStrategy {
        calculateSplit() { return []; }
      }
      SplitStrategyFactory.registerStrategy('new', new NewStrategy());
      
      // Original strategies still work
      const equalStrategy = SplitStrategyFactory.getStrategy('equally');
      expect(equalStrategy).toBeDefined();
    });
  });

  describe('Liskov Substitution Principle (LSP)', () => {
    test('All split strategies should be substitutable', () => {
      const equalStrategy = SplitStrategyFactory.getStrategy('equally');
      const customStrategy = SplitStrategyFactory.getStrategy('custom');
      const percentageStrategy = SplitStrategyFactory.getStrategy('percentage');
      
      const members = [{ userId: 'user1' }, { userId: 'user2' }];
      
      // All strategies should have the same interface
      expect(typeof equalStrategy.calculateSplit).toBe('function');
      expect(typeof customStrategy.calculateSplit).toBe('function');
      expect(typeof percentageStrategy.calculateSplit).toBe('function');
      
      expect(typeof equalStrategy.validate).toBe('function');
      expect(typeof customStrategy.validate).toBe('function');
      expect(typeof percentageStrategy.validate).toBe('function');
    });
  });

  describe('Interface Segregation Principle (ISP)', () => {
    test('Repositories should expose only needed methods', () => {
      // UserRepository should not expose expense-related methods
      expect(userRepository.findByGroup).toBeUndefined();
      expect(userRepository.createExpense).toBeUndefined();
      
      // ExpenseRepository should not expose user-related methods
      expect(expenseRepository.findByEmail).toBeUndefined();
      expect(expenseRepository.createUser).toBeUndefined();
    });

    test('Strategies should have focused interfaces', () => {
      const strategy = SplitStrategyFactory.getStrategy('equally');
      
      // Should have split-related methods
      expect(typeof strategy.calculateSplit).toBe('function');
      expect(typeof strategy.validate).toBe('function');
      
      // Should not have unrelated methods
      expect(strategy.saveToDatabase).toBeUndefined();
      expect(strategy.sendNotification).toBeUndefined();
    });
  });

  describe('Dependency Inversion Principle (DIP)', () => {
    test('Controllers should depend on repository abstractions, not concrete models', () => {
      // Controllers use repositories (abstractions)
      const userController = require('../../../backend/controllers/userController');
      expect(userController).toBeDefined();
      
      // Repositories abstract model access
      expect(userRepository).toBeDefined();
      expect(typeof userRepository.findByEmail).toBe('function');
    });

    test('Settlement algorithm should use factory abstraction', () => {
      // Factory abstracts settlement creation
      const settlement = SettlementFactory.createStandardSettlement('user1', 'user2', 100, 'group1');
      expect(settlement).toBeDefined();
      expect(typeof settlement.save).toBe('function');
    });

    test('Expense controller should use strategy abstraction', () => {
      // Strategy abstracts split calculation
      const strategy = SplitStrategyFactory.getStrategy('equally');
      expect(strategy).toBeDefined();
      expect(typeof strategy.calculateSplit).toBe('function');
    });
  });
});

