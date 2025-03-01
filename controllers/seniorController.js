const Senior = require("../models/senior");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Encryption = require("../utils/encryption");
require("dotenv").config();

class SeniorController {
  static async registerSenior(req, res) {
    try {
      const {
        name,
        email,
        password,
        emergencyContacts,
        location,
        plan,
        healthConditions,
        caregivingNeeds,
        lifestylePreferences,
        bio,
      } = req.body;

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

      const senior = new Senior({
        name,
        email,
        password: hashedPassword,
        emergencyContacts: encryptedContacts,
        location,
        plan: plan || "free",
        healthConditions: healthConditions || [],
        caregivingNeeds: caregivingNeeds || [],
        lifestylePreferences: lifestylePreferences || [],
        bio: bio || "",
      });

      await senior.save();
      const token = jwt.sign(
        { id: senior._id, role: "senior" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(201).json({ token, userId: senior._id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async loginSenior(req, res) {
    try {
      const { email, password } = req.body;
      const senior = await Senior.findOne({ email });
      if (!senior)
        return res.status(400).json({ error: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, senior.password);
      if (!isMatch)
        return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign(
        { id: senior._id, role: "senior" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllSeniors(req, res) {
    try {
      const seniors = await Senior.find().populate("caregiverId", "name email");
      const decryptedSeniors = seniors.map((senior) => {
        const decryptedContacts = senior.emergencyContacts.map((contact) => {
          const { encrypted, key, iv } = contact;
          return Encryption.decryptData(encrypted, key, iv);
        });
        return {
          _id: senior._id,
          name: senior.name,
          email: senior.email,
          emergencyContacts: decryptedContacts,
          location: senior.location,
          plan: senior.plan,
          healthConditions: senior.healthConditions,
          caregivingNeeds: senior.caregivingNeeds,
          lifestylePreferences: senior.lifestylePreferences,
          bio: senior.bio,
          caregiver: senior.caregiverId,
        };
      });
      res.status(200).json({ seniors: decryptedSeniors });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = SeniorController;
