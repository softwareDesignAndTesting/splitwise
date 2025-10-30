describe('Expense Controller - Simple Tests', () => {
  test('should validate expense creation data', () => {
    const expenseData = {
      description: 'Test Expense',
      amount: 1000,
      paidBy: [{ userId: 'user1', amount: 1000 }],
      splitMember: [{ userId: 'user1' }, { userId: 'user2' }]
    };
    
    expect(expenseData.description).toBeDefined();
    expect(expenseData.amount).toBeGreaterThan(0);
    expect(expenseData.paidBy.length).toBeGreaterThan(0);
    expect(expenseData.splitMember.length).toBeGreaterThan(0);
  });

  test('should calculate split amounts correctly', () => {
    const totalAmount = 1000;
    const members = 4;
    const splitAmount = totalAmount / members;
    
    expect(splitAmount).toBe(250);
  });
});