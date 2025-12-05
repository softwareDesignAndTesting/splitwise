const User = require('../model/userModel');

/**
 * User Repository - Implements Repository Pattern
 * Abstracts data access logic for User operations
 * Follows Dependency Inversion Principle
 */
class UserRepository {
  async findByEmail(email, includePassword = false) {
    if (includePassword) {
      return await User.findOne({ email });
    }
    return await User.findOne({ email }).select('-password');
  }

  async findById(id) {
    return await User.findById(id).select('-password');
  }

  async findByIdWithPassword(id) {
    return await User.findById(id);
  }

  async create(userData) {
    return await User.create(userData);
  }

  async findAll(fields = 'name email mutualFriends') {
    return await User.find({}, fields).populate('mutualFriends', 'name');
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }
}

module.exports = new UserRepository();

