const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const EmergencyController = require("../controllers/emergencyController");

router.post("/detect", authMiddleware, EmergencyController.detectEmergency);
router.post("/battery", authMiddleware, EmergencyController.checkBattery);

module.exports = router;
