// Lazy loaders so Jest mocks are picked up even if modules were cached earlier.
const getExpenseRepository = () => require('../repositories/expenseRepository');
const getGroupRepository = () => require('../repositories/groupRepository');
const { SplitStrategyFactory } = require('../strategies/splitStrategy');
const { expenseSubject } = require('../observers/expenseObserver');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const createExpense = asyncHandler(async (req, res) => {
  const { groupId, description, amount, paidBy, splitMember, splitType, date } = req.body;

  // Validation
  if (!groupId || !description || !amount || !paidBy || !splitMember || !splitType) {
    throw new AppError('Missing required fields', 400);
  }
  if (!Array.isArray(paidBy) || !Array.isArray(splitMember)) {
    throw new AppError('paidBy and splitMember must be arrays', 400);
  }

  // Check if group exists using repository
  const groupRepository = getGroupRepository();
  const expenseRepository = getExpenseRepository();

  const group = await groupRepository.exists(groupId);
  if (!group) {
    throw new AppError('Group not found', 404);
  }

  // Validate paidBy amounts
  const totalPaid = paidBy.reduce((sum, payer) => sum + parseFloat(payer.amount || 0), 0);
  if (Math.abs(totalPaid - amount) > 0.01) {
    throw new AppError('Sum of paidBy amounts must equal total expense amount', 400);
  }

  // Use Strategy Pattern to calculate split amounts
  const strategy = SplitStrategyFactory.getStrategy(splitType);
  const validation = strategy.validate(amount, splitMember);
  if (!validation.valid) {
    throw new AppError(validation.error, 400);
  }

  // Calculate split amounts using strategy
  const calculatedSplitMember = strategy.calculateSplit(amount, splitMember);

  // Create expense using repository
  const expense = await expenseRepository.create({
    groupId,
    description,
    amount,
    paidBy,
    splitMember: calculatedSplitMember,
    splitType,
    date: date || new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const populatedExpense = await expenseRepository.findById(expense._id);

  // Notify observers (Observer Pattern)
  expenseSubject.notify('expense.created', { expense: populatedExpense, groupId });

  res.status(201).json({
    success: true,
    data: populatedExpense,
    message: 'Expense created successfully'
  });
});

const getAllExpenses = asyncHandler(async (req, res) => {
  const expenseRepository = getExpenseRepository();
  const expenses = await expenseRepository.findAll();
  res.json(expenses);
});

const getExpenseById = asyncHandler(async (req, res) => {
  const expenseRepository = getExpenseRepository();
  const expense = await expenseRepository.findById(req.params.id);
  
  if (!expense) {
    throw new AppError('Expense not found', 404);
  }
  
  res.json(expense);
});

const getExpensesByGroup = asyncHandler(async (req, res) => {
  const expenseRepository = getExpenseRepository();
  const expenses = await expenseRepository.findByGroup(req.params.groupId);
  res.json(expenses);
});

const getExpensesInvolvingUser = asyncHandler(async (req, res) => {
  const expenseRepository = getExpenseRepository();
  const userId = req.params.userId;
  const expenses = await expenseRepository.findByUserInvolvement(userId);
  
  const expensesWithInvolvement = expenses.map(expense => {
    const userPayer = expense.paidBy.find(payer => 
      payer.userId._id.toString() === userId
    );
    const isSplitMember = expense.splitMember.some(member => 
      member._id.toString() === userId
    );

    let userInvolvement = {
      amountPaid: userPayer ? userPayer.amount : 0,
      amountOwed: isSplitMember ? expense.amount / expense.splitMember.length : 0,
      netAmount: 0
    };

    userInvolvement.netAmount = userInvolvement.amountPaid - userInvolvement.amountOwed;

    return {
      ...expense.toObject(),
      userInvolvement
    };
  });

  res.json(expensesWithInvolvement);
});

const updateExpense = asyncHandler(async (req, res) => {
  const expenseRepository = getExpenseRepository();
  const { description, amount, paidBy, splitMember, splitType, date } = req.body;
  
  const expense = await expenseRepository.findById(req.params.id);
  
  if (!expense) {
    throw new AppError('Expense not found', 404);
  }
  
  const isPayer = expense.paidBy.some(payer => 
    payer.userId.toString() === req.user._id.toString()
  );
  if (!isPayer) {
    throw new AppError('Not authorized to update this expense', 401);
  }

  // Validate paidBy amounts if provided
  if (paidBy) {
    const totalPaid = paidBy.reduce((sum, payer) => sum + parseFloat(payer.amount || 0), 0);
    if (Math.abs(totalPaid - amount) > 0.01) {
      throw new AppError('Sum of paidBy amounts must equal total expense amount', 400);
    }
  }

  // Use Strategy Pattern if splitType is provided
  let calculatedSplitMember = splitMember;
  if (splitType && splitMember) {
    const strategy = SplitStrategyFactory.getStrategy(splitType);
    const validation = strategy.validate(amount, splitMember);
    if (!validation.valid) {
      throw new AppError(validation.error, 400);
    }
    calculatedSplitMember = strategy.calculateSplit(amount, splitMember);
  }
  
  const updatedExpense = await expenseRepository.update(req.params.id, {
    description,
    amount,
    paidBy: paidBy || expense.paidBy,
    splitMember: calculatedSplitMember || expense.splitMember,
    splitType: splitType || expense.splitType,
    date: date || expense.date,
    updatedAt: new Date()
  });

  // Notify observers (Observer Pattern)
  expenseSubject.notify('expense.updated', { expense: updatedExpense, groupId: updatedExpense.groupId });

  res.json(updatedExpense);
});

const deleteExpense = asyncHandler(async (req, res) => {
  const expenseRepository = getExpenseRepository();
  const expense = await expenseRepository.findById(req.params.id);
  
  if (!expense) {
    throw new AppError('Expense not found', 404);
  }
  
  const isPayer = expense.paidBy.some(payer => 
    payer.userId.toString() === req.user._id.toString()
  );
  if (!isPayer) {
    throw new AppError('Not authorized to delete this expense', 401);
  }
  
  const groupId = expense.groupId._id || expense.groupId;
  await expenseRepository.delete(req.params.id);

  // Notify observers (Observer Pattern)
  expenseSubject.notify('expense.deleted', { expenseId: req.params.id, groupId });

  res.json({ message: 'Expense deleted successfully' });
});

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  getExpensesByGroup,
  getExpensesInvolvingUser,
  updateExpense,
  deleteExpense
}; 
