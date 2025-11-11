const express = require('express');
const router = express.Router();
const { 
  addMemberToGroup, 
  removeMemberFromGroup, 
  getGroupMembers, 
  getUserGroups,
  checkMembership,
  checkConnectionBeforeAdd
} = require('../controllers/groupMembershipController');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// Group membership routes
router.post('/', addMemberToGroup);
router.delete('/remove', removeMemberFromGroup);
router.get('/group/:groupId', getGroupMembers);
router.get('/user/:userId', getUserGroups);
router.get('/check/:userId/:groupId', checkMembership);
router.get('/connection/:userId/:groupId', checkConnectionBeforeAdd);

module.exports = router; 