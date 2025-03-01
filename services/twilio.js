const twilio = require("twilio");
require("dotenv").config();

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

class TwilioService {
  static async sendEmergencyAlert(phoneNumber, message) {
    try {
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });
      console.log(`Emergency alert sent to ${phoneNumber}`);
    } catch (error) {
      console.error("Twilio error:", error);
      throw error;
    }
  }

  static async sendLowBatteryAlert(phoneNumber) {
    const message = "Warning: Senior’s device battery is low (20%)";
    await this.sendEmergencyAlert(phoneNumber, message);
  }
}

module.exports = TwilioService;
