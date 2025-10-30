import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../../frontend/src/App';

// Mock fetch globally
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

const MockedApp = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

describe('User Flow Integration Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  test('complete user registration and login flow', async () => {
    // Mock successful signup
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        userId: 'user123',
        message: 'User registered successfully'
      })
    });

    // Mock successful login
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        userId: 'user123',
        token: 'mockToken'
      })
    });

    render(<MockedApp />);

    // Navigate to signup
    const signupLink = screen.getByText(/sign up/i);
    fireEvent.click(signupLink);

    // Fill signup form
    await waitFor(() => {
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const signupButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signupButton);
    });

    // Verify signup success and redirect to login
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/users/signup', expect.any(Object));
    });

    // Now login with same credentials
    await waitFor(() => {
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const loginButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(loginButton);
    });

    // Verify login success
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/users/login', expect.any(Object));
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mockToken');
    });
  });

  test('group creation and expense addition flow', async () => {
    // Mock authenticated user
    localStorageMock.getItem.mockReturnValue('mockToken');

    // Mock user profile fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com'
      })
    });

    // Mock group creation
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        _id: 'group123',
        name: 'Test Group',
        description: 'Test Description'
      })
    });

    // Mock expense creation
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          _id: 'expense123',
          description: 'Test Expense',
          amount: 1000
        }
      })
    });

    render(<MockedApp />);

    // Wait for dashboard to load
    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });

    // Create new group
    const createGroupButton = screen.getByText(/create group/i);
    fireEvent.click(createGroupButton);

    await waitFor(() => {
      const groupNameInput = screen.getByLabelText(/group name/i);
      const groupDescInput = screen.getByLabelText(/description/i);

      fireEvent.change(groupNameInput, { target: { value: 'Test Group' } });
      fireEvent.change(groupDescInput, { target: { value: 'Test Description' } });

      const submitButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(submitButton);
    });

    // Verify group creation
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/groups', expect.objectContaining({
        method: 'POST'
      }));
    });

    // Add expense to group
    const addExpenseButton = screen.getByText(/add expense/i);
    fireEvent.click(addExpenseButton);

    await waitFor(() => {
      const descInput = screen.getByLabelText(/description/i);
      const amountInput = screen.getByLabelText(/amount/i);

      fireEvent.change(descInput, { target: { value: 'Test Expense' } });
      fireEvent.change(amountInput, { target: { value: '1000' } });

      const submitExpenseButton = screen.getByRole('button', { name: /add expense/i });
      fireEvent.click(submitExpenseButton);
    });

    // Verify expense creation
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/expenses', expect.objectContaining({
        method: 'POST'
      }));
    });
  });

  test('settlement calculation flow', async () => {
    // Mock authenticated user
    localStorageMock.getItem.mockReturnValue('mockToken');

    // Mock settlements fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([
        {
          from: 'user1',
          to: 'user2',
          amount: 500
        }
      ])
    });

    render(<MockedApp />);

    // Navigate to settlements
    const settlementsLink = screen.getByText(/settlements/i);
    fireEvent.click(settlementsLink);

    // Calculate settlements
    await waitFor(() => {
      const calculateButton = screen.getByText(/calculate settlements/i);
      fireEvent.click(calculateButton);
    });

    // Verify settlements are displayed
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/settlements/group/group123', expect.any(Object));
      expect(screen.getByText(/₹500/)).toBeInTheDocument();
    });
  });
});