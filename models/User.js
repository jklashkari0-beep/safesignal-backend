const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    bloodGroup: { type: String, trim: true },
    heightCm: { type: Number },
    weightKg: { type: Number },
    address: { type: String, trim: true },
    medicalNotes: { type: String, trim: true }, // e.g. allergies, conditions responders should know
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
