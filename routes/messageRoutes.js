const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const MessageController = require("../controllers/messageController");

router.post("/send", authMiddleware, MessageController.sendMessage);
router.get("/:userId", authMiddleware, MessageController.getMessages);

module.exports = router;
