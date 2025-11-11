async function findDegreeOfConnection(userId, targetId) {
  const User = require('../model/userModel');
  
  console.log(`Finding degree between ${userId} and ${targetId}`);
  
  // Same user
  if (userId.toString() === targetId.toString()) {
    return 0;
  }

  // Check direct connection (degree 1)
  const user = await User.findById(userId);
  if (!user) return -1;
  
  const userFriends = user.mutualFriends || [];
  const isDirectFriend = userFriends.some(friend => friend.toString() === targetId.toString());
  
  if (isDirectFriend) {
    console.log('Direct connection found (degree 1)');
    return 1;
  }

  // BFS for degree 2 and 3
  const visited = new Set([userId.toString()]);
  let queue = [{ id: userId, degree: 0 }];

  while (queue.length > 0) {
    const { id: currentUserId, degree } = queue.shift();
    
    if (degree >= 3) continue;

    let currentUser;
    try {
      currentUser = await User.findById(currentUserId);
    } catch (err) {
      console.error('Error fetching user:', err);
      continue;
    }

    if (!currentUser || !currentUser.mutualFriends) continue;

    for (let friend of currentUser.mutualFriends) {
      const friendId = friend.toString();
      
      if (!visited.has(friendId)) {
        visited.add(friendId);
        
        // Check if this friend is the target
        if (friendId === targetId.toString()) {
          console.log(`Connection found at degree ${degree + 1}`);
          return degree + 1;
        }
        
        // Add to queue for next level if within limit
        if (degree + 1 < 3) {
          queue.push({ id: friend, degree: degree + 1 });
        }
      }
    }
  }

  console.log('No connection found');
  return -1;
}

module.exports = findDegreeOfConnection;