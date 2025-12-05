/**
 * Repository Pattern Tests
 * Tests the implementation of Repository Pattern for data access abstraction
 */

const userRepository = require('../../../backend/repositories/userRepository');
const expenseRepository = require('../../../backend/repositories/expenseRepository');
const settlementRepository = require('../../../backend/repositories/settlementRepository');
const groupRepository = require('../../../backend/repositories/groupRepository');

// Mock the models
jest.mock('../../../backend/model/userModel', () => {
  return {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
  };
});

jest.mock('../../../backend/model/expenseModel', () => ({
  create: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
}));

jest.mock('../../../backend/model/expenseSheetModel', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteMany: jest.fn()
}));

jest.mock('../../../backend/model/groupModel', () => ({
  create: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
}));

describe('Repository Pattern Implementation', () => {
  describe('UserRepository', () => {
    test('should find user by email', async () => {
      const User = require('../../../backend/model/userModel');
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: '123', email: 'test@example.com' })
      });

      const user = await userRepository.findByEmail('test@example.com');
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(user).toBeDefined();
    });

    test('should find user by id', async () => {
      const User = require('../../../backend/model/userModel');
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: '123', name: 'Test' })
      });

      const user = await userRepository.findById('123');
      expect(user).toBeDefined();
    });

    test('should create user', async () => {
      const User = require('../../../backend/model/userModel');
      User.create.mockResolvedValue({ _id: '123', name: 'Test User' });

      const user = await userRepository.create({ name: 'Test User', email: 'test@example.com' });
      expect(User.create).toHaveBeenCalled();
      expect(user).toBeDefined();
    });
  });

  describe('ExpenseRepository', () => {
    test('should create expense', async () => {
      const Expense = require('../../../backend/model/expenseModel');
      Expense.create.mockResolvedValue({ _id: '123', amount: 100 });

      const expense = await expenseRepository.create({ amount: 100, description: 'Test' });
      expect(Expense.create).toHaveBeenCalled();
      expect(expense).toBeDefined();
    });

    test('should find expense by id', async () => {
      const Expense = require('../../../backend/model/expenseModel');
      Expense.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue({ _id: '123', amount: 100 })
          })
        })
      });

      const expense = await expenseRepository.findById('123');
      expect(expense).toBeDefined();
    });
  });

  describe('SettlementRepository', () => {
    test('should find unsettled settlements by group', async () => {
      const ExpenseSheet = require('../../../backend/model/expenseSheetModel');
      ExpenseSheet.find.mockResolvedValue([{ _id: '123', settled: false }]);

      const settlements = await settlementRepository.findUnsettledByGroup('groupId123');
      expect(ExpenseSheet.find).toHaveBeenCalledWith({ groupId: 'groupId123', settled: false });
      expect(settlements).toBeDefined();
    });

    test('should create settlement', async () => {
      const ExpenseSheet = require('../../../backend/model/expenseSheetModel');
      ExpenseSheet.create.mockResolvedValue({ _id: '123', amountToPay: 50 });

      const settlement = await settlementRepository.create({ amountToPay: 50 });
      expect(ExpenseSheet.create).toHaveBeenCalled();
      expect(settlement).toBeDefined();
    });
  });

  describe('GroupRepository', () => {
    test('should find group by id', async () => {
      const Group = require('../../../backend/model/groupModel');
      Group.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue({ _id: '123', name: 'Test Group' })
      });

      const group = await groupRepository.findById('123');
      expect(group).toBeDefined();
    });
  });
});

