const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { expenseSubject } = require('./observers/expenseObserver');
const { SettlementRecalculationObserver } = require('./observers/expenseObserver');
const { processGroupSettlements } = require('./utils/algo');
require('dotenv').config();

const app = express();
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://localhost:8080',
      'https://splitwise.vercel.app',
      'https://splitwise-app.vercel.app',
      'https://split-wise-sepia.vercel.app',
      'https://split-wise-ekabx9zk7-kalyani-daves-projects.vercel.app',
      'https://sw-xi.vercel.app',
      'https://sw-git-main-kalyani-daves-projects.vercel.app',
      'https://sw-2s011rssc-kalyani-daves-projects.vercel.app',
      'https://splitwise-frontend-teal.vercel.app'
    ],
    credentials: true
  })
);
app.use(express.json());

connectDB();

// Setup Observer Pattern - Settlement Recalculation Observer
const settlementService = {
  recalculateSettlements: async (groupId) => {
    try {
      await processGroupSettlements(groupId, []);
    } catch (error) {
      console.error('Error recalculating settlements:', error);
    }
  }
};
const settlementObserver = new SettlementRecalculationObserver(settlementService);
expenseSubject.attach(settlementObserver);

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/group-memberships', require('./routes/groupMembershipRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/settlements', require('./routes/settlementRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

app.get('/', (req, res) => {
  res.send('Testing purpose');
});

// Error handling middleware (must be after routes)
app.use(notFound);
app.use(errorHandler);

// export for Vercel serverless
module.exports = app;

if (process.env.NODE_ENV !== 'vercel') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}