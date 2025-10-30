// End-to-End Tests using Playwright or Cypress
// This is a Playwright example

const { test, expect } = require('@playwright/test');

test.describe('Splitwise E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5173');
  });

  test('user can register, login and create expense', async ({ page }) => {
    // Register new user
    await page.click('text=Sign Up');
    await page.fill('[data-testid="name-input"]', 'E2E Test User');
    await page.fill('[data-testid="email-input"]', 'e2e@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="signup-button"]');

    // Verify registration success
    await expect(page.locator('text=Registration successful')).toBeVisible();

    // Login with registered user
    await page.fill('[data-testid="email-input"]', 'e2e@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Verify login success and dashboard load
    await expect(page.locator('text=Dashboard')).toBeVisible();

    // Create new group
    await page.click('[data-testid="create-group-button"]');
    await page.fill('[data-testid="group-name-input"]', 'E2E Test Group');
    await page.fill('[data-testid="group-description-input"]', 'Test group for E2E testing');
    await page.selectOption('[data-testid="group-type-select"]', 'general');
    await page.click('[data-testid="create-group-submit"]');

    // Verify group creation
    await expect(page.locator('text=E2E Test Group')).toBeVisible();

    // Add expense to group
    await page.click('[data-testid="add-expense-button"]');
    await page.fill('[data-testid="expense-description"]', 'E2E Test Expense');
    await page.fill('[data-testid="expense-amount"]', '1000');
    
    // Select payer
    await page.check('[data-testid="payer-checkbox-0"]');
    await page.fill('[data-testid="payer-amount-0"]', '1000');
    
    // Select split members
    await page.check('[data-testid="split-member-0"]');
    
    await page.click('[data-testid="add-expense-submit"]');

    // Verify expense creation
    await expect(page.locator('text=E2E Test Expense')).toBeVisible();
    await expect(page.locator('text=₹1,000')).toBeVisible();
  });

  test('user can view and settle expenses', async ({ page }) => {
    // Login as existing user (assuming user exists)
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Navigate to settlements
    await page.click('[data-testid="settlements-nav"]');

    // Select group for settlement
    await page.selectOption('[data-testid="group-select"]', 'group123');

    // Calculate settlements
    await page.click('[data-testid="calculate-settlements"]');

    // Verify settlements are displayed
    await expect(page.locator('[data-testid="settlement-list"]')).toBeVisible();
    
    // Check if settlement amounts are displayed
    const settlementAmount = page.locator('[data-testid="settlement-amount"]').first();
    await expect(settlementAmount).toContainText('₹');

    // Mark settlement as paid
    await page.click('[data-testid="mark-settled-button"]').first();
    
    // Verify settlement status update
    await expect(page.locator('text=Settled')).toBeVisible();
  });

  test('user can view analytics dashboard', async ({ page }) => {
    // Login
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Navigate to analytics
    await page.click('[data-testid="analytics-nav"]');

    // Verify analytics components are loaded
    await expect(page.locator('[data-testid="category-breakdown"]')).toBeVisible();
    await expect(page.locator('[data-testid="group-spending"]')).toBeVisible();
    await expect(page.locator('[data-testid="monthly-trend"]')).toBeVisible();

    // Check if charts are rendered
    await expect(page.locator('canvas')).toBeVisible(); // Assuming charts use canvas

    // Verify data is displayed
    await expect(page.locator('text=Food')).toBeVisible();
    await expect(page.locator('text=Transport')).toBeVisible();
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Login
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Verify mobile navigation
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
    
    // Open mobile menu
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-nav-menu"]')).toBeVisible();

    // Test mobile expense creation
    await page.click('[data-testid="create-expense-mobile"]');
    
    // Verify form is mobile-friendly
    const expenseForm = page.locator('[data-testid="expense-form"]');
    await expect(expenseForm).toBeVisible();
    
    // Check if form elements are properly sized for mobile
    const amountInput = page.locator('[data-testid="expense-amount"]');
    const boundingBox = await amountInput.boundingBox();
    expect(boundingBox.width).toBeGreaterThan(200); // Ensure input is wide enough
  });

  test('error handling works correctly', async ({ page }) => {
    // Test login with invalid credentials
    await page.fill('[data-testid="email-input"]', 'invalid@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');

    // Verify error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();

    // Test network error handling
    // Simulate network failure
    await page.route('**/api/users/login', route => route.abort());
    
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Verify network error message
    await expect(page.locator('text=Network error')).toBeVisible();
  });
});