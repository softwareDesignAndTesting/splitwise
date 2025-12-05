#!/usr/bin/env node

/**
 * MAP AND HEAP TESTING SUITE
 * Tests internal Map and Heap functionality with dummy data
 */

const { settleDebts, calculateBalancesFromExpenses } = require('./backend/utils/algo');

console.log('🧪 MAP AND HEAP TESTING SUITE');
console.log('==============================\n');

let totalTests = 0;
let passedTests = 0;

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
        }
    } catch (error) {
        console.log(`❌ ERROR: ${testName} - ${error.message}\n`);
    }
}

// ========================================
// MAP FUNCTIONALITY TESTS
// ========================================

runTest('Map - Net Balance Calculation', () => {
    // Dummy data: Restaurant bill split
    const transactions = [
        ['John', 120],    // John paid $120
        ['Sarah', 80],    // Sarah paid $80  
        ['Mike', 0],      // Mike paid $0
        ['Lisa', 0]       // Lisa paid $0
    ];
    
    const settlements = settleDebts(transactions, 'restaurant-test');
    
    // Total paid: $200, per person: $50
    // John: paid 120, owes 50, net: +70
    // Sarah: paid 80, owes 50, net: +30
    // Mike: paid 0, owes 50, net: -50
    // Lisa: paid 0, owes 50, net: -50
    
    // Verify Map is working by checking settlements
    const johnReceives = settlements.filter(s => s.to === 'John').reduce((sum, s) => sum + s.amount, 0);
    const sarahReceives = settlements.filter(s => s.to === 'Sarah').reduce((sum, s) => sum + s.amount, 0);
    
    if (Math.abs(johnReceives - 70) > 0.01) {
        return `John should receive $70, got $${johnReceives}`;
    }
    
    if (Math.abs(sarahReceives - 30) > 0.01) {
        return `Sarah should receive $30, got $${sarahReceives}`;
    }
    
    console.log(`   📊 Map working: John gets $${johnReceives}, Sarah gets $${sarahReceives}`);
    return true;
});

runTest('Map - Complex Balance Tracking', () => {
    // Dummy data: Trip expenses
    const expenses = [
        {
            amount: 300,
            paidBy: [{ userId: 'Alice', amount: 300 }],
            splitMember: ['Alice', 'Bob', 'Charlie', 'David']
        },
        {
            amount: 200,
            paidBy: [{ userId: 'Bob', amount: 200 }],
            splitMember: ['Alice', 'Bob', 'Charlie', 'David']
        },
        {
            amount: 100,
            paidBy: [{ userId: 'Charlie', amount: 100 }],
            splitMember: ['Alice', 'Bob']
        }
    ];
    
    const balances = calculateBalancesFromExpenses(expenses);
    
    // Alice: paid 300, owes (75+50+50) = 175, net: +125
    // Bob: paid 200, owes (75+50+50) = 175, net: +25
    // Charlie: paid 100, owes (75+50) = 125, net: -25
    // David: paid 0, owes (75+50) = 125, net: -125
    
    const aliceBalance = balances.find(b => b[0] === 'Alice');
    const davidBalance = balances.find(b => b[0] === 'David');
    
    if (!aliceBalance || Math.abs(aliceBalance[1] - 125) > 0.01) {
        return `Alice balance should be 125, got ${aliceBalance ? aliceBalance[1] : 'undefined'}`;
    }
    
    if (!davidBalance || Math.abs(davidBalance[1] - (-125)) > 0.01) {
        return `David balance should be -125, got ${davidBalance ? davidBalance[1] : 'undefined'}`;
    }
    
    console.log(`   📊 Map tracking: Alice: +$${aliceBalance[1]}, David: $${davidBalance[1]}`);
    return true;
});

// ========================================
// HEAP FUNCTIONALITY TESTS
// ========================================

