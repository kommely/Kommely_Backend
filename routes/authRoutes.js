const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/users", authMiddleware, AuthController.getAllUsers); // New route for getting all users

module.exports = router;
