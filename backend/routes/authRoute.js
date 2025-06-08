const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Login user (staff)
router.post("/login", authController.login);

module.exports = router;
