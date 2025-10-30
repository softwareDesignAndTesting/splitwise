import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExpenseForm from '../../../frontend/src/components/ExpenseForm';

// Mock props
const mockProps = {
  groupId: 'group123',
  members: [
    { _id: 'user1', name: 'User 1' },
    { _id: 'user2', name: 'User 2' }
  ],
  onExpenseAdded: jest.fn()
};

global.fetch = jest.fn();

describe('ExpenseForm Component Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockProps.onExpenseAdded.mockClear();
  });

  test('renders expense form correctly', () => {
    render(<ExpenseForm {...mockProps} />);
    
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByText(/who paid/i)).toBeInTheDocument();
    expect(screen.getByText(/split between/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add expense/i })).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(<ExpenseForm {...mockProps} />);
    
    const submitButton = screen.getByRole('button', { name: /add expense/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
    });
  });

  test('validates amount is positive number', async () => {
    render(<ExpenseForm {...mockProps} />);
    
    const amountInput = screen.getByLabelText(/amount/i);
    fireEvent.change(amountInput, { target: { value: '-100' } });
    
    const submitButton = screen.getByRole('button', { name: /add expense/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/amount must be positive/i)).toBeInTheDocument();
    });
  });

  test('submits expense successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { _id: 'expense123' }
      })
    });

    render(<ExpenseForm {...mockProps} />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test Expense' }
    });
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: '1000' }
    });
    
    // Select payer
    const payerCheckbox = screen.getByLabelText(/user 1.*paid/i);
    fireEvent.click(payerCheckbox);
    
    // Select split members
    const splitCheckbox = screen.getByLabelText(/user 1.*split/i);
    fireEvent.click(splitCheckbox);
    
    const submitButton = screen.getByRole('button', { name: /add expense/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/expenses', expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }));
      expect(mockProps.onExpenseAdded).toHaveBeenCalled();
    });
  });

  test('handles split type change', () => {
    render(<ExpenseForm {...mockProps} />);
    
    const splitTypeSelect = screen.getByLabelText(/split type/i);
    fireEvent.change(splitTypeSelect, { target: { value: 'custom' } });
    
    expect(splitTypeSelect.value).toBe('custom');
  });

  test('calculates equal split correctly', () => {
    render(<ExpenseForm {...mockProps} />);
    
    // Set amount
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: '1000' }
    });
    
    // Select both members for split
    const splitCheckboxes = screen.getAllByLabelText(/split/i);
    splitCheckboxes.forEach(checkbox => fireEvent.click(checkbox));
    
    // Check if equal amounts are calculated (500 each for 2 members)
    const amountInputs = screen.getAllByDisplayValue('500');
    expect(amountInputs.length).toBeGreaterThan(0);
  });
});