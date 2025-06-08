const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Ringkasan transaksi hari tertentu (default hari ini)
router.get("/dashboard/summary", adminController.getDashboardSummary);

// Grafik transaksi mingguan
router.get("/dashboard/chart", adminController.getDashboardChart);

// Mendapatkan list menu terjual hari tertentu (default hari ini)
router.get("/dashboard/menu-terjual", adminController.getMenuTerjual);

// Detail pendapatan per metode pembayaran per tanggal tertentu
router.get("/pendapatan/detail", adminController.getPendapatanDetail);

// Detail transaksi per tanggal tertentu
router.get("/transaksi/detail", adminController.getTransaksiDetail);

module.exports = router;
