jest.mock('../../../backend/repositories/expenseRepository', () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByGroup: jest.fn()
}));

jest.mock('../../../backend/repositories/groupRepository', () => ({
  exists: jest.fn()
}));

jest.mock('../../../backend/strategies/splitStrategy', () => {
  const validate = jest.fn().mockReturnValue({ valid: true });
  const calculateSplit = jest.fn((amount, members) => members);
  return {
    SplitStrategyFactory: {
      getStrategy: jest.fn(() => ({ validate, calculateSplit }))
    }
  };
});

jest.mock('../../../backend/observers/expenseObserver', () => ({
  expenseSubject: {
    notify: jest.fn()
  }
}));

jest.mock('../../../backend/middleware/errorHandler', () => ({
  asyncHandler: (fn) => fn,
  AppError: class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
}));

// Import controller after mocks are set up
const { createExpense, getExpensesByGroup } = require('../../../backend/controllers/expenseController');

describe('Expense Controller Tests', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('createExpense', () => {
    test('should create expense successfully', async () => {
      const expenseRepository = require('../../../backend/repositories/expenseRepository');
      const groupRepository = require('../../../backend/repositories/groupRepository');
      const { SplitStrategyFactory } = require('../../../backend/strategies/splitStrategy');

      req.body = {
        groupId: 'group123',
        description: 'Test Expense',
        amount: 1000,
        paidBy: [{ userId: 'user1', amount: 1000 }],
        splitMember: [
          { userId: 'user1', amount: 500 },
          { userId: 'user2', amount: 500 }
        ],
        splitType: 'equally'
      };

      groupRepository.exists.mockResolvedValue(true);
      const mockStrategy = {
        validate: jest.fn().mockReturnValue({ valid: true }),
        calculateSplit: jest.fn().mockReturnValue(req.body.splitMember)
      };
      SplitStrategyFactory.getStrategy.mockReturnValue(mockStrategy);
      expenseRepository.create.mockResolvedValue({ _id: 'expense123', ...req.body });
      expenseRepository.findById.mockResolvedValue({ _id: 'expense123', ...req.body });

      await createExpense(req, res, next);

      expect(expenseRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        groupId: 'group123',
        description: 'Test Expense',
        amount: 1000
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(next).not.toHaveBeenCalled();
    });

    test('should return error for invalid paidBy amount', async () => {
      const groupRepository = require('../../../backend/repositories/groupRepository');

      req.body = {
        groupId: 'group123',
        description: 'Test Expense',
        amount: 1000,
        paidBy: [{ userId: 'user1', amount: 500 }], // Less than total
        splitMember: [{ userId: 'user1' }, { userId: 'user2' }],
        splitType: 'equally'
      };

      groupRepository.exists.mockResolvedValue(true);

      try {
        await createExpense(req, res, next);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error.message).toBe('Sum of paidBy amounts must equal total expense amount');
      }
    });
  });

  describe('getExpensesByGroup', () => {
    test('should return expenses for group', async () => {
      const expenseRepository = require('../../../backend/repositories/expenseRepository');
      req.params.groupId = 'group123';

      const mockExpenses = [
        { _id: 'expense1', description: 'Expense 1', amount: 500 },
        { _id: 'expense2', description: 'Expense 2', amount: 300 }
      ];

      expenseRepository.findByGroup.mockResolvedValue(mockExpenses);

      await getExpensesByGroup(req, res, next);

      expect(expenseRepository.findByGroup).toHaveBeenCalledWith('group123');
      expect(res.json).toHaveBeenCalledWith(mockExpenses);
      expect(next).not.toHaveBeenCalled();
    });
  });
});