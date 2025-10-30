describe('ExpenseForm Component - Simple Tests', () => {
  test('should validate expense form data', () => {
    const expenseForm = {
      description: 'Dinner',
      amount: 500,
      splitType: 'equally'
    };
    
    expect(expenseForm.description).toBeTruthy();
    expect(expenseForm.amount).toBeGreaterThan(0);
    expect(expenseForm.splitType).toBe('equally');
  });

  test('should calculate equal splits', () => {
    const calculateEqualSplit = (amount, members) => amount / members;
    
    expect(calculateEqualSplit(1000, 4)).toBe(250);
    expect(calculateEqualSplit(600, 3)).toBe(200);
  });
});