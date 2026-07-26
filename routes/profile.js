const bcrypt = require('bcryptjs');
const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// GET Profile
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
});


// PUT/Update Profile
router.put('/', async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
});

// PUT /api/profile/password - Change Password
router.put('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Current password is incorrect',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters',
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({
      message: 'Password changed successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
});
module.exports = router;