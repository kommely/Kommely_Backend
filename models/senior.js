const mongoose = require("mongoose");

const seniorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emergencyContacts: [
    {
      encrypted: { type: String, required: true },
      key: { type: String, required: true },
      iv: { type: String, required: true },
    },
  ],
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  plan: { type: String, enum: ["free", "premium"], default: "free" },
  healthConditions: [String], // e.g., ["dementia"]
  caregivingNeeds: [String], // e.g., ["daily assistance"]
  lifestylePreferences: [String], // e.g., ["quiet environment"]
  bio: { type: String, default: "" },
  // Referencing: caregiverId links to a Caregiver document
  caregiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Caregiver",
    default: null,
  },
});

const Senior = mongoose.model("Senior", seniorSchema);

module.exports = Senior;
