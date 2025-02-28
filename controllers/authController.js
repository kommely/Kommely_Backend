const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Encryption = require("../utils/encryption");

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password, emergencyContacts, location, plan } =
        req.body;

      // Validate emergency contacts based on plan
      if (!Array.isArray(emergencyContacts) || emergencyContacts.length === 0) {
        return res
          .status(400)
          .json({ error: "At least one emergency contact is required" });
      }
      const maxContacts = plan === "premium" ? 3 : 1;
      if (emergencyContacts.length > maxContacts) {
        return res
          .status(400)
          .json({
            error: `Maximum ${maxContacts} emergency contact(s) allowed for ${plan} plan`,
          });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const encryptedContacts = emergencyContacts.map((contact) =>
        Encryption.encryptData(contact)
      );

      const user = new User({
        name,
        email,
        password: hashedPassword,
        emergencyContacts: encryptedContacts,
        location,
        plan: plan || "free",
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

  static async getAllUsers(req, res) {
    try {
      const users = await User.find();
      const decryptedUsers = users.map((user) => {
        const decryptedContacts = user.emergencyContacts.map((contact) => {
          const { encrypted, key, iv } = contact;
          return Encryption.decryptData(encrypted, key, iv);
        });
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          emergencyContacts: decryptedContacts,
          location: user.location,
          plan: user.plan,
        };
      });
      res.status(200).json({ users: decryptedUsers });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;
