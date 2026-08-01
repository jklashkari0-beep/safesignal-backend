const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    relation: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', ContactSchema);
