#!/usr/bin/env node

/**
 * Test Settlement Controller Integration
 */

const { settleGroup } = require('./backend/controllers/settlementController');

console.log('🧪 TESTING SETTLEMENT CONTROLLER INTEGRATION');
console.log('===========================================\n');

// Mock request and response objects
const mockReq = {
  params: { groupId: 'test-group-123' },
  body: {
    transactions: [
      ['Alice', 300],  // Alice paid 300
      ['Bob', 0],      // Bob paid 0  
      ['Charlie', 0]   // Charlie paid 0
    ]
  }
};

const mockRes = {
  json: (data) => {
    console.log('✅ Settlement Controller Response:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.settlements && data.settlements.length > 0) {
      console.log('\n🎉 Settlement Controller Working Correctly!');
      console.log(`Generated ${data.settlements.length} settlements:`);
      data.settlements.forEach((settlement, index) => {
        console.log(`${index + 1}. ${settlement.from} pays ${settlement.to}: ₹${settlement.amount}`);
      });
    } else {
      console.log('\n❌ No settlements generated');
    }
  }
};

// Test the settlement controller
async function testSettlementController() {
  try {
    console.log('🔍 Testing Settlement Controller with mock data...\n');
    console.log('Input transactions:');
    mockReq.body.transactions.forEach(([user, amount]) => {
      console.log(`- ${user}: ₹${amount}`);
    });
    console.log('');
    
    await settleGroup(mockReq, mockRes);
    
  } catch (error) {
    console.error('❌ Error testing settlement controller:', error.message);
  }
}

testSettlementController();