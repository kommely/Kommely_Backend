const Senior = require("../models/senior");
const Caregiver = require("../models/caregiver");
const Encryption = require("../utils/encryption");

class MatchingService {
  static async matchCaregiversForSenior(seniorId) {
    const senior = await Senior.findById(seniorId);
    if (!senior) throw new Error("Senior not found");

    const caregivers = await Caregiver.find();
    const matches = caregivers.filter((caregiver) => {
      const matchesHealthConditions = caregiver.preferredSeniorCategories.some(
        (category) => senior.healthConditions.includes(category)
      );
      const matchesCaregivingNeeds = caregiver.preferredSeniorCategories.some(
        (category) => senior.caregivingNeeds.includes(category)
      );
      return matchesHealthConditions || matchesCaregivingNeeds;
    });

    return matches.map((caregiver) => {
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
      };
    });
  }

  static async matchSeniorsForCaregiver(caregiverId) {
    const caregiver = await Caregiver.findById(caregiverId);
    if (!caregiver) throw new Error("Caregiver not found");

    const seniors = await Senior.find();
    const matches = seniors.filter((senior) => {
      const matchesHealthConditions = senior.healthConditions.some(
        (condition) => caregiver.preferredSeniorCategories.includes(condition)
      );
      const matchesCaregivingNeeds = senior.caregivingNeeds.some((need) =>
        caregiver.preferredSeniorCategories.includes(need)
      );
      return matchesHealthConditions || matchesCaregivingNeeds;
    });

    return matches.map((senior) => {
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
      };
    });
  }

  static async assignCaregiver(seniorId, caregiverId) {
    const senior = await Senior.findById(seniorId);
    if (!senior) throw new Error("Senior not found");

    const caregiver = await Caregiver.findById(caregiverId);
    if (!caregiver) throw new Error("Caregiver not found");

    senior.caregiverId = caregiverId;
    await senior.save();
    return { message: "Caregiver assigned successfully" };
  }
}

module.exports = MatchingService;
