const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// GET /api/profile - current user's full profile including health info
router.get('/', async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// PATCH /api/profile - update health/safety info
router.patch('/', async (req, res) => {
  const { bloodGroup, heightCm, weightKg, address, medicalNotes, phone } = req.body;
  const update = {};
  if (bloodGroup !== undefined) update.bloodGroup = bloodGroup;
  if (heightCm !== undefined) update.heightCm = heightCm;
  if (weightKg !== undefined) update.weightKg = weightKg;
  if (address !== undefined) update.address = address;
  if (medicalNotes !== undefined) update.medicalNotes = medicalNotes;
  if (phone !== undefined) update.phone = phone;

  const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('-password');
  res.json(user);
});

module.exports = router;
