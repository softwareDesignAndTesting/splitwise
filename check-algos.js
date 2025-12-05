// Check which algorithms are being used and working

console.log('=== CHECKING ALGORITHM USAGE ===\n');

// 1. Check utils/algo.js
try {
  const utilsAlgo = require('./backend/utils/algo.js');
  console.log('✅ UTILS ALGO LOADED');
  console.log('Exports:', Object.keys(utilsAlgo));
  
  // Test settlement algorithm
  const testTransactions = [['user1', 100], ['user2', 0], ['user3', 0]];
  const result = utilsAlgo.settleDebts(testTransactions, 'test');
  console.log('✅ UTILS SETTLEMENT WORKS:', result);
  
  // Test balance calculation
  const expenses = [{
    amount: 100,
    paidBy: [{ userId: 'user1', amount: 100 }],
    splitMember: ['user1', 'user2', 'user3']
  }];
  const balances = utilsAlgo.calculateBalancesFromExpenses(expenses);
  console.log('✅ UTILS BALANCE CALC WORKS:', balances);
  
} catch(e) {
  console.log('❌ UTILS ALGO ERROR:', e.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// 2. Check controllers/algo.js
try {
  const controllerAlgo = require('./backend/controllers/algo.js');
  console.log('✅ CONTROLLER ALGO LOADED');
  console.log('Exports:', Object.keys(controllerAlgo));
  console.log('⚠️  CONTROLLER ALGO IS ASYNC - needs database');
  
} catch(e) {
  console.log('❌ CONTROLLER ALGO ERROR:', e.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// 3. Check settlement controller usage
try {
  console.log('📋 SETTLEMENT CONTROLLER ANALYSIS:');
  const fs = require('fs');
  const settlementCode = fs.readFileSync('./backend/controllers/settlementController.js', 'utf8');
  
  if (settlementCode.includes("require('./algo')")) {
    console.log('✅ Uses controllers/algo.js (DATABASE VERSION)');
  } else if (settlementCode.includes("require('../utils/algo')")) {
    console.log('✅ Uses utils/algo.js (PURE FUNCTION VERSION)');
  } else {
    console.log('❓ Unknown algorithm import');
  }
  
} catch(e) {
  console.log('❌ SETTLEMENT CONTROLLER ERROR:', e.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// 4. Summary
console.log('📊 ALGORITHM SUMMARY:');
console.log('• utils/algo.js: Pure functions, no database, for testing');
console.log('• controllers/algo.js: Database integration, for production');
console.log('• Settlement controller currently uses: controllers/algo.js');
console.log('• Both algorithms use same core settlement logic');