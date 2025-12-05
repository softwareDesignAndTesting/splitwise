const Group = require('../model/groupModel');

/**
 * Group Repository - Implements Repository Pattern
 * Abstracts data access logic for Group operations
 * Follows Dependency Inversion Principle
 */
class GroupRepository {
  async create(groupData) {
    return await Group.create(groupData);
  }

  async findById(id) {
    return await Group.findById(id).populate('members', 'name email');
  }

  async findAll() {
    return await Group.find().populate('members', 'name email');
  }

  async update(id, updateData) {
    return await Group.findByIdAndUpdate(id, updateData, { new: true })
      .populate('members', 'name email');
  }

  async delete(id) {
    return await Group.findByIdAndDelete(id);
  }

  async exists(id) {
    const group = await Group.findById(id);
    return !!group;
  }
}

module.exports = new GroupRepository();

