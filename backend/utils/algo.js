const settlementRepository = require('../repositories/settlementRepository');
const { SettlementFactory } = require('../factories/settlementFactory');

function extractId(val) {
  if (!val) return val;
  if (typeof val === 'object' && val._id) return val._id;
  if (typeof val === 'string') {
    const match = val.match(/[a-fA-F0-9]{24}/);
    if (match) return match[0];
    return val;
  }
  return val;
}


class MaxHeap {
  constructor() { this.data = []; }
  push(item) { this.data.push(item); this.data.sort((a, b) => b[0] - a[0]); }
  pop() { return this.data.shift(); }
  isEmpty() { return this.data.length === 0; }
}



function fetchUnsettledTransactions(groupId, frontendTransactions = []) {
  try {
    // For testing, just use frontend transactions
    const settlements = settleDebts(frontendTransactions, groupId);
    return settlements;
  } catch (error) {
    console.error('Error in fetchUnsettledTransactions:', error);
    throw error;
  }
}


function settleDebts(balanceData, groupId) {
  console.log("settleDebts called with balances:", balanceData, groupId);
  
  // Handle empty data
  if (!balanceData || balanceData.length === 0) {
    return [];
  }
  
  // balanceData is already net balances [userId, balance]
  // Positive balance = they're owed money, negative = they owe money
  const net = new Map();
  
  for (const [user, balance] of balanceData) {
    const id = extractId(user).toString();
    net.set(id, balance);
  }

  // Debug
  console.log("Net balances:", net);

  // 2. Remove users with zero balance
  for (const [user, amt] of Array.from(net.entries())) {
    if (Math.abs(amt) < 0.01) net.delete(user);
  }

  // 3. Prepare MaxHeaps for creditors and debtors
  const creditors = new MaxHeap(); // [amount, userId] - people who are owed money
  const debtors = new MaxHeap();   // [amount, userId] - people who owe money
  
  for (const [user, amt] of net.entries()) {
    if (amt > 0.01) creditors.push([amt, user]);
    else if (amt < -0.01) debtors.push([-amt, user]); // store as positive for max heap
  }

  // 4. Settle debts using optimized algorithm
  const settlements = [];
  while (!creditors.isEmpty() && !debtors.isEmpty()) {
    const [creditAmt, creditUser] = creditors.pop();
    const [debtAmt, debtUser] = debtors.pop();
    const settleAmt = Math.min(creditAmt, debtAmt);

    if (creditUser !== debtUser && settleAmt > 0.01) {
      settlements.push({ from: debtUser, to: creditUser, amount: settleAmt });
    }

    if (creditAmt > settleAmt) creditors.push([creditAmt - settleAmt, creditUser]);
    if (debtAmt > settleAmt) debtors.push([debtAmt - settleAmt, debtUser]);
  }

  return settlements;
}

async function processGroupSettlements(groupId, frontendTransactions = []) {
  console.log("processGroupSettlements called", groupId, frontendTransactions);
  
  try {
    // Get expense repository to fetch actual expenses
    const expenseRepository = require('../repositories/expenseRepository');
    
    // Fetch all expenses for this group
    const expenses = await expenseRepository.findByGroup(groupId);
    console.log(`Found ${expenses.length} expenses for group ${groupId}`);
    
    if (expenses.length === 0 && frontendTransactions.length === 0) {
      console.log('No expenses or transactions found');
      return [];
    }
    
    // Calculate balances from expenses
    const balances = calculateBalancesFromExpenses(expenses);
    console.log('Calculated balances:', balances);
    
    // Convert balances to transactions format for settlement calculation
    const transactions = balances.map(([userId, balance]) => [userId, balance]);
    
    // Add any frontend transactions
    transactions.push(...frontendTransactions);
    
    // Calculate settlements
    const settlements = settleDebts(transactions, groupId);
    console.log(`Generated ${settlements.length} settlements`);
    
    return settlements;
    
  } catch (error) {
    console.error('Error in processGroupSettlements:', error);
    throw error;
  }
}

// Calculate balances from expense data
function calculateBalancesFromExpenses(expenses) {
  const balances = new Map();
  
  for (const expense of expenses) {
    const { amount, paidBy, splitMember } = expense;
    
    // Add what each person paid
    for (const payer of paidBy) {
      const userId = extractId(payer.userId || payer).toString();
      balances.set(userId, (balances.get(userId) || 0) + (payer.amount || 0));
    }
    
    // Subtract what each person owes
    if (Array.isArray(splitMember) && splitMember.length > 0) {
      // Check if splitMember has amount property (custom split)
      if (splitMember[0] && typeof splitMember[0] === 'object' && splitMember[0].amount !== undefined) {
        // Custom split with amounts
        for (const member of splitMember) {
          const userId = extractId(member.userId || member).toString();
          balances.set(userId, (balances.get(userId) || 0) - (member.amount || 0));
        }
      } else {
        // Equal split
        const perPersonAmount = amount / splitMember.length;
        for (const member of splitMember) {
          const userId = extractId(member.userId || member).toString();
          balances.set(userId, (balances.get(userId) || 0) - perPersonAmount);
        }
      }
    }
  }
  
  // Convert to array format
  return Array.from(balances.entries());
}

// Database-aware degree of connection calculation
async function findDegreeOfConnection(userId, targetId) {
  const findDegreeOfConnectionImpl = require('../controllers/userDegree');
  return await findDegreeOfConnectionImpl(userId, targetId);
}

module.exports = {
  fetchUnsettledTransactions,
  settleDebts,
  processGroupSettlements,
  calculateBalancesFromExpenses,
  findDegreeOfConnection
};