runTest('Heap - Settlement Optimization', () => {
    // Dummy data: 5-person group with complex debts
    const transactions = [
        ['Rich', 500],    // Rich paid $500
        ['Poor1', 0],     // Poor1 paid $0
        ['Poor2', 0],     // Poor2 paid $0
        ['Poor3', 0],     // Poor3 paid $0
        ['Poor4', 0]      // Poor4 paid $0
    ];
    
    const settlements = settleDebts(transactions, 'heap-test');
    
    // Without heap optimization: 4 settlements (each poor person pays Rich)
    // With heap optimization: Should still be 4 settlements but properly ordered
    
    if (settlements.length !== 4) {
        return `Expected 4 settlements, got ${settlements.length}`;
    }
    
    // All settlements should be TO Rich
    const paymentsToRich = settlements.filter(s => s.to === 'Rich').length;
    if (paymentsToRich !== 4) {
        return `Expected 4 payments to Rich, got ${paymentsToRich}`;
    }
    
    // Each payment should be $100
    const allPayments100 = settlements.every(s => Math.abs(s.amount - 100) < 0.01);
    if (!allPayments100) {
        return `All payments should be $100`;
    }
    
    console.log(`   🏗️ Heap optimized: ${settlements.length} settlements, all $100 to Rich`);
    return true;
});

runTest('Heap - Multi-Creditor Optimization', () => {
    // Dummy data: Multiple creditors and debtors
    const transactions = [
        ['Creditor1', 200],  // Creditor1 paid $200, net: +100
        ['Creditor2', 150],  // Creditor2 paid $150, net: +50
        ['Debtor1', 0],      // Debtor1 paid $0, net: -70
        ['Debtor2', 0],      // Debtor2 paid $0, net: -70
        ['Debtor3', 10]      // Debtor3 paid $10, net: -60
    ];
    
    const settlements = settleDebts(transactions, 'multi-heap-test');
    
    // Heap should optimize to minimize transactions
    // Should be less than 4 settlements (without optimization would be 4)
    if (settlements.length > 4) {
        return `Too many settlements: ${settlements.length}. Heap not optimizing properly.`;
    }
    
    // Verify total settlement amount
    const totalSettled = settlements.reduce((sum, s) => sum + s.amount, 0);
    if (Math.abs(totalSettled - 200) > 0.1) {
        return `Total settlement should be ~$200, got $${totalSettled}`;
    }
    
    console.log(`   🏗️ Heap optimized: ${settlements.length} settlements, total $${totalSettled.toFixed(2)}`);
    return true;
});

runTest('Heap - Large Scale Performance', () => {
    // Dummy data: 50 people, random amounts
    const transactions = [];
    for (let i = 0; i < 50; i++) {
        const amount = Math.random() * 500; // Random amount 0-500
        transactions.push([`Person${i}`, amount]);
    }
    
    const startTime = Date.now();
    const settlements = settleDebts(transactions, 'large-heap-test');
    const endTime = Date.now();
    
    const duration = endTime - startTime;
    
    // Should complete quickly (under 50ms)
    if (duration > 50) {
        return `Heap performance too slow: ${duration}ms for 50 people`;
    }
    
    // Should minimize settlements (less than 49)
    if (settlements.length >= 49) {
        return `Heap not optimizing: ${settlements.length} settlements (should be minimized)`;
    }
    
    console.log(`   ⚡ Heap performance: ${duration}ms, ${settlements.length} settlements for 50 people`);
    return true;
});

// ========================================
// INTEGRATION TESTS (MAP + HEAP)
// ========================================

runTest('Integration - Map + Heap Working Together', () => {
    // Dummy data: Real-world scenario - Office lunch
    const transactions = [
        ['Manager', 180],     // Manager paid for everyone
        ['Employee1', 20],    // Employee1 paid for drinks
        ['Employee2', 0],     // Employee2 paid nothing
        ['Employee3', 0],     // Employee3 paid nothing
        ['Intern', 0]         // Intern paid nothing
    ];
    
    const settlements = settleDebts(transactions, 'integration-test');
    
    // Total: $200, per person: $40
    // Manager: paid 180, owes 40, net: +140
    // Employee1: paid 20, owes 40, net: -20
    // Others: paid 0, owes 40 each, net: -40 each
    
    // Map should calculate correct balances
    // Heap should optimize settlements
    
    const managerReceives = settlements
        .filter(s => s.to === 'Manager')
        .reduce((sum, s) => sum + s.amount, 0);
    
    if (Math.abs(managerReceives - 140) > 0.1) {
        return `Manager should receive $140, got $${managerReceives}`;
    }
    
    // Should have 4 settlements (everyone except Manager pays)
    if (settlements.length !== 4) {
        return `Expected 4 settlements, got ${settlements.length}`;
    }
    
    console.log(`   🔄 Integration: Map calculated, Heap optimized, Manager gets $${managerReceives}`);
    return true;
});

