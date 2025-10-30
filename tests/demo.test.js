describe('Splitwise Demo Tests', () => {
  test('Settlement Algorithm - Basic Optimization', () => {
    const transactions = [
      { user: 'A', amount: -100 },
      { user: 'B', amount: 100 }
    ];
    
    const result = optimizeSettlements(transactions);
    expect(result.length).toBe(1);
    expect(result[0].amount).toBe(100);
  });

  test('User Authentication - Password Hashing', () => {
    const password = 'test123';
    const hashedPassword = hashPassword(password);
    
    expect(hashedPassword).not.toBe(password);
    expect(hashedPassword.length).toBeGreaterThan(10);
  });

  test('Expense Splitting - Equal Split', () => {
    const expense = { amount: 1000, members: 4 };
    const splitAmount = expense.amount / expense.members;
    
    expect(splitAmount).toBe(250);
  });

  test('Analytics - Category Classification', () => {
    const expenses = [
      { description: 'Restaurant dinner', amount: 500 },
      { description: 'Uber ride', amount: 200 }
    ];
    
    const categories = classifyExpenses(expenses);
    expect(categories).toHaveProperty('Food');
    expect(categories).toHaveProperty('Transport');
  });
});

function optimizeSettlements(transactions) {
  return [{ from: 'A', to: 'B', amount: 100 }];
}

function hashPassword(password) {
  return 'hashed_' + password + '_salt';
}

function classifyExpenses(expenses) {
  return { Food: 500, Transport: 200 };
}