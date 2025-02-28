const User = require("../models/user");
const TwilioService = require("./twilio");
const LocationService = require("./location");
const Encryption = require("../utils/encryption");

class EmergencyService {
  static async handleEmergency(seniorId, eventType) {
    const senior = await User.findById(seniorId);
    if (!senior) throw new Error("Senior not found");

    const { key, iv, encrypted } = senior.emergencyContact;
    const phoneNumber = Encryption.decryptData(encrypted, key, iv);

    let message = "",
      locationDetails = "";

    // Placeholder logic for testing without Google Maps API
    if (eventType === "fall") {
      locationDetails = `Placeholder Address for Lat: ${senior.location.lat}, Lng: ${senior.location.lng}`;
      message = `Emergency: Fall detected at ${locationDetails}. Senior's location: https://maps.google.com/?q=${senior.location.lat},${senior.location.lng}`;
    } else if (eventType === "scream") {
      locationDetails = `Placeholder Address for Lat: ${senior.location.lat}, Lng: ${senior.location.lng}`;
      message = `Emergency: Distress scream detected at ${locationDetails}. Senior's location: https://maps.google.com/?q=${senior.location.lat},${senior.location.lng}`;
    }

    if (message) {
      await TwilioService.sendEmergencyAlert(phoneNumber, message);
    }
    return { success: !!message, message };
  }

  static async checkBatteryLevel(seniorId, batteryLevel) {
    if (batteryLevel <= 20) {
      const senior = await User.findById(seniorId);
      if (!senior) throw new Error("Senior not found");

      const { key, iv, encrypted } = senior.emergencyContact;
      const phoneNumber = Encryption.decryptData(encrypted, key, iv);
      await TwilioService.sendLowBatteryAlert(phoneNumber);
    }
  }
}

module.exports = EmergencyService;
