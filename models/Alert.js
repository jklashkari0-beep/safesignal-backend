const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },

    googleMapsLink: {
      type: String,
    },

    message: {
      type: String,
      default: 'SOS Emergency Triggered',
    },

    status: {
      type: String,
      enum: ['active', 'resolved'],
      default: 'active',
    },

    smsSent: {
      type: Boolean,
      default: false,
    },

    contactsNotified: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Alert', AlertSchema);