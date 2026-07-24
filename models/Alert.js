const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    message: { type: String, default: 'SOS Emergency Triggered' },
    status: { type: String, enum: ['active', 'resolved'], default: 'active' },
    contactsNotified: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', AlertSchema);
