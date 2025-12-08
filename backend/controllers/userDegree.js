const GroupMembership = require('../model/groupMembershipModel');

/**
 * Find degree of connection between two users
 * Degree 1: Direct connection (same group)
 * Degree 2: Connected through 1 mutual friend
 * Degree 3+: Connected through multiple mutual friends
 */
async function findDegreeOfConnection(userId1, userId2) {
  try {
    // Same user
    if (userId1.toString() === userId2.toString()) {
      return 0;
    }

    // Get all groups for both users
    const user1Groups = await GroupMembership.find({ userId: userId1 }).select('groupId');
    const user2Groups = await GroupMembership.find({ userId: userId2 }).select('groupId');
    
    const user1GroupIds = user1Groups.map(g => g.groupId.toString());
    const user2GroupIds = user2Groups.map(g => g.groupId.toString());
    
    // Check for direct connection (degree 1) - same group
    const commonGroups = user1GroupIds.filter(groupId => user2GroupIds.includes(groupId));
    if (commonGroups.length > 0) {
      return 1;
    }
    
    // Build connection graph for BFS
    const connections = new Map();
    
    // Get all group memberships to build the graph
    const allMemberships = await GroupMembership.find({}).populate('userId', '_id').populate('groupId', '_id');
    
    // Group memberships by group
    const groupMembers = new Map();
    for (const membership of allMemberships) {
      const groupId = membership.groupId._id.toString();
      const userId = membership.userId._id.toString();
      
      if (!groupMembers.has(groupId)) {
        groupMembers.set(groupId, []);
      }
      groupMembers.get(groupId).push(userId);
    }
    
    // Build adjacency list - users connected if they're in same group
    for (const [groupId, members] of groupMembers.entries()) {
      for (let i = 0; i < members.length; i++) {
        for (let j = i + 1; j < members.length; j++) {
          const user1 = members[i];
          const user2 = members[j];
          
          if (!connections.has(user1)) connections.set(user1, new Set());
          if (!connections.has(user2)) connections.set(user2, new Set());
          
          connections.get(user1).add(user2);
          connections.get(user2).add(user1);
        }
      }
    }
    
    // BFS to find shortest path
    const visited = new Set();
    const queue = [{ user: userId1.toString(), degree: 0 }];
    visited.add(userId1.toString());
    
    while (queue.length > 0) {
      const { user, degree } = queue.shift();
      
      // Limit search to 3 degrees
      if (degree >= 3) continue;
      
      const neighbors = connections.get(user) || new Set();
      for (const neighbor of neighbors) {
        if (neighbor === userId2.toString()) {
          return degree + 1;
        }
        
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push({ user: neighbor, degree: degree + 1 });
        }
      }
    }
    
    return -1; // No connection found within 3 degrees
    
  } catch (error) {
    console.error('Error finding degree of connection:', error);
    return -1;
  }
}

module.exports = findDegreeOfConnection;