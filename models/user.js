const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  emergencyContacts: [
    {
      encrypted: { type: String, required: true },
      key: { type: String, required: true },
      iv: { type: String, required: true },
    },
  ], // Array of encrypted phone numbers
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  password: { type: String, required: true },
  plan: { type: String, enum: ["free", "premium"], default: "free" }, // Track free or premium plan
});

const User = mongoose.model("Senior", userSchema);

module.exports = User;
