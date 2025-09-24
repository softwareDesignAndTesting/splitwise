const express = require('express');
const router = express.Router();
const { getUserAnalytics } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// Get user expense analytics
router.get('/user', auth, getUserAnalytics);

module.exports = router;