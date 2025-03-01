const express = require("express");
const router = express.Router();
const CaregiverController = require("../controllers/caregiverController");
const authMiddleware = require("../middleware/auth");
const MatchingService = require("../services/matching");

router.post("/register", CaregiverController.registerCaregiver);
router.post("/login", CaregiverController.loginCaregiver);
router.get("/users", authMiddleware, CaregiverController.getAllCaregivers);
router.get("/match-seniors/:caregiverId", authMiddleware, async (req, res) => {
  try {
    const matches = await MatchingService.matchSeniorsForCaregiver(
      req.params.caregiverId
    );
    res.status(200).json({ seniors: matches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/reviews", authMiddleware, CaregiverController.submitReview);
router.post("/assign", authMiddleware, async (req, res) => {
  try {
    const { seniorId, caregiverId } = req.body;
    const result = await MatchingService.assignCaregiver(seniorId, caregiverId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
