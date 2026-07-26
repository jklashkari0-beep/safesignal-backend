const express = require('express');
const Alert = require('../models/Alert');
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// POST /api/alerts - trigger an SOS
router.post('/', async (req, res) => {
  try {
    const { lat, lng, message } = req.body;
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ message: 'Location (lat, lng) is required' });
    }
    const contacts = await Contact.find({ owner: req.user.id });
    const googleMapsLink = `https://maps.google.com/?q=${lat},${lng}`;

const alert = await Alert.create({
  user: req.user.id,
  location: {
    lat,
    lng,
  },
  googleMapsLink,
  message: message || 'SOS Emergency Triggered',
  smsSent: false,
  contactsNotified: contacts.map((c) => c._id),
});

    // Broadcast in real time to the admin dashboard
    const io = req.app.get('io');
    io.emit('new-alert', alert);

    res.status(201).json({ alert, notified: contacts.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/alerts/mine - current user's own alert history
router.get('/mine', async (req, res) => {
  const alerts = await Alert.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(alerts);
});

// GET /api/alerts - admin: view all alerts
router.get('/', adminOnly, async (req, res) => {
  const alerts = await Alert.find().populate('user', 'name email phone').sort({ createdAt: -1 });
  res.json(alerts);
});

// PATCH /api/alerts/:id/resolve - admin: mark resolved
router.patch('/:id/resolve', adminOnly, async (req, res) => {
  const alert = await Alert.findByIdAndUpdate(req.params.id, { status: 'resolved' }, { new: true });
  if (!alert) return res.status(404).json({ message: 'Alert not found' });
  const io = req.app.get('io');
  io.emit('alert-resolved', alert);
  res.json(alert);
});

module.exports = router;
