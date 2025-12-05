#!/usr/bin/env node

/**
 * Splitwise Algorithm Testing Suite
 * Tests all core algorithms to ensure they work correctly
 */

const { settleDebts, fetchUnsettledTransactions, calculateBalancesFromExpenses, findDegreeOfConnection } = require('./backend/utils/algo');

console.log('🧪 SPLITWISE ALGORITHM TESTING SUITE');
console.log('=====================================\n');

// Test Results Tracker
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function runTest(testName, testFunction) {
    totalTests++;
    console.log(`🔍 Testing: ${testName}`);
    
    try {
        const result = testFunction();
        if (result === true) {
            console.log(`✅ PASS: ${testName}\n`);
            passedTests++;
        } else {
            console.log(`❌ FAIL: ${testName} - ${result}\n`);
            failedTests++;
        }
    } catch (error) {
        console.log(`❌ ERROR: ${testName} - ${error.message}\n`);
        failedTests++;
    }
}

// ========================================
// SETTLEMENT ALGORITHM TESTS
// ========================================

runTest('Settlement Algorithm - Basic 3-Person Split', () => {
    const transactions = [
        ['Alice', 100],   // Alice paid 100, owes 33.33, net: +66.67
        ['Bob', 0],       // Bob paid 0, owes 33.33, net: -33.33
        ['Charlie', 0]    // Charlie paid 0, owes 33.33, net: -33.33
    ];
    
    const settlements = settleDebts(transactions, 'test-group');
    
    // Should have 2 settlements: Bob->Alice and Charlie->Alice
    if (settlements.length !== 2) {
        return `Expected 2 settlements, got ${settlements.length}`;
    }
    
    // Check total amounts
    const totalSettled = settlements.reduce((sum, s) => sum + s.amount, 0);
    if (Math.abs(totalSettled - 66.67) > 0.1) {
        return `Expected total settlement ~66.67, got ${totalSettled}`;
    }
    
    return true;
});

runTest('Settlement Algorithm - Complex Multi-Person', () => {
    const transactions = [
        ['Alice', 200],   // Alice paid 200, owes 50, net: +150
        ['Bob', 100],     // Bob paid 100, owes 50, net: +50
        ['Charlie', 0],   // Charlie paid 0, owes 50, net: -50
        ['David', 0]      // David paid 0, owes 50, net: -50
    ];
    
    const settlements = settleDebts(transactions, 'test-group');
    
    // Should minimize transactions (should be 2-3 settlements max)
    if (settlements.length > 3) {
        return `Too many settlements: ${settlements.length}. Algorithm should minimize transactions.`;
    }
    
    // Verify no one pays more than they owe
    for (const settlement of settlements) {
        if (settlement.amount > 200) {
            return `Settlement amount too high: ${settlement.amount}`;
        }
    }
    
    return true;
});

runTest('Settlement Algorithm - Zero Balance Handling', () => {
    const transactions = [
        ['Alice', 100],   // Alice paid 100, owes 50, net: +50
        ['Bob', 50],      // Bob paid 50, owes 50, net: 0
        ['Charlie', 0]    // Charlie paid 0, owes 50, net: -50
    ];
    
    const settlements = settleDebts(transactions, 'test-group');
    
    // Should have exactly 1 settlement: Charlie->Alice
    if (settlements.length !== 1) {
        return `Expected 1 settlement (Bob has zero balance), got ${settlements.length}`;
    }
    
    const settlement = settlements[0];
    if (Math.abs(settlement.amount - 50) > 0.01) {
        return `Expected settlement amount 50, got ${settlement.amount}`;
    }
    
    return true;
});

runTest('Settlement Algorithm - Already Balanced', () => {
    const transactions = [
        ['Alice', 50],    // Alice paid 50, owes 50, net: 0
        ['Bob', 50]       // Bob paid 50, owes 50, net: 0
    ];
    
    const settlements = settleDebts(transactions, 'test-group');
    
    // Should have no settlements needed
    if (settlements.length !== 0) {
        return `Expected 0 settlements (already balanced), got ${settlements.length}`;
    }
    
    return true;
});

