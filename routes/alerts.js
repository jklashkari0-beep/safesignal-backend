const express = require('express');
const Alert = require('../models/Alert');
const Contact = require('../models/Contact');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const { sendSOSEmail } = require('../utils/mailer');

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
    const alert = await Alert.create({
      user: req.user.id,
      location: { lat, lng },
      message: message || 'SOS Emergency Triggered',
      contactsNotified: contacts.map((c) => c._id),
    });

    // Broadcast in real time to the admin dashboard
    const io = req.app.get('io');
    io.emit('new-alert', alert);

    // Fire-and-forget: email every contact that has an email on file
    const victim = await User.findById(req.user.id);
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    contacts
      .filter((c) => c.email)
      .forEach((c) => {
        sendSOSEmail({
          to: c.email,
          victimName: victim?.name || 'A SafeSignal user',
          victimPhone: victim?.phone,
          lat,
          lng,
          mapsUrl,
        }).catch((err) => console.error('Email send failed for', c.email, err.message));
      });

    res.status(201).json({ alert, notified: contacts.length, mapsUrl });
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
