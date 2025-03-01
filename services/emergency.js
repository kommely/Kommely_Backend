const Senior = require("../models/senior");
const Caregiver = require("../models/caregiver");
const TwilioService = require("./twilio");
const LocationService = require("./location");
const Encryption = require("../utils/encryption");

class EmergencyService {
  static async handleEmergency(seniorId, eventType) {
    const senior = await Senior.findById(seniorId).populate("caregiverId");
    if (!senior) throw new Error("Senior not found");

    const phoneNumbers = senior.emergencyContacts.map((contact) => {
      const { encrypted, key, iv } = contact;
      return Encryption.decryptData(encrypted, key, iv);
    });

    let caregiverPhoneNumber = null;
    if (senior.caregiverId) {
      caregiverPhoneNumber = Encryption.decryptData(
        senior.caregiverId.phoneNumber.encrypted,
        senior.caregiverId.phoneNumber.key,
        senior.caregiverId.phoneNumber.iv
      );
    }

    let message = "",
      locationDetails = "";

    if (eventType === "fall") {
      locationDetails = await LocationService.getLocationDetails(
        senior.location.lat,
        senior.location.lng
      );
      message = `Emergency: Fall detected at ${locationDetails}. Senior's location: https://maps.google.com/?q=${senior.location.lat},${senior.location.lng}`;
    } else if (eventType === "scream") {
      locationDetails = await LocationService.getLocationDetails(
        senior.location.lat,
        senior.location.lng
      );
      message = `Emergency: Distress scream detected at ${locationDetails}. Senior's location: https://maps.google.com/?q=${senior.location.lat},${senior.location.lng}`;
    }

    if (message) {
      if (caregiverPhoneNumber) {
        try {
          await TwilioService.sendEmergencyAlert(caregiverPhoneNumber, message);
        } catch (error) {
          console.error(
            `Failed to send SMS to caregiver ${caregiverPhoneNumber}:`,
            error.message
          );
        }
      }

      const contactsToNotify =
        senior.plan === "premium"
          ? phoneNumbers.slice(0, 3)
          : [phoneNumbers[0]];
      let success = false;
      for (const phoneNumber of contactsToNotify) {
        try {
          await TwilioService.sendEmergencyAlert(phoneNumber, message);
          success = true;
          break;
        } catch (error) {
          console.error(`Failed to send SMS to ${phoneNumber}:`, error.message);
        }
      }
      if (!success) {
        throw new Error("Failed to send SMS to any emergency contact");
      }
    }
    return { success: !!message, message };
  }

  static async checkBatteryLevel(seniorId, batteryLevel) {
    if (batteryLevel <= 20) {
      const senior = await Senior.findById(seniorId).populate("caregiverId");
      if (!senior) throw new Error("Senior not found");

      const phoneNumbers = senior.emergencyContacts.map((contact) => {
        const { encrypted, key, iv } = contact;
        return Encryption.decryptData(encrypted, key, iv);
      });

      let caregiverPhoneNumber = null;
      if (senior.caregiverId) {
        caregiverPhoneNumber = Encryption.decryptData(
          senior.caregiverId.phoneNumber.encrypted,
          senior.caregiverId.phoneNumber.key,
          senior.caregiverId.phoneNumber.iv
        );
      }

      if (caregiverPhoneNumber) {
        try {
          await TwilioService.sendLowBatteryAlert(caregiverPhoneNumber);
        } catch (error) {
          console.error(
            `Failed to send battery alert to caregiver ${caregiverPhoneNumber}:`,
            error.message
          );
        }
      }

      const contactsToNotify =
        senior.plan === "premium"
          ? phoneNumbers.slice(0, 3)
          : [phoneNumbers[0]];
      let success = false;
      for (const phoneNumber of contactsToNotify) {
        try {
          await TwilioService.sendLowBatteryAlert(phoneNumber);
          success = true;
          break;
        } catch (error) {
          console.error(
            `Failed to send battery alert to ${phoneNumber}:`,
            error.message
          );
        }
      }
      if (!success) {
        throw new Error(
          "Failed to send battery alert to any emergency contact"
        );
      }
    }
  }
}

module.exports = EmergencyService;
