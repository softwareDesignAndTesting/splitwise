// Quick test script for degree of connection
const mongoose = require('mongoose');
const User = require('./backend/model/userModel');
const findDegreeOfConnection = require('./backend/controllers/userDegree');

async function testDegreeConnection() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/splitwise', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Get all users to test with
    const users = await User.find({}, 'name mutualFriends').populate('mutualFriends', 'name');
    
    console.log('\nUsers and their mutual friends:');
    users.forEach(user => {
      console.log(`${user.name} (${user._id}): [${user.mutualFriends.map(f => f.name).join(', ')}]`);
    });

    if (users.length >= 2) {
      const user1 = users[0];
      const user2 = users[1];
      
      console.log(`\nTesting degree between ${user1.name} and ${user2.name}:`);
      const degree = await findDegreeOfConnection(user1._id, user2._id);
      console.log(`Degree of connection: ${degree}`);
      
      if (users.length >= 3) {
        const user3 = users[2];
        console.log(`\nTesting degree between ${user1.name} and ${user3.name}:`);
        const degree2 = await findDegreeOfConnection(user1._id, user3._id);
        console.log(`Degree of connection: ${degree2}`);
      }
    }

    await mongoose.disconnect();
    console.log('\nTest completed');
  } catch (error) {
    console.error('Test error:', error);
  }
}

testDegreeConnection();