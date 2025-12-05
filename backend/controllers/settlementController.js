const { fetchUnsettledTransactions, processGroupSettlements } = require('../utils/algo');
const settlementRepository = require('../repositories/settlementRepository');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const getUnsettledTransactions = asyncHandler(async (req, res) => {
  const groupId = req.params.groupId; 
  const result = await fetchUnsettledTransactions(groupId);
  res.json(result);
});

const settleGroup = asyncHandler(async (req, res) => {
  const groupId = req.params.groupId;
  const frontendTransactions = req.body.transactions || [];
  const settlements = await processGroupSettlements(groupId, frontendTransactions);
  res.json({ settlements });
});

const getUserSettlements = asyncHandler(async (req, res) => {
  const { groupId, userId } = req.query;
  if (!groupId || !userId) {
    throw new AppError('groupId and userId are required', 400);
  }
  
  const settlements = await settlementRepository.findByUserAndGroup(groupId, userId);
  res.json(settlements);
});

const settlePayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await settlementRepository.markAsSettled(id);
  if (!updated) {
    throw new AppError('Settlement not found', 404);
  }
  res.json({ message: 'Settlement marked as settled', settlement: updated });
});

module.exports = {
  getUnsettledTransactions,
  settleGroup,
  getUserSettlements,
  settlePayment
};
