const laporanModel = require("../models/laporanModel");

const laporanController = {
  getPesananSelesai: (req, res) => {
    laporanModel.getPesananSelesai((err, results) => {
      if (err) {
        console.error("Gagal mengambil data pesanan selesai:", err);
        return res
          .status(500)
          .json({ message: "Gagal mengambil data pesanan selesai" });
      }
      res.json(results);
    });
  },
};

module.exports = laporanController;
