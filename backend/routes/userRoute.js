const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Tambah user baru (staff)
router.post("/tambah-user", userController.addUser);

// Ambil semua user (staff)
router.get("/staff", userController.getAllStaff);

// Ambil detail 1 user (staff) berdasarkan ID
router.get("/staff/:id", userController.getUserById);

// Update / Edit data staff
router.put("/staff/:id", userController.updateStaffById);

// Hapus user (staff)
router.delete("/staff/:id", userController.deleteStaffById);

// Ambil data user berdasarkan ID (untuk header profile)
router.get("/user/:id", userController.getUserHeaderById);

module.exports = router;
