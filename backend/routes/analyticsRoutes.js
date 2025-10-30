const express = require('express');
const router = express.Router();
const { getUserAnalytics, getGroupAnalytics } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// Get user expense analytics
router.get('/user', auth, getUserAnalytics);

// Get group analytics
router.get('/group/:groupId', auth, getGroupAnalytics);

module.exports = router;