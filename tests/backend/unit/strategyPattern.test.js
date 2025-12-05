/**
 * Strategy Pattern Tests
 * Tests the implementation of Strategy Pattern for split types
 */

const {
  EqualSplitStrategy,
  CustomSplitStrategy,
  PercentageSplitStrategy,
  SplitStrategyFactory
} = require('../../../backend/strategies/splitStrategy');

describe('Strategy Pattern Implementation', () => {
  describe('EqualSplitStrategy', () => {
    test('should split amount equally among members', () => {
      const strategy = new EqualSplitStrategy();
      const members = [
        { userId: 'user1' },
        { userId: 'user2' },
        { userId: 'user3' }
      ];
      const result = strategy.calculateSplit(300, members);
      
      expect(result).toHaveLength(3);
      expect(result[0].amount).toBe(100);
      expect(result[1].amount).toBe(100);
      expect(result[2].amount).toBe(100);
    });

    test('should validate equal split correctly', () => {
      const strategy = new EqualSplitStrategy();
      const validation = strategy.validate(100, [{ userId: 'user1' }]);
      expect(validation.valid).toBe(true);
    });

    test('should reject invalid amount', () => {
      const strategy = new EqualSplitStrategy();
      const validation = strategy.validate(-100, [{ userId: 'user1' }]);
      expect(validation.valid).toBe(false);
    });
  });

  describe('CustomSplitStrategy', () => {
    test('should use custom amounts', () => {
      const strategy = new CustomSplitStrategy();
      const members = [
        { userId: 'user1', amount: 150 },
        { userId: 'user2', amount: 100 },
        { userId: 'user3', amount: 50 }
      ];
      const result = strategy.calculateSplit(300, members);
      
      expect(result).toHaveLength(3);
      expect(result[0].amount).toBe(150);
      expect(result[1].amount).toBe(100);
      expect(result[2].amount).toBe(50);
    });

    test('should validate custom split amounts sum', () => {
      const strategy = new CustomSplitStrategy();
      const members = [
        { userId: 'user1', amount: 150 },
        { userId: 'user2', amount: 100 },
        { userId: 'user3', amount: 50 }
      ];
      const validation = strategy.validate(300, members);
      expect(validation.valid).toBe(true);
    });

    test('should reject if amounts do not sum to total', () => {
      const strategy = new CustomSplitStrategy();
      const members = [
        { userId: 'user1', amount: 150 },
        { userId: 'user2', amount: 100 }
      ];
      const validation = strategy.validate(300, members);
      expect(validation.valid).toBe(false);
    });
  });

  describe('PercentageSplitStrategy', () => {
    test('should split amount based on percentages', () => {
      const strategy = new PercentageSplitStrategy();
      const members = [
        { userId: 'user1', percentage: 50 },
        { userId: 'user2', percentage: 30 },
        { userId: 'user3', percentage: 20 }
      ];
      const result = strategy.calculateSplit(200, members);
      
      expect(result).toHaveLength(3);
      expect(result[0].amount).toBe(100);
      expect(result[1].amount).toBe(60);
      expect(result[2].amount).toBe(40);
    });

    test('should validate percentage split sums to 100%', () => {
      const strategy = new PercentageSplitStrategy();
      const members = [
        { userId: 'user1', percentage: 50 },
        { userId: 'user2', percentage: 30 },
        { userId: 'user3', percentage: 20 }
      ];
      const validation = strategy.validate(200, members);
      expect(validation.valid).toBe(true);
    });

    test('should reject if percentages do not sum to 100%', () => {
      const strategy = new PercentageSplitStrategy();
      const members = [
        { userId: 'user1', percentage: 50 },
        { userId: 'user2', percentage: 30 }
      ];
      const validation = strategy.validate(200, members);
      expect(validation.valid).toBe(false);
    });
  });

  describe('SplitStrategyFactory', () => {
    test('should return EqualSplitStrategy for "equally" type', () => {
      const strategy = SplitStrategyFactory.getStrategy('equally');
      expect(strategy).toBeInstanceOf(EqualSplitStrategy);
    });

    test('should return CustomSplitStrategy for "custom" type', () => {
      const strategy = SplitStrategyFactory.getStrategy('custom');
      expect(strategy).toBeInstanceOf(CustomSplitStrategy);
    });

    test('should return PercentageSplitStrategy for "percentage" type', () => {
      const strategy = SplitStrategyFactory.getStrategy('percentage');
      expect(strategy).toBeInstanceOf(PercentageSplitStrategy);
    });

    test('should throw error for unknown strategy type', () => {
      expect(() => {
        SplitStrategyFactory.getStrategy('unknown');
      }).toThrow('Unknown split type');
    });

    test('should register new strategy', () => {
      class TestStrategy extends require('../../../backend/strategies/splitStrategy').SplitStrategy {
        calculateSplit() { return []; }
      }
      
      SplitStrategyFactory.registerStrategy('test', new TestStrategy());
      const strategy = SplitStrategyFactory.getStrategy('test');
      expect(strategy).toBeInstanceOf(TestStrategy);
    });
  });
});

