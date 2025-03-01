const mongoose = require("mongoose");

const caregiverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: {
    // Added for emergency alerts
    encrypted: { type: String, required: true },
    key: { type: String, required: true },
    iv: { type: String, required: true },
  },
  qualifications: [String], // e.g., ["nursing degree"]
  experience: { type: Number, default: 0 },
  availability: [String], // e.g., ["monday"]
  preferredSeniorCategories: [String], // e.g., ["dementia"]
  personality: [String], // e.g., ["patient"]
  interests: [String], // e.g., ["reading"]
  certifications: [String], // e.g., ["CNA"]
  bio: { type: String, default: "" },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
});

const Caregiver = mongoose.model("Caregiver", caregiverSchema);

module.exports = Caregiver;
