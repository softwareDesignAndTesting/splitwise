const GroupMembership = require('../model/groupMembershipModel');
const User = require('../model/userModel');
const Group = require('../model/groupModel');

const addMemberToGroup = async (req, res) => {
  try {
    const { userId, groupId } = req.body;
    const findDegreeOfConnection = require('./userDegree');

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found with this id' });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const existingMembership = await GroupMembership.findOne({ userId, groupId });
    if (existingMembership) {
      return res.status(400).json({ message: 'User is already a member of this group' });
    }

    // Get existing group members
    const existingMembers = await GroupMembership.find({ groupId })
      .populate('userId', '_id name')
      .lean();

    // Check degree of connection with existing members
    let connectionDegree = -1;
    if (existingMembers.length > 0) {
      for (let member of existingMembers) {
        const degree = await findDegreeOfConnection(userId, member.userId._id);
        if (degree !== -1 && (connectionDegree === -1 || degree < connectionDegree)) {
          connectionDegree = degree;
        }
      }
    }

    // Create membership
    const membership = await GroupMembership.create({
      userId,
      groupId,
      joinedAt: new Date()
    });

    // Now get ALL group members (including the new one)
    const allMembers = await GroupMembership.find({ groupId })
      .populate('userId', '_id name')
      .lean();

    // Update mutual friends for ALL members in the group
    const allMemberIds = allMembers.map(member => member.userId._id);
    
    for (let member of allMembers) {
      const otherMemberIds = allMemberIds.filter(id => !id.equals(member.userId._id));
      
      await User.findByIdAndUpdate(member.userId._id, {
        $addToSet: { mutualFriends: { $each: otherMemberIds } }
      });
    }

    const populatedMembership = await GroupMembership.findById(membership._id)
      .populate('userId', 'name email')
      .populate('groupId', 'name');

    res.status(201).json({
      ...populatedMembership.toObject(),
      connectionDegree
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeMemberFromGroup = async (req, res) => {
  try {
    const { userId, groupId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found with this id' });
    }

    const membership = await GroupMembership.findOneAndDelete({ userId, groupId });
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    // Remove mutual friend connections when leaving group
    const remainingMembers = await GroupMembership.find({ groupId })
      .populate('userId', '_id')
      .lean();
    
    const remainingMemberIds = remainingMembers.map(member => member.userId._id);
    
    // Remove connections from user leaving
    await User.findByIdAndUpdate(userId, {
      $pull: { mutualFriends: { $in: remainingMemberIds } }
    });
    
    // Remove user from remaining members' friend lists
    for (let member of remainingMembers) {
      await User.findByIdAndUpdate(member.userId._id, {
        $pull: { mutualFriends: userId }
      });
    }

    res.json({ message: 'Member removed from group successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getGroupMembers = async (req, res) => {
  try {
    const memberships = await GroupMembership.find({ groupId: req.params.groupId })
      .populate('userId', 'name email')
      .populate('groupId', 'name')
      .sort({ joinedAt: 1 })
      .lean();

    res.json(memberships);
  } catch (error) {
    console.error('Get group members error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserGroups = async (req, res) => {
  try {
    const memberships = await GroupMembership.find({ userId: req.params.userId })
      .populate('groupId')
      .lean();
    // Return only the group objects
    res.json(memberships.map(m => m.groupId));
  } catch (error) {
    console.error('Get user groups error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const checkMembership = async (req, res) => {
  try {
    const { userId, groupId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found with this id' });
    }

    const membership = await GroupMembership.findOne({ userId, groupId });

    res.json({
      isMember: !!membership,
      membership: membership ? await membership.populate('userId', 'name email').populate('groupId', 'name') : null
    });
  } catch (error) {
    console.error('Check membership error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// New function to check connection before adding
const checkConnectionBeforeAdd = async (req, res) => {
  try {
    const { userId, groupId } = req.params;
    const findDegreeOfConnection = require('./userDegree');

    const existingMembers = await GroupMembership.find({ groupId })
      .populate('userId', '_id name')
      .lean();

    if (existingMembers.length === 0) {
      return res.json({ connectionDegree: 0, message: 'First member in group' });
    }

    let minDegree = -1;
    let connectionDetails = [];

    for (let member of existingMembers) {
      const degree = await findDegreeOfConnection(userId, member.userId._id);
      connectionDetails.push({
        memberName: member.userId.name,
        degree: degree
      });
      
      if (degree !== -1 && (minDegree === -1 || degree < minDegree)) {
        minDegree = degree;
      }
    }

    res.json({
      connectionDegree: minDegree,
      connectionDetails,
      canAdd: minDegree !== -1 && minDegree <= 3
    });
  } catch (error) {
    console.error('Check connection error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addMemberToGroup,
  removeMemberFromGroup,
  getGroupMembers,
  getUserGroups,
  checkMembership,
  checkConnectionBeforeAdd
};
