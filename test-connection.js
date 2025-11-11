const mongoose = require('mongoose');
const User = require('./backend/model/userModel');
const Group = require('./backend/model/groupModel');
const GroupMembership = require('./backend/model/groupMembershipModel');

async function testConnection() {
  try {
    await mongoose.connect('mongodb://localhost:27017/splitwise');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Group.deleteMany({});
    await GroupMembership.deleteMany({});

    // Create test users
    const user1 = await User.create({ name: 'Alice', email: 'alice@test.com', password: 'pass123' });
    const user2 = await User.create({ name: 'Bob', email: 'bob@test.com', password: 'pass123' });
    const user3 = await User.create({ name: 'Charlie', email: 'charlie@test.com', password: 'pass123' });
    const user4 = await User.create({ name: 'David', email: 'david@test.com', password: 'pass123' });

    console.log('Created users:', [user1.name, user2.name, user3.name, user4.name]);

    // Create a group
    const group = await Group.create({ 
      name: 'Test Group', 
      description: 'Testing connections',
      createdBy: user1._id 
    });

    // Add Alice to group (first member)
    await GroupMembership.create({ userId: user1._id, groupId: group._id });
    console.log('Added Alice to group');

    // Add Bob to group (should connect Alice and Bob)
    await GroupMembership.create({ userId: user2._id, groupId: group._id });
    
    // Update mutual friends
    await User.findByIdAndUpdate(user1._id, { $addToSet: { mutualFriends: user2._id } });
    await User.findByIdAndUpdate(user2._id, { $addToSet: { mutualFriends: user1._id } });
    console.log('Added Bob to group and connected with Alice');

    // Add Charlie to group (should connect with Alice and Bob)
    await GroupMembership.create({ userId: user3._id, groupId: group._id });
    
    // Update mutual friends for all
    await User.findByIdAndUpdate(user1._id, { $addToSet: { mutualFriends: user3._id } });
    await User.findByIdAndUpdate(user2._id, { $addToSet: { mutualFriends: user3._id } });
    await User.findByIdAndUpdate(user3._id, { $addToSet: { mutualFriends: [user1._id, user2._id] } });
    console.log('Added Charlie to group');

    // Test degree calculations
    const findDegreeOfConnection = require('./backend/controllers/userDegree');
    
    console.log('\nTesting degrees:');
    console.log('Alice to Bob:', await findDegreeOfConnection(user1._id, user2._id));
    console.log('Alice to Charlie:', await findDegreeOfConnection(user1._id, user3._id));
    console.log('Bob to Charlie:', await findDegreeOfConnection(user2._id, user3._id));
    console.log('Alice to David:', await findDegreeOfConnection(user1._id, user4._id));
    console.log('Bob to David:', await findDegreeOfConnection(user2._id, user4._id));

    await mongoose.disconnect();
    console.log('\nTest completed');
  } catch (error) {
    console.error('Test error:', error);
  }
}

testConnection();