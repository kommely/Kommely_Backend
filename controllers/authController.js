const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Encryption = require("../utils/encryption");
require("dotenv").config();

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password, emergencyContact, location } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const encryptedPhone = Encryption.encryptData(emergencyContact);
      const user = new User({
        name,
        email,
        password: hashedPassword,
        emergencyContact: encryptedPhone,
        location,
      });

      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(201).json({ token, userId: user._id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;
