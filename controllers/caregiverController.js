const Caregiver = require("../models/caregiver");
const Review = require("../models/review");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Encryption = require("../utils/encryption");
require("dotenv").config();

class CaregiverController {
  static async registerCaregiver(req, res) {
    try {
      const {
        name,
        email,
        password,
        phoneNumber,
        qualifications,
        experience,
        availability,
        preferredSeniorCategories,
        personality,
        interests,
        certifications,
        bio,
      } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const encryptedPhoneNumber = Encryption.encryptData(phoneNumber);

      const caregiver = new Caregiver({
        name,
        email,
        password: hashedPassword,
        phoneNumber: encryptedPhoneNumber,
        qualifications: qualifications || [],
        experience: experience || 0,
        availability: availability || [],
        preferredSeniorCategories: preferredSeniorCategories || [],
        personality: personality || [],
        interests: interests || [],
        certifications: certifications || [],
        bio: bio || "",
      });

      await caregiver.save();
      const token = jwt.sign(
        { id: caregiver._id, role: "caregiver" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(201).json({ token, userId: caregiver._id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async loginCaregiver(req, res) {
    try {
      const { email, password } = req.body;
      const caregiver = await Caregiver.findOne({ email });
      if (!caregiver)
        return res.status(400).json({ error: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, caregiver.password);
      if (!isMatch)
        return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign(
        { id: caregiver._id, role: "caregiver" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllCaregivers(req, res) {
    try {
      const caregivers = await Caregiver.find();
      const caregiversWithReviews = await Promise.all(
        caregivers.map(async (caregiver) => {
          const reviews = await Review.find({
            caregiverId: caregiver._id,
          }).populate("seniorId", "name");
          const decryptedPhoneNumber = Encryption.decryptData(
            caregiver.phoneNumber.encrypted,
            caregiver.phoneNumber.key,
            caregiver.phoneNumber.iv
          );
          return {
            _id: caregiver._id,
            name: caregiver.name,
            email: caregiver.email,
            phoneNumber: decryptedPhoneNumber,
            qualifications: caregiver.qualifications,
            experience: caregiver.experience,
            availability: caregiver.availability,
            preferredSeniorCategories: caregiver.preferredSeniorCategories,
            personality: caregiver.personality,
            interests: caregiver.interests,
            certifications: caregiver.certifications,
            bio: caregiver.bio,
            averageRating: caregiver.averageRating,
            reviewCount: caregiver.reviewCount,
            reviews: reviews.map((review) => ({
              seniorName: review.seniorId.name,
              rating: review.rating,
              comment: review.comment,
              createdAt: review.createdAt,
            })),
          };
        })
      );
      res.status(200).json({ caregivers: caregiversWithReviews });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async submitReview(req, res) {
    try {
      const { caregiverId, rating, comment } = req.body;
      const seniorId = req.user.id;

      const review = new Review({
        seniorId,
        caregiverId,
        rating,
        comment: comment || "",
      });

      await review.save();

      const caregiverReviews = await Review.find({ caregiverId });
      const totalRatings = caregiverReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const caregiver = await Caregiver.findById(caregiverId);
      caregiver.averageRating = totalRatings / caregiverReviews.length;
      caregiver.reviewCount = caregiverReviews.length;
      await caregiver.save();

      res.status(201).json({ message: "Review submitted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = CaregiverController;
