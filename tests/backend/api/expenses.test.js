const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../backend/index');
const User = require('../../../backend/model/userModel');
const Group = require('../../../backend/model/groupModel');
const Expense = require('../../../backend/model/expenseModel');

describe('Expense API Tests', () => {
  let authToken;
  let userId;
  let groupId;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/splitwise_test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up database
    await User.deleteMany({});
    await Group.deleteMany({});
    await Expense.deleteMany({});

    // Create test user and get auth token
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const signupResponse = await request(app)
      .post('/api/users/signup')
      .send(userData);

    userId = signupResponse.body.userId;

    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: userData.email,
        password: userData.password
      });

    authToken = loginResponse.body.token;

    // Create test group
    const groupResponse = await request(app)
      .post('/api/groups')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Group',
        description: 'Test Description',
        userId: userId,
        type: 'general'
      });

    groupId = groupResponse.body._id;
  });

  describe('POST /api/expenses', () => {
    test('should create expense successfully', async () => {
      const expenseData = {
        groupId: groupId,
        description: 'Test Expense',
        amount: 1000,
        paidBy: [{ userId: userId, amount: 1000 }],
        splitMember: [{ userId: userId, amount: 1000 }],
        splitType: 'equally'
      };

      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(expenseData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.description).toBe('Test Expense');
      expect(response.body.data.amount).toBe(1000);
    });

    test('should return error for invalid paidBy amount', async () => {
      const expenseData = {
        groupId: groupId,
        description: 'Test Expense',
        amount: 1000,
        paidBy: [{ userId: userId, amount: 500 }], // Less than total
        splitMember: [{ userId: userId }],
        splitType: 'equally'
      };

      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(expenseData)
        .expect(400);

      expect(response.body.message).toBe('Sum of paidBy amounts must equal total expense amount');
    });
  });

  describe('GET /api/expenses/group/:groupId', () => {
    test('should return expenses for group', async () => {
      // First create an expense
      const expenseData = {
        groupId: groupId,
        description: 'Test Expense',
        amount: 1000,
        paidBy: [{ userId: userId, amount: 1000 }],
        splitMember: [{ userId: userId, amount: 1000 }],
        splitType: 'equally'
      };

      await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(expenseData);

      // Now get expenses for group
      const response = await request(app)
        .get(`/api/expenses/group/${groupId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].description).toBe('Test Expense');
    });
  });

  describe('GET /api/expenses/user/:userId', () => {
    test('should return expenses involving user', async () => {
      // Create expense involving user
      const expenseData = {
        groupId: groupId,
        description: 'User Expense',
        amount: 500,
        paidBy: [{ userId: userId, amount: 500 }],
        splitMember: [{ userId: userId, amount: 500 }],
        splitType: 'equally'
      };

      await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(expenseData);

      // Get expenses involving user
      const response = await request(app)
        .get(`/api/expenses/user/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].userInvolvement).toBeDefined();
      expect(response.body[0].userInvolvement.amountPaid).toBe(500);
    });
  });
});