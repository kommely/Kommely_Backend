const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  emergencyContact: { type: Object, required: true }, // Encrypted phone number { encrypted, key, iv }
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  password: { type: String, required: true },
});

const User = mongoose.model("Senior", userSchema);

module.exports = User;
