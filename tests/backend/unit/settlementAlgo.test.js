const { settleDebts, fetchUnsettledTransactions } = require('../../../backend/utils/algo');

// Mock ExpenseSheet model
jest.mock('../../../backend/model/expenseSheetModel', () => ({
  find: jest.fn().mockResolvedValue([]),
  deleteMany: jest.fn().mockResolvedValue({}),
  create: jest.fn().mockResolvedValue({})
}));

// Helper function for calculating balances from expenses
function calculateBalancesFromExpenses(expenses) {
  const balances = new Map();
  
  for (const expense of expenses) {
    // Add what each person paid
    for (const payer of expense.paidBy) {
      balances.set(payer.userId, (balances.get(payer.userId) || 0) + payer.amount);
    }
    
    // Subtract what each person owes
    for (const member of expense.splitMember) {
      const amount = member.amount || (expense.amount / expense.splitMember.length);
      balances.set(member.userId, (balances.get(member.userId) || 0) - amount);
    }
  }
  
  return Array.from(balances.entries()).filter(([_, amount]) => Math.abs(amount) > 0.01);
}

describe('Settlement Algorithm Tests', () => {
  describe('settleDebts', () => {
    test('should optimize settlements correctly', async () => {
      const transactions = [
        ['alice', 100],   // Alice is owed $100
        ['bob', -50],     // Bob owes $50
        ['charlie', -50]  // Charlie owes $50
      ];

      const groupId = '507f1f77bcf86cd799439011';
      const settlements = await settleDebts(transactions, groupId);
      
      expect(settlements).toHaveLength(2);
      expect(settlements[0].from).toBe('bob');
      expect(settlements[0].to).toBe('alice');
      expect(settlements[0].amount).toBe(50);
      expect(settlements[1].from).toBe('charlie');
      expect(settlements[1].to).toBe('alice');
      expect(settlements[1].amount).toBe(50);
    });

    test('should handle multiple creditors and debtors', async () => {
      const transactions = [
        ['alice', 150],   // Alice is owed $150
        ['bob', 50],      // Bob is owed $50
        ['charlie', -100], // Charlie owes $100
        ['david', -100]   // David owes $100
      ];

      const groupId = '507f1f77bcf86cd799439012';
      const settlements = await settleDebts(transactions, groupId);
      
      expect(settlements.length).toBeGreaterThan(0);
      
      // Verify total amounts balance
      const totalCredits = settlements.reduce((sum, s) => sum + s.amount, 0);
      expect(totalCredits).toBe(200); // Total debt should equal total credit
    });

    test('should handle zero balance users', async () => {
      const transactions = [
        ['alice', 100],
        ['bob', 0],      // Bob has zero balance
        ['charlie', -100]
      ];

      const groupId = '507f1f77bcf86cd799439013';
      const settlements = await settleDebts(transactions, groupId);
      
      expect(settlements).toHaveLength(1);
      expect(settlements[0].from).toBe('charlie');
      expect(settlements[0].to).toBe('alice');
      expect(settlements[0].amount).toBe(100);
    });

    test('should minimize number of transactions', async () => {
      const transactions = [
        ['alice', 200],   // Alice is owed $200
        ['bob', -50],     // Bob owes $50
        ['charlie', -50], // Charlie owes $50
        ['david', -100]   // David owes $100
      ];

      const groupId = '507f1f77bcf86cd799439014';
      const settlements = await settleDebts(transactions, groupId);
      
      // Should be 3 transactions (optimal)
      expect(settlements).toHaveLength(3);
      
      // Verify all debts are settled
      const totalSettled = settlements.reduce((sum, s) => sum + s.amount, 0);
      expect(totalSettled).toBe(200);
    });
  });

  describe('fetchUnsettledTransactions', () => {
    test('should fetch mock transactions for group', async () => {
      const groupId = '507f1f77bcf86cd799439015';
      const transactions = await fetchUnsettledTransactions(groupId);
      
      expect(Array.isArray(transactions)).toBe(true);
      // Should return empty array since we mocked empty database
      expect(transactions).toEqual([]);
    });

    test('should return default transactions for unknown group', async () => {
      const groupId = '507f1f77bcf86cd799439016';
      const transactions = await fetchUnsettledTransactions(groupId);
      
      expect(Array.isArray(transactions)).toBe(true);
      expect(transactions).toEqual([]);
    });
  });

  describe('calculateBalancesFromExpenses', () => {
    test('should calculate balances from expense data', () => {
      const expenses = [
        {
          amount: 100,
          paidBy: [{ userId: 'alice', amount: 100 }],
          splitMember: [
            { userId: 'alice', amount: 50 },
            { userId: 'bob', amount: 50 }
          ]
        },
        {
          amount: 60,
          paidBy: [{ userId: 'bob', amount: 60 }],
          splitMember: [
            { userId: 'alice', amount: 30 },
            { userId: 'bob', amount: 30 }
          ]
        }
      ];

      const balances = calculateBalancesFromExpenses(expenses);
      
      expect(balances).toEqual([
        ['alice', 20],  // Alice paid 100, owes 80, net +20
        ['bob', -20]    // Bob paid 60, owes 80, net -20
      ]);
    });

    test('should handle equal split when no amounts specified', () => {
      const expenses = [
        {
          amount: 120,
          paidBy: [{ userId: 'alice', amount: 120 }],
          splitMember: [
            { userId: 'alice' },
            { userId: 'bob' },
            { userId: 'charlie' }
          ]
        }
      ];

      const balances = calculateBalancesFromExpenses(expenses);
      
      expect(balances).toEqual([
        ['alice', 80],   // Alice paid 120, owes 40, net +80
        ['bob', -40],    // Bob paid 0, owes 40, net -40
        ['charlie', -40] // Charlie paid 0, owes 40, net -40
      ]);
    });
  });
});