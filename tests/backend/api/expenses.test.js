// Mock Expenses API Tests
const mockExpensesAPI = {
  createExpense: async (expenseData, token) => {
    if (!token) {
      return { status: 401, body: { message: 'Unauthorized' } };
    }
    if (!expenseData.description || !expenseData.amount) {
      return { status: 400, body: { message: 'Missing required fields' } };
    }
    const totalPaid = expenseData.paidBy.reduce((sum, payer) => sum + payer.amount, 0);
    if (Math.abs(totalPaid - expenseData.amount) > 0.01) {
      return { status: 400, body: { message: 'Sum of paidBy amounts must equal total expense amount' } };
    }
    return {
      status: 201,
      body: {
        success: true,
        data: {
          _id: 'expense123',
          ...expenseData,
          createdAt: new Date()
        }
      }
    };
  },
  getExpenses: async (groupId, token) => {
    if (!token) {
      return { status: 401, body: { message: 'Unauthorized' } };
    }
    return {
      status: 200,
      body: [
        {
          _id: 'expense1',
          description: 'Dinner',
          amount: 100,
          groupId: groupId
        },
        {
          _id: 'expense2',
          description: 'Movie',
          amount: 50,
          groupId: groupId
        }
      ]
    };
  },
  updateExpense: async (expenseId, updateData, token) => {
    if (!token) {
      return { status: 401, body: { message: 'Unauthorized' } };
    }
    return {
      status: 200,
      body: {
        _id: expenseId,
        ...updateData,
        updatedAt: new Date()
      }
    };
  },
  deleteExpense: async (expenseId, token) => {
    if (!token) {
      return { status: 401, body: { message: 'Unauthorized' } };
    }
    return {
      status: 200,
      body: { message: 'Expense deleted successfully' }
    };
  }
};

describe('Expenses API Tests', () => {
  const mockToken = 'mockToken';
  const mockGroupId = 'group123';

  test('should create expense with valid data', async () => {
    const expenseData = {
      groupId: mockGroupId,
      description: 'Team Lunch',
      amount: 200,
      paidBy: [{ userId: 'user1', amount: 200 }],
      splitMember: [
        { userId: 'user1', amount: 100 },
        { userId: 'user2', amount: 100 }
      ],
      splitType: 'equally'
    };

    const response = await mockExpensesAPI.createExpense(expenseData, mockToken);
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.description).toBe('Team Lunch');
    expect(response.body.data.amount).toBe(200);
  });

  test('should reject expense creation without token', async () => {
    const expenseData = {
      description: 'Test Expense',
      amount: 100
    };

    const response = await mockExpensesAPI.createExpense(expenseData, null);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  test('should reject expense with invalid paidBy amounts', async () => {
    const expenseData = {
      groupId: mockGroupId,
      description: 'Invalid Expense',
      amount: 100,
      paidBy: [{ userId: 'user1', amount: 50 }], // doesn't match total
      splitMember: [{ userId: 'user1', amount: 100 }],
      splitType: 'equally'
    };

    const response = await mockExpensesAPI.createExpense(expenseData, mockToken);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Sum of paidBy amounts must equal total expense amount');
  });

  test('should get expenses for group', async () => {
    const response = await mockExpensesAPI.getExpenses(mockGroupId, mockToken);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].description).toBe('Dinner');
    expect(response.body[1].description).toBe('Movie');
  });

  test('should reject getting expenses without token', async () => {
    const response = await mockExpensesAPI.getExpenses(mockGroupId, null);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  test('should update expense', async () => {
    const updateData = {
      description: 'Updated Dinner',
      amount: 150
    };

    const response = await mockExpensesAPI.updateExpense('expense1', updateData, mockToken);
    expect(response.status).toBe(200);
    expect(response.body.description).toBe('Updated Dinner');
    expect(response.body.amount).toBe(150);
  });

  test('should delete expense', async () => {
    const response = await mockExpensesAPI.deleteExpense('expense1', mockToken);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Expense deleted successfully');
  });

  test('complete expense workflow', async () => {
    // Create expense
    const expenseData = {
      groupId: mockGroupId,
      description: 'Workflow Test',
      amount: 300,
      paidBy: [{ userId: 'user1', amount: 300 }],
      splitMember: [
        { userId: 'user1', amount: 100 },
        { userId: 'user2', amount: 100 },
        { userId: 'user3', amount: 100 }
      ],
      splitType: 'equally'
    };

    const createResponse = await mockExpensesAPI.createExpense(expenseData, mockToken);
    expect(createResponse.status).toBe(201);

    // Get expenses
    const getResponse = await mockExpensesAPI.getExpenses(mockGroupId, mockToken);
    expect(getResponse.status).toBe(200);

    // Update expense
    const updateResponse = await mockExpensesAPI.updateExpense(
      createResponse.body.data._id,
      { description: 'Updated Workflow Test' },
      mockToken
    );
    expect(updateResponse.status).toBe(200);

    // Delete expense
    const deleteResponse = await mockExpensesAPI.deleteExpense(
      createResponse.body.data._id,
      mockToken
    );
    expect(deleteResponse.status).toBe(200);
  });
});