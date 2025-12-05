/**
 * Factory Pattern Tests
 * Tests the implementation of Factory Pattern for settlement creation
 */

const {
  SettlementFactory,
  StandardSettlement,
  PartialSettlement
} = require('../../../backend/factories/settlementFactory');

// Mock the repository
jest.mock('../../../backend/repositories/settlementRepository', () => ({
  create: jest.fn().mockResolvedValue({ _id: '123', amountToPay: 100 })
}));

describe('Factory Pattern Implementation', () => {
  describe('SettlementFactory', () => {
    test('should create standard settlement', () => {
      const settlement = SettlementFactory.createStandardSettlement(
        'user1',
        'user2',
        100,
        'group1'
      );
      
      expect(settlement).toBeInstanceOf(StandardSettlement);
      expect(settlement.from).toBe('user1');
      expect(settlement.to).toBe('user2');
      expect(settlement.amount).toBe(100);
      expect(settlement.type).toBe('standard');
    });

    test('should create partial settlement', () => {
      const settlement = SettlementFactory.createPartialSettlement(
        'user1',
        'user2',
        50,
        'group1',
        100
      );
      
      expect(settlement).toBeInstanceOf(PartialSettlement);
      expect(settlement.amount).toBe(50);
      expect(settlement.originalAmount).toBe(100);
      expect(settlement.remainingAmount).toBe(50);
      expect(settlement.type).toBe('partial');
    });

    test('should create settlement based on context (standard)', () => {
      const settlement = SettlementFactory.createSettlement(
        'user1',
        'user2',
        100,
        'group1'
      );
      
      expect(settlement).toBeInstanceOf(StandardSettlement);
    });

    test('should create settlement based on context (partial)', () => {
      const settlement = SettlementFactory.createSettlement(
        'user1',
        'user2',
        50,
        'group1',
        { originalAmount: 100 }
      );
      
      expect(settlement).toBeInstanceOf(PartialSettlement);
    });

    test('should create multiple settlements', () => {
      const settlementsData = [
        { from: 'user1', to: 'user2', amount: 100, groupId: 'group1' },
        { from: 'user3', to: 'user4', amount: 50, groupId: 'group1' }
      ];
      
      const settlements = SettlementFactory.createSettlements(settlementsData);
      
      expect(settlements).toHaveLength(2);
      expect(settlements[0]).toBeInstanceOf(StandardSettlement);
      expect(settlements[1]).toBeInstanceOf(StandardSettlement);
    });

    test('should save settlement to database', async () => {
      const settlement = SettlementFactory.createStandardSettlement(
        'user1',
        'user2',
        100,
        'group1'
      );
      
      const saved = await settlement.save();
      expect(saved).toBeDefined();
    });
  });
});