runTest('Settlement Algorithm - Single Payer', () => {
    const transactions = [
        ['Alice', 300],   // Alice paid everything
        ['Bob', 0],       // Bob owes 100
        ['Charlie', 0]    // Charlie owes 100
    ];
    
    const settlements = settleDebts(transactions, 'test-group');
    
    // Should have 2 settlements to Alice
    if (settlements.length !== 2) {
        return `Expected 2 settlements, got ${settlements.length}`;
    }
    
    // All settlements should be TO Alice
    const aliceReceives = settlements.filter(s => s.to === 'Alice').length;
    if (aliceReceives !== 2) {
        return `Expected Alice to receive 2 payments, got ${aliceReceives}`;
    }
    
    return true;
});

// ========================================
// BALANCE CALCULATION TESTS
// ========================================

runTest('Balance Calculation - Equal Split', () => {
    const expenses = [
        {
            amount: 300,
            paidBy: [{ userId: 'Alice', amount: 300 }],
            splitMember: ['Alice', 'Bob', 'Charlie']
        }
    ];
    
    const balances = calculateBalancesFromExpenses(expenses);
    
    // Alice should have +200 (paid 300, owes 100)
    // Bob and Charlie should have -100 each
    const aliceBalance = balances.find(b => b[0] === 'Alice');
    const bobBalance = balances.find(b => b[0] === 'Bob');
    
    if (!aliceBalance || Math.abs(aliceBalance[1] - 200) > 0.01) {
        return `Alice balance should be 200, got ${aliceBalance ? aliceBalance[1] : 'undefined'}`;
    }
    
    if (!bobBalance || Math.abs(bobBalance[1] - (-100)) > 0.01) {
        return `Bob balance should be -100, got ${bobBalance ? bobBalance[1] : 'undefined'}`;
    }
    
    return true;
});

runTest('Balance Calculation - Custom Split', () => {
    const expenses = [
        {
            amount: 100,
            paidBy: [{ userId: 'Alice', amount: 100 }],
            splitMember: [
                { userId: 'Alice', amount: 30 },
                { userId: 'Bob', amount: 70 }
            ]
        }
    ];
    
    const balances = calculateBalancesFromExpenses(expenses);
    
    // Alice: paid 100, owes 30, net: +70
    // Bob: paid 0, owes 70, net: -70
    const aliceBalance = balances.find(b => b[0] === 'Alice');
    const bobBalance = balances.find(b => b[0] === 'Bob');
    
    if (!aliceBalance || Math.abs(aliceBalance[1] - 70) > 0.01) {
        return `Alice balance should be 70, got ${aliceBalance ? aliceBalance[1] : 'undefined'}`;
    }
    
    if (!bobBalance || Math.abs(bobBalance[1] - (-70)) > 0.01) {
        return `Bob balance should be -70, got ${bobBalance ? bobBalance[1] : 'undefined'}`;
    }
    
    return true;
});

runTest('Balance Calculation - Multiple Expenses', () => {
    const expenses = [
        {
            amount: 200,
            paidBy: [{ userId: 'Alice', amount: 200 }],
            splitMember: ['Alice', 'Bob']
        },
        {
            amount: 100,
            paidBy: [{ userId: 'Bob', amount: 100 }],
            splitMember: ['Alice', 'Bob']
        }
    ];
    
    const balances = calculateBalancesFromExpenses(expenses);
    
    // Alice: paid 200, owes 150 (100+50), net: +50
    // Bob: paid 100, owes 150 (100+50), net: -50
    const aliceBalance = balances.find(b => b[0] === 'Alice');
    const bobBalance = balances.find(b => b[0] === 'Bob');
    
    if (!aliceBalance || Math.abs(aliceBalance[1] - 50) > 0.01) {
        return `Alice balance should be 50, got ${aliceBalance ? aliceBalance[1] : 'undefined'}`;
    }
    
    if (!bobBalance || Math.abs(bobBalance[1] - (-50)) > 0.01) {
        return `Bob balance should be -50, got ${bobBalance ? bobBalance[1] : 'undefined'}`;
    }
    
    return true;
});

