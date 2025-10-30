const { settleDebts, fetchUnsettledTransactions } = require('../../backend/utils/algo');
const ExpenseSheet = require('../../backend/model/expenseSheetModel');

jest.mock('../../../backend/model/expenseSheetModel');

describe('Settlement Algorithm Tests', () => {
  beforeEach(() => {
    ExpenseSheet.deleteMany.mockResolvedValue({});
    ExpenseSheet.create.mockResolvedValue({});
  });

  describe('settleDebts', () => {
    test('should optimize settlements correctly', async () => {
  
      const transactions = [
        ['userA', -100],
        ['userB', 0],
        ['userC', 100]
      ];

      const result = await settleDebts(transactions, 'group123');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        from: 'userA',
        to: 'userC',
        amount: 100
      });
    });

    test('should handle multiple creditors and debtors', async () => {
      const transactions = [
        ['userA', -150],
        ['userB', -50],
        ['userC', 100],
        ['userD', 100]
      ];

      const result = await settleDebts(transactions, 'group123');

      expect(result.length).toBeGreaterThan(0);
      
      const totalOwed = result.reduce((sum, settlement) => sum + settlement.amount, 0);
      expect(totalOwed).toBe(200);
    });

    test('should handle zero balance users', async () => {
      const transactions = [
        ['userA', -100],
        ['userB', 100],
        ['userC', 0]
      ];

      const result = await settleDebts(transactions, 'group123');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        from: 'userA',
        to: 'userB',
        amount: 100
      });
    });

    test('should minimize number of transactions', async () => {

      const transactions = [
        ['userA', -200],
        ['userB', -100],
        ['userC', 150],
        ['userD', 150]
      ];

      const result = await settleDebts(transactions, 'group123');


      expect(result.length).toBeLessThanOrEqual(3);
    });
  });

  describe('fetchUnsettledTransactions', () => {
    test('should fetch and process unsettled expenses', async () => {
      const mockExpenses = [
        {
          payerId: 'user1',
          userId: 'user2',
          amountToPay: 500
        },
        {
          payerId: 'user3',
          userId: 'user1',
          amountToPay: 300
        }
      ];

      ExpenseSheet.find.mockResolvedValue(mockExpenses);

      const result = await fetchUnsettledTransactions('group123');

      expect(ExpenseSheet.find).toHaveBeenCalledWith({
        groupId: 'group123',
        settled: false
      });
      expect(result).toBeDefined();
    });
  });
});