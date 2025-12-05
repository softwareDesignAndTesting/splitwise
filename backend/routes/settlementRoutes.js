const express = require('express');
const router = express.Router();
const { getUnsettledTransactions, settleGroup, getUserSettlements, settlePayment } = require('../controllers/settlementController');
const auth = require('../middleware/auth');

// Protected routes
router.get('/unsettled/:groupId', auth, getUnsettledTransactions);
router.post('/:groupId', auth, settleGroup);

// Get all settlements for a group
router.get('/group/:groupId', async (req, res) => {
  try {
    const settlementRepository = require('../repositories/settlementRepository');
    const settlements = await settlementRepository.findUnsettledByGroup(req.params.groupId);
    res.json(settlements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all settlements (settled and unsettled) for a user in a group
router.get('/user', getUserSettlements);

// Mark a settlement as settled
router.patch('/settle/:id', settlePayment);

// Test endpoint to check settlements for a group
router.get('/test/:groupId', async (req, res) => {
  try {
    const { processGroupSettlements } = require('../utils/algo');
    const settlements = await processGroupSettlements(req.params.groupId);
    res.json({ 
      groupId: req.params.groupId,
      settlements,
      count: settlements.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;



