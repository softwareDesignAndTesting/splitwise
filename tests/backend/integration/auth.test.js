const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../backend/index');
const User = require('../../../backend/model/userModel');

describe('Authentication Integration Tests', () => {
  beforeAll(async () => {

    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/splitwise_test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {

    await User.deleteMany({});
  });

  describe('POST /api/users/signup', () => {
    test('should register new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/signup')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('userId');
      expect(response.body.message).toBe('User registered successfully');


      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user.name).toBe(userData.name);
    });

    test('should return error for duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };


      await request(app)
        .post('/api/users/signup')
        .send(userData);


      const response = await request(app)
        .post('/api/users/signup')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/users/login', () => {
    test('should login user successfully', async () => {

      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/users/signup')
        .send(userData);


      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('token');
    });

    test('should return error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        })
        .expect(400);

      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('GET /api/users/me', () => {
    test('should return user profile with valid token', async () => {

      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/users/signup')
        .send(userData);

      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      const token = loginResponse.body.token;


      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
      expect(response.body).not.toHaveProperty('password');
    });

    test('should return error without token', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .expect(401);

      expect(response.body.message).toBe('No token, authorization denied');
    });
  });
});