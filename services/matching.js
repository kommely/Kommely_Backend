const Senior = require("../models/senior");
const Caregiver = require("../models/caregiver");
const Encryption = require("../utils/encryption");
const Distance = require("../utils/distance");

class MatchingService {
  static async matchCaregiversForSenior(seniorId) {
    const senior = await Senior.findById(seniorId);
    if (!senior) throw new Error("Senior not found");

    // Validate senior location
    if (
      !senior.location ||
      typeof senior.location.lat !== "number" ||
      typeof senior.location.lng !== "number"
    ) {
      return []; // Return empty array if senior location is invalid
    }

    const caregivers = await Caregiver.find();
    const maxDistance = 50;

    const matches = caregivers.filter((caregiver) => {
      if (
        !caregiver.location ||
        typeof caregiver.location.lat !== "number" ||
        typeof caregiver.location.lng !== "number"
      ) {
        return false; // Skip caregivers with invalid location
      }

      const matchesHealthConditions = caregiver.preferredSeniorCategories.some(
        (category) => senior.healthConditions.includes(category)
      );
      const matchesCaregivingNeeds = caregiver.preferredSeniorCategories.some(
        (category) => senior.caregivingNeeds.includes(category)
      );

      const distance = Distance.calculateDistance(
        senior.location.lat,
        senior.location.lng,
        caregiver.location.lat,
        caregiver.location.lng
      );
      const withinDistance = distance <= maxDistance;

      return (
        (matchesHealthConditions || matchesCaregivingNeeds) && withinDistance
      );
    });

    return matches.map((caregiver) => {
      const decryptedPhoneNumber = Encryption.decryptData(
        caregiver.phoneNumber.encrypted,
        caregiver.phoneNumber.key,
        caregiver.phoneNumber.iv
      );
      const distance = Distance.calculateDistance(
        senior.location.lat,
        senior.location.lng,
        caregiver.location.lat,
        caregiver.location.lng
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
        distance: distance,
      };
    });
  }

  static async matchSeniorsForCaregiver(caregiverId) {
    const caregiver = await Caregiver.findById(caregiverId);
    if (!caregiver) throw new Error("Caregiver not found");

    // Validate caregiver location
    if (
      !caregiver.location ||
      typeof caregiver.location.lat !== "number" ||
      typeof caregiver.location.lng !== "number"
    ) {
      return []; // Return empty array if caregiver location is invalid
    }

    const seniors = await Senior.find();
    const maxDistance = 50;

    const matches = seniors.filter((senior) => {
      if (
        !senior.location ||
        typeof senior.location.lat !== "number" ||
        typeof senior.location.lng !== "number"
      ) {
        return false; // Skip seniors with invalid location
      }

      const matchesHealthConditions = senior.healthConditions.some(
        (condition) => caregiver.preferredSeniorCategories.includes(condition)
      );
      const matchesCaregivingNeeds = senior.caregivingNeeds.some((need) =>
        caregiver.preferredSeniorCategories.includes(need)
      );

      const distance = Distance.calculateDistance(
        senior.location.lat,
        senior.location.lng,
        caregiver.location.lat,
        caregiver.location.lng
      );
      const withinDistance = distance <= maxDistance;

      return (
        (matchesHealthConditions || matchesCaregivingNeeds) && withinDistance
      );
    });

    return matches.map((senior) => {
      const decryptedContacts = senior.emergencyContacts.map((contact) => {
        const { encrypted, key, iv } = contact;
        return Encryption.decryptData(encrypted, key, iv);
      });
      const distance = Distance.calculateDistance(
        senior.location.lat,
        senior.location.lng,
        caregiver.location.lat,
        caregiver.location.lng
      );
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
        distance: distance,
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