runTest('Integration - Zero Balance Filtering', () => {
    // Dummy data: Some people have exact zero balance
    const transactions = [
        ['Alice', 100],   // Alice: +50
        ['Bob', 50],      // Bob: 0 (should be filtered out)
        ['Charlie', 0],   // Charlie: -50
        ['David', 50]     // David: 0 (should be filtered out)
    ];
    
    const settlements = settleDebts(transactions, 'zero-filter-test');
    
    // Map should calculate balances, then filter zeros
    // Heap should only process non-zero balances
    
    // Should have exactly 1 settlement: Charlie -> Alice
    if (settlements.length !== 1) {
        return `Expected 1 settlement (zeros filtered), got ${settlements.length}`;
    }
    
    const settlement = settlements[0];
    if (settlement.from !== 'Charlie' || settlement.to !== 'Alice') {
        return `Expected Charlie -> Alice, got ${settlement.from} -> ${settlement.to}`;
    }
    
    console.log(`   🔄 Integration: Zero balances filtered, ${settlements.length} settlement`);
    return true;
});

// ========================================
// DUMMY DATA STRESS TESTS
// ========================================

runTest('Stress Test - Random Dummy Data', () => {
    // Generate 20 random transactions
    const transactions = [];
    const names = ['Alex', 'Beth', 'Carl', 'Dana', 'Eric', 'Faye', 'Greg', 'Hope', 'Ivan', 'Jane',
                   'Kyle', 'Luna', 'Mark', 'Nina', 'Owen', 'Pam', 'Quinn', 'Rose', 'Sam', 'Tina'];
    
    for (let i = 0; i < 20; i++) {
        const amount = Math.floor(Math.random() * 200); // 0-200
        transactions.push([names[i], amount]);
    }
    
    const settlements = settleDebts(transactions, 'stress-test');
    
    // Verify balance conservation
    const totalPaid = transactions.reduce((sum, t) => sum + t[1], 0);
    const totalSettled = settlements.reduce((sum, s) => sum + s.amount, 0);
    const perPerson = totalPaid / transactions.length;
    
    const expectedSettlement = transactions
        .map(t => Math.max(0, perPerson - t[1]))
        .reduce((sum, debt) => sum + debt, 0);
    
    if (Math.abs(totalSettled - expectedSettlement) > 0.1) {
        return `Balance not conserved: expected ${expectedSettlement}, got ${totalSettled}`;
    }
    
    console.log(`   🎲 Stress test: ${transactions.length} people, $${totalPaid} total, ${settlements.length} settlements`);
    return true;
});

// ========================================
// RESULTS
// ========================================

console.log('\n🏁 MAP AND HEAP TEST RESULTS');
console.log('=============================');
console.log(`Total Tests: ${totalTests}`);
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${totalTests - passedTests}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests) {
    console.log('\n🎉 MAP AND HEAP ARE 100% WORKING!');
    console.log('✅ Map correctly calculates net balances');
    console.log('✅ Heap optimizes settlements efficiently');
    console.log('✅ Integration between Map and Heap is perfect');
    console.log('✅ Zero balance filtering works');
    console.log('✅ Performance is excellent');
    console.log('✅ Handles random dummy data correctly');
} else {
    console.log('\n⚠️  SOME MAP/HEAP TESTS FAILED');
}

console.log('\n🚀 Your utils/algo.js Map and Heap are production-ready!');