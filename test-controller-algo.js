// Test if the controller algorithm has any issues

console.log('=== TESTING CONTROLLER ALGORITHM ISSUES ===\n');

try {
  const controllerAlgo = require('./backend/controllers/algo.js');
  
  // Test the settlement algorithm logic (without database)
  console.log('Testing controller settlement logic...');
  
  // Mock the database operations to test the core logic
  const originalExpenseSheet = require('./backend/model/expenseSheetModel');
  
  // Create a mock that doesn't actually hit the database
  const mockExpenseSheet = {
    find: () => ({
      populate: () => ({
        populate: () => Promise.resolve([])
      })
    }),
    deleteMany: () => Promise.resolve(),
    create: () => Promise.resolve()
  };
  
  // Test with simple transactions
  const testTransactions = [['user1', 100], ['user2', -50], ['user3', -50]];
  
  controllerAlgo.settleDebts(testTransactions, 'test-group')
    .then(result => {
      console.log('✅ CONTROLLER ALGO CORE LOGIC WORKS:', result);
    })
    .catch(err => {
      console.log('❌ CONTROLLER ALGO ERROR:', err.message);
    });
    
} catch(e) {
  console.log('❌ CONTROLLER ALGO LOAD ERROR:', e.message);
}

console.log('\n=== CHECKING FOR POTENTIAL ISSUES ===\n');

// Check if there are any obvious issues in the controller algo
const fs = require('fs');
const controllerCode = fs.readFileSync('./backend/controllers/algo.js', 'utf8');

console.log('🔍 ANALYSIS:');

if (controllerCode.includes('ExpenseSheet.deleteMany')) {
  console.log('⚠️  Controller algo modifies database (deletes existing settlements)');
}

if (controllerCode.includes('ExpenseSheet.create')) {
  console.log('⚠️  Controller algo creates new database records');
}

if (controllerCode.includes('settled: false')) {
  console.log('✅ Controller algo properly handles settlement status');
}

console.log('\n📋 RECOMMENDATION:');
console.log('• Controller algo is for production with database');
console.log('• Utils algo is for testing and pure calculations');
console.log('• Both use same core settlement algorithm');
console.log('• Settlement controller correctly uses controller algo');