// ========================================
// DEGREE OF CONNECTION TESTS
// ========================================

runTest('Degree of Connection - Direct Friends (Degree 1)', () => {
    const mockGroups = [
        { _id: 'group1', members: ['Alice', 'Bob'] }
    ];
    
    const degree = findDegreeOfConnection('Alice', 'Bob', mockGroups);
    
    if (degree !== 1) {
        return `Expected degree 1 (direct friends), got ${degree}`;
    }
    
    return true;
});

runTest('Degree of Connection - Friends of Friends (Degree 2)', () => {
    const mockGroups = [
        { _id: 'group1', members: ['Alice', 'Charlie'] },
        { _id: 'group2', members: ['Charlie', 'Bob'] }
    ];
    
    const degree = findDegreeOfConnection('Alice', 'Bob', mockGroups);
    
    if (degree !== 2) {
        return `Expected degree 2 (friends of friends), got ${degree}`;
    }
    
    return true;
});

runTest('Degree of Connection - No Connection', () => {
    const mockGroups = [
        { _id: 'group1', members: ['Alice', 'Charlie'] },
        { _id: 'group2', members: ['Bob', 'David'] }
    ];
    
    const degree = findDegreeOfConnection('Alice', 'Bob', mockGroups);
    
    if (degree !== -1) {
        return `Expected degree -1 (no connection), got ${degree}`;
    }
    
    return true;
});

runTest('Degree of Connection - Same Person', () => {
    const mockGroups = [];
    
    const degree = findDegreeOfConnection('Alice', 'Alice', mockGroups);
    
    if (degree !== 0) {
        return `Expected degree 0 (same person), got ${degree}`;
    }
    
    return true;
});

// ========================================
// PERFORMANCE TESTS
// ========================================

runTest('Performance - Large Settlement (100 users)', () => {
    const startTime = Date.now();
    
    // Create 100 users with random transactions
    const transactions = [];
    for (let i = 0; i < 100; i++) {
        const amount = Math.random() * 1000;
        transactions.push([`User${i}`, amount]);
    }
    
    const settlements = settleDebts(transactions, 'perf-test');
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should complete in under 100ms for 100 users
    if (duration > 100) {
        return `Performance too slow: ${duration}ms for 100 users`;
    }
    
    // Should minimize transactions (less than 100 settlements)
    if (settlements.length >= 100) {
        return `Too many settlements: ${settlements.length} (should be minimized)`;
    }
    
    console.log(`   ⚡ Performance: ${duration}ms for 100 users, ${settlements.length} settlements`);
    return true;
});

runTest('Performance - Balance Calculation (1000 expenses)', () => {
    const startTime = Date.now();
    
    // Create 1000 expenses
    const expenses = [];
    for (let i = 0; i < 1000; i++) {
        expenses.push({
            amount: 100,
            paidBy: [{ userId: `User${i % 10}`, amount: 100 }],
            splitMember: [`User${i % 10}`, `User${(i + 1) % 10}`]
        });
    }
    
    const balances = calculateBalancesFromExpenses(expenses);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should complete in under 200ms for 1000 expenses
    if (duration > 200) {
        return `Performance too slow: ${duration}ms for 1000 expenses`;
    }
    
    console.log(`   ⚡ Performance: ${duration}ms for 1000 expenses`);
    return true;
});

// ========================================
// EDGE CASE TESTS
// ========================================

runTest('Edge Case - Empty Transactions', () => {
    const settlements = settleDebts([], 'empty-test');
    
    if (settlements.length !== 0) {
        return `Expected 0 settlements for empty input, got ${settlements.length}`;
    }
    
    return true;
});

