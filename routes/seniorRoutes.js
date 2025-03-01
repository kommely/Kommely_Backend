const express = require("express");
const router = express.Router();
const SeniorController = require("../controllers/seniorController");
const authMiddleware = require("../middleware/auth");
const MatchingService = require("../services/matching");

router.post("/register", SeniorController.registerSenior);
router.post("/login", SeniorController.loginSenior);
router.get("/users", authMiddleware, SeniorController.getAllSeniors);
router.get("/match-caregivers/:seniorId", authMiddleware, async (req, res) => {
  try {
    const matches = await MatchingService.matchCaregiversForSenior(
      req.params.seniorId
    );
    res.status(200).json({ caregivers: matches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
