const Group = require('../model/groupModel');

const createGroup = async (req, res) => {
  try {
    const { name, description, userId, type } = req.body;

    const group = await Group.create({
      name,
      description,
      createdBy: userId,
      type
    });

    res.status(201).json(group);
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(groups);
  } catch (error) {
    console.error('Get all groups error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    res.json(group);
  } catch (error) {
    console.error('Get group by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateGroup = async (req, res) => {
  try {
    const { name, description, type } = req.body;
    
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      { name, description, type, updatedAt: Date.now() }, 
      { new: true }
    ).populate('createdBy', 'name email');
    
    res.json(updatedGroup);
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Group.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup
}; 
