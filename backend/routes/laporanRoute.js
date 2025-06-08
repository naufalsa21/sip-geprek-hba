const express = require("express");
const router = express.Router();
const laporanController = require("../controllers/laporanController");

router.get("/pesanan-selesai", laporanController.getPesananSelesai);

module.exports = router;
