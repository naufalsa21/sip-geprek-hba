const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const pesananController = require("../controllers/pesananController");

// Tambah pesanan baru
router.post("/pesanan", pesananController.createPesanan);

// Ambil daftar pesanan aktif untuk kasir & etalase
router.get("/pesanan/kasir", pesananController.getPesananKasir);

// Ambil detail pesanan berdasarkan ID
router.get("/pesanan/:id", pesananController.getPesananById);

// Batalkan pesanan
router.patch("/pesanan/:id/batalkan", pesananController.batalkanPesanan);

// Proses pesanan (ubah status jadi Sedang Diproses dan simpan etalase_id)
router.patch("/pesanan/:id/proses", pesananController.prosesPesanan);

// Selesaikan pesanan (ubah status jadi Selesai dan simpan etalase_id)
router.patch("/pesanan/:id/selesaikan", pesananController.selesaikanPesanan);

// Upload bukti pembayaran dengan middleware upload.single untuk handle file
router.patch(
  "/pesanan/:id/upload-bukti",
  upload.single("bukti"),
  pesananController.uploadBuktiPembayaran
);

module.exports = router;
