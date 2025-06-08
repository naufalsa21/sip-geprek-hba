const pesananModel = require("../models/pesananModel");

// Tambah pesanan baru
const createPesanan = (req, res) => {
  const {
    nama_pelanggan,
    tipe_pesanan,
    nomor_meja,
    catatan,
    total,
    items,
    metode_pembayaran,
    kasir_id,
  } = req.body;

  if (
    !nama_pelanggan ||
    !tipe_pesanan ||
    !metode_pembayaran ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({ message: "Data pesanan tidak lengkap" });
  }

  pesananModel.createPesanan(
    {
      nama_pelanggan,
      tipe_pesanan,
      nomor_meja,
      catatan,
      total,
      metode_pembayaran,
      kasir_id,
      items,
    },
    (err, result) => {
      if (err) {
        console.error("Gagal menyimpan pesanan:", err);
        return res.status(500).json({ message: "Gagal menyimpan pesanan" });
      }
      res.json(result);
    }
  );
};

// Ambil daftar pesanan untuk kasir & etalase
const getPesananKasir = (req, res) => {
  pesananModel.getPesananKasir((err, results) => {
    if (err) {
      console.error("Gagal mengambil pesanan:", err);
      return res.status(500).json({ message: "Gagal mengambil pesanan" });
    }
    res.json(results);
  });
};

// Ambil detail pesanan berdasarkan ID
const getPesananById = (req, res) => {
  const pesananId = req.params.id;

  pesananModel.getPesananById(pesananId, (err, result) => {
    if (err) {
      console.error("Gagal mengambil pesanan:", err);
      return res.status(500).json({ message: "Gagal mengambil pesanan" });
    }
    if (!result) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }
    res.json(result);
  });
};

// Fungsi bantu cek status pesanan dan validasi
const cekStatusPesanan = (id, validStatus, res, next) => {
  pesananModel.cekStatusPesanan(id, (err, status) => {
    if (err) {
      console.error("Gagal memeriksa status:", err);
      return res.status(500).json({ message: "Gagal memeriksa status" });
    }
    if (status === null) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }
    if (!validStatus.includes(status)) {
      return res
        .status(400)
        .json({ message: "Status pesanan tidak valid untuk aksi ini" });
    }
    next();
  });
};

// Batalkan pesanan
const batalkanPesanan = (req, res) => {
  const id = req.params.id;

  cekStatusPesanan(id, ["Belum Diproses"], res, () => {
    pesananModel.updateStatusPesanan(id, "Dibatalkan", null, (err) => {
      if (err) {
        console.error("Gagal membatalkan pesanan:", err);
        return res.status(500).json({ message: "Gagal membatalkan pesanan" });
      }
      res.json({ message: "Pesanan berhasil dibatalkan" });
    });
  });
};

// Proses pesanan (ubah status jadi Sedang Diproses dan simpan etalase_id)
const prosesPesanan = (req, res) => {
  const id = req.params.id;
  const { etalase_id } = req.body;

  cekStatusPesanan(id, ["Belum Diproses"], res, () => {
    pesananModel.updateStatusPesanan(
      id,
      "Sedang Diproses",
      etalase_id,
      (err) => {
        if (err) {
          console.error("Gagal memperbarui status:", err);
          return res.status(500).json({ message: "Gagal memperbarui status" });
        }
        res.json({ message: "Pesanan sedang diproses" });
      }
    );
  });
};

// Selesaikan pesanan (ubah status jadi Selesai dan simpan etalase_id)
const selesaikanPesanan = (req, res) => {
  const id = req.params.id;
  const { etalase_id } = req.body;

  cekStatusPesanan(id, ["Sedang Diproses"], res, () => {
    pesananModel.updateStatusPesanan(id, "Selesai", etalase_id, (err) => {
      if (err) {
        console.error("Gagal menyelesaikan pesanan:", err);
        return res.status(500).json({ message: "Gagal menyelesaikan pesanan" });
      }
      res.json({ message: "Pesanan telah selesai" });
    });
  });
};

// Upload bukti pembayaran
const uploadBuktiPembayaran = (req, res) => {
  const id = req.params.id;

  if (!req.file) {
    return res
      .status(400)
      .json({ message: "Bukti pembayaran tidak ditemukan" });
  }

  const filename = req.file.filename;

  pesananModel.uploadBuktiPembayaran(id, filename, (err) => {
    if (err) {
      console.error("Gagal menyimpan bukti pembayaran:", err);
      return res
        .status(500)
        .json({ message: "Gagal menyimpan bukti pembayaran" });
    }
    res.json({ message: "Bukti pembayaran berhasil diunggah" });
  });
};

module.exports = {
  createPesanan,
  getPesananKasir,
  getPesananById,
  batalkanPesanan,
  prosesPesanan,
  selesaikanPesanan,
  uploadBuktiPembayaran,
  cekStatusPesanan,
};
