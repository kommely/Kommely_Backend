const EmergencyService = require("../services/emergency");

class EmergencyController {
  static async detectEmergency(req, res) {
    try {
      const { seniorId, eventType } = req.body; // Mock data from AI team
      const result = await EmergencyService.handleEmergency(
        seniorId,
        eventType
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async checkBattery(req, res) {
    try {
      const { seniorId, batteryLevel } = req.body;
      await EmergencyService.checkBatteryLevel(seniorId, batteryLevel);
      res.status(200).json({ message: "Battery status checked" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = EmergencyController;