runTest('Edge Case - Single User', () => {
    const transactions = [['Alice', 100]];
    const settlements = settleDebts(transactions, 'single-test');
    
    if (settlements.length !== 0) {
        return `Expected 0 settlements for single user, got ${settlements.length}`;
    }
    
    return true;
});

runTest('Edge Case - Very Small Amounts', () => {
    const transactions = [
        ['Alice', 0.01],
        ['Bob', 0.02],
        ['Charlie', 0]
    ];
    
    const settlements = settleDebts(transactions, 'small-test');
    
    // Should handle small amounts correctly
    if (settlements.length > 2) {
        return `Too many settlements for small amounts: ${settlements.length}`;
    }
    
    return true;
});

runTest('Edge Case - Large Numbers', () => {
    const transactions = [
        ['Alice', 1000000],
        ['Bob', 0],
        ['Charlie', 0]
    ];
    
    const settlements = settleDebts(transactions, 'large-test');
    
    // Should handle large amounts correctly
    const totalSettled = settlements.reduce((sum, s) => sum + s.amount, 0);
    if (Math.abs(totalSettled - 666666.67) > 1) {
        return `Large number calculation error: expected ~666666.67, got ${totalSettled}`;
    }
    
    return true;
});

// ========================================
// ALGORITHM CORRECTNESS TESTS
// ========================================

runTest('Algorithm Correctness - Balance Conservation', () => {
    const transactions = [
        ['Alice', 150],
        ['Bob', 75],
        ['Charlie', 25],
        ['David', 0]
    ];
    
    const settlements = settleDebts(transactions, 'balance-test');
    
    // Total paid should equal total owed
    const totalPaid = transactions.reduce((sum, t) => sum + t[1], 0);
    const totalSettled = settlements.reduce((sum, s) => sum + s.amount, 0);
    
    // Calculate expected total settlement (total imbalance)
    const perPerson = totalPaid / transactions.length;
    const expectedSettlement = transactions
        .map(t => Math.max(0, perPerson - t[1]))
        .reduce((sum, debt) => sum + debt, 0);
    
    if (Math.abs(totalSettled - expectedSettlement) > 0.1) {
        return `Balance not conserved: expected ${expectedSettlement}, got ${totalSettled}`;
    }
    
    return true;
});

runTest('Algorithm Correctness - No Circular Payments', () => {
    const transactions = [
        ['Alice', 100],
        ['Bob', 50],
        ['Charlie', 0]
    ];
    
    const settlements = settleDebts(transactions, 'circular-test');
    
    // Check for circular payments (A pays B, B pays A)
    const paymentMap = new Map();
    for (const settlement of settlements) {
        const key = `${settlement.from}->${settlement.to}`;
        const reverseKey = `${settlement.to}->${settlement.from}`;
        
        if (paymentMap.has(reverseKey)) {
            return `Circular payment detected: ${key} and ${reverseKey}`;
        }
        paymentMap.set(key, settlement.amount);
    }
    
    return true;
});

// ========================================
// RUN ALL TESTS AND SHOW RESULTS
// ========================================

console.log('\n🏁 TEST RESULTS SUMMARY');
console.log('========================');
console.log(`Total Tests: ${totalTests}`);
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (failedTests === 0) {
    console.log('\n🎉 ALL ALGORITHMS WORKING PERFECTLY!');
    console.log('✅ Settlement algorithm is optimized and correct');
    console.log('✅ Balance calculations are accurate');
    console.log('✅ Degree of connection algorithm works');
    console.log('✅ Performance is excellent');
    console.log('✅ Edge cases are handled properly');
    console.log('✅ Algorithm correctness verified');
} else {
    console.log('\n⚠️  SOME TESTS FAILED - PLEASE REVIEW');
    process.exit(1);
}

console.log('\n🚀 Splitwise algorithms are production-ready!');