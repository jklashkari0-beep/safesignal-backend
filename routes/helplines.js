const express = require('express');
const Helpline = require('../models/Helpline');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/helplines - Everyone can view helplines
router.get('/', async (req, res) => {
  try {
    const helplines = await Helpline.find().sort({ name: 1 });
    res.json(helplines);
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
});

// POST /api/helplines - Admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, number, category } = req.body;

    const helpline = await Helpline.create({
      name,
      number,
      category,
    });

    res.status(201).json(helpline);
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
});

module.exports = router;