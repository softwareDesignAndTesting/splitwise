const { createExpense, getExpensesByGroup } = require('../../../backend/controllers/expenseController');
const Expense = require('../../../backend/model/expenseModel');
const Group = require('../../../backend/model/groupModel');

jest.mock('../../../backend/model/expenseModel');
jest.mock('../../../backend/model/groupModel');

describe('Expense Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('createExpense', () => {
    test('should create expense successfully', async () => {
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

      Group.findById.mockResolvedValue({ _id: 'group123', name: 'Test Group' });
      
      const mockExpense = {
        _id: 'expense123',
        ...req.body
      };

      Expense.create.mockResolvedValue(mockExpense);
      Expense.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis()
      });

      await createExpense(req, res);

      expect(Expense.create).toHaveBeenCalledWith(expect.objectContaining({
        groupId: 'group123',
        description: 'Test Expense',
        amount: 1000
      }));
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('should return error for invalid paidBy amount', async () => {
      req.body = {
        groupId: 'group123',
        description: 'Test Expense',
        amount: 1000,
        paidBy: [{ userId: 'user1', amount: 500 }], // Less than total
        splitMember: [{ userId: 'user1' }, { userId: 'user2' }],
        splitType: 'equally'
      };

      Group.findById.mockResolvedValue({ _id: 'group123' });

      await createExpense(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Sum of paidBy amounts must equal total expense amount'
      });
    });
  });

  describe('getExpensesByGroup', () => {
    test('should return expenses for group', async () => {
      req.params.groupId = 'group123';

      const mockExpenses = [
        { _id: 'expense1', description: 'Expense 1', amount: 500 },
        { _id: 'expense2', description: 'Expense 2', amount: 300 }
      ];

      Expense.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockExpenses)
      });

      await getExpensesByGroup(req, res);

      expect(Expense.find).toHaveBeenCalledWith({ groupId: 'group123' });
      expect(res.json).toHaveBeenCalledWith(mockExpenses);
    });
  });
});