const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

// Tambah menu baru
router.post("/menu", menuController.createMenu);

// Ambil semua menu
router.get("/menu", menuController.getAllMenu);

// Ambil satu menu berdasarkan ID
router.get("/menu/:id", menuController.getMenuById);

// Update data menu berdasarkan ID
router.put("/menu/:id", menuController.updateMenuById);

// Hapus menu berdasarkan ID
router.delete("/menu/:id", menuController.deleteMenuById);

// Update status menu berdasarkan ID
router.patch("/menu/:id/status", menuController.updateMenuStatus);

module.exports = router;
