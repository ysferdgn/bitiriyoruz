const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Pet = require('../models/Pet');
const { auth, adminAuth } = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('savedPets');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, phone, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic info
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    // Update password if requested
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to change password' });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect current password' });
      }

      user.password = newPassword;
    }

    const updatedUser = await user.save();
    
    // Populate the savedPets field before sending the response
    await updatedUser.populate('savedPets');

    // Don't send back the password
    updatedUser.password = undefined;

    res.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    if (error.code === 11000) { // Handle duplicate email error
        return res.status(400).json({ message: 'This email is already in use.' });
    }
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Get user's pets
router.get('/pets', auth, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user._id })
      .sort({ createdAt: -1 });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pets', error: error.message });
  }
});

// Toggle a pet in user's saved list
router.post('/saved-pets/:petId', auth, async (req, res) => {
  try {
    const petId = req.params.petId;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const petIndex = user.savedPets.indexOf(petId);

    if (petIndex > -1) {
      // It's saved, so remove it
      user.savedPets.splice(petIndex, 1);
    } else {
      // It's not saved, so add it
      user.savedPets.push(petId);
    }

    await user.save();
    
    // Populate the savedPets field before sending the response back
    await user.populate('savedPets');

    res.json(user.savedPets);
  } catch (error) {
    console.error('Error toggling saved pet:', error);
    res.status(500).json({ message: 'Error updating saved pets', error: error.message });
  }
});

// Admin: Get all users
router.get('/', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Admin: Delete user
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete all pets owned by the user
    await Pet.deleteMany({ owner: user._id });
    
    // Delete the user
    await user.deleteOne();
    
    res.json({ message: 'User and associated pets deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

module.exports = router; 