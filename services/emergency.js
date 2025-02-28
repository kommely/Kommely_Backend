const User = require("../models/user");
const TwilioService = require("./twilio");
const LocationService = require("./location");
const Encryption = require("../utils/encryption");

class EmergencyService {
  static async handleEmergency(seniorId, eventType) {
    const senior = await User.findById(seniorId);
    if (!senior) throw new Error("Senior not found");

    // Decrypt all emergency contacts
    const phoneNumbers = senior.emergencyContacts.map((contact) => {
      const { encrypted, key, iv } = contact;
      return Encryption.decryptData(encrypted, key, iv);
    });

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
      if (senior.plan === "premium") {
        // For premium users: send SMS sequentially until one "answers"
        let notified = false;
        for (const phoneNumber of phoneNumbers) {
          try {
            await TwilioService.sendEmergencyAlert(phoneNumber, message);
            // Simulate "call picked up" by assuming the SMS was sent successfully
            // In a real implementation with voice calls, you'd check Twilio call status
            notified = true;
            break; // Stop if the contact "answers"
          } catch (error) {
            console.error(`Failed to notify ${phoneNumber}:`, error.message);
            // Continue to the next contact if this one "didn't pick up"
          }
        }
        if (!notified) {
          console.log("All emergency contacts failed to pick up");
        }
      } else {
        // For free users: send to the single contact
        const phoneNumber = phoneNumbers[0];
        await TwilioService.sendEmergencyAlert(phoneNumber, message);
      }
    }
    return { success: !!message, message };
  }

  static async checkBatteryLevel(seniorId, batteryLevel) {
    if (batteryLevel <= 20) {
      const senior = await User.findById(seniorId);
      if (!senior) throw new Error("Senior not found");

      // Decrypt all emergency contacts
      const phoneNumbers = senior.emergencyContacts.map((contact) => {
        const { encrypted, key, iv } = contact;
        return Encryption.decryptData(encrypted, key, iv);
      });

      // Send SMS to all contacts for premium users, or just the first for free users
      const contactsToNotify =
        senior.plan === "premium" ? phoneNumbers : [phoneNumbers[0]];
      await Promise.all(
        contactsToNotify.map((phoneNumber) =>
          TwilioService.sendLowBatteryAlert(phoneNumber)
        )
      );
    }
  }
}

module.exports = EmergencyService;
