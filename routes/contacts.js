const express = require('express');
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// GET /api/contacts - list current user's emergency contacts
router.get('/', async (req, res) => {
  const contacts = await Contact.find({ owner: req.user.id }).sort({ createdAt: -1 });
  res.json(contacts);
});

// POST /api/contacts - add a contact
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, relation } = req.body;
    if (!name || !phone) return res.status(400).json({ message: 'Name and phone are required' });
    const contact = await Contact.create({ owner: req.user.id, name, phone, email, relation });
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/contacts/:id
router.delete('/:id', async (req, res) => {
  const contact = await Contact.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!contact) return res.status(404).json({ message: 'Contact not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
