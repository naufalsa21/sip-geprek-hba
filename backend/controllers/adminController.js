const adminModel = require("../models/adminModel");

const adminController = {
  getDashboardSummary: async (req, res) => {
    try {
      const { start, end } = req.query;
      if (!start || !end) {
        return res
          .status(400)
          .json({ message: "Parameter 'start' dan 'end' dibutuhkan" });
      }

      const tanggal = start.split(" ")[0];
      const data = await adminModel.getSummary(start, end);

      res.json({
        transaksi: data.total_transaksi || 0,
        pendapatan: data.total_pendapatan || 0,
        menuTerjual: data.total_menu_terjual || 0,
      });
    } catch (err) {
      console.error("Gagal mengambil ringkasan:", err);
      res.status(500).json({ message: "Gagal mengambil data ringkasan" });
    }
  },

  getDashboardChart: async (req, res) => {
    try {
      const { start } = req.query;
      if (!start)
        return res
          .status(400)
          .json({ message: "Parameter 'start' dibutuhkan" });

      const startDate = new Date(start + "T00:00:00");
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);

      const results = await adminModel.getWeeklyChart(startDate, endDate);

      // Mapping results ke bentuk array 7 hari
      const resultMap = {};
      results.forEach((row) => {
        // row.tanggal adalah Date object, ubah ke string yyyy-mm-dd
        const key = row.tanggal.toLocaleDateString("en-CA");
        resultMap[key] = row.jumlah_transaksi;
      });

      const data = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        const key = d.toLocaleDateString("en-CA");
        const hari = d.toLocaleDateString("id-ID", { weekday: "short" });
        const tanggalPenuh = d.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
        return {
          hari,
          tanggalPenuh,
          transaksi: resultMap[key] || 0,
          tanggalISO: key,
        };
      });

      res.json(data);
    } catch (err) {
      console.error("Gagal mengambil data grafik:", err);
      res.status(500).json({ message: "Gagal mengambil data grafik" });
    }
  },

  getMenuTerjual: async (req, res) => {
    try {
      const tanggal =
        req.query.tanggal || new Date().toLocaleDateString("en-CA");
      const results = await adminModel.getMenuTerjual(tanggal);
      res.json(results);
    } catch (err) {
      console.error("Gagal mengambil data menu terjual:", err);
      res.status(500).json({ message: "Gagal mengambil data menu terjual" });
    }
  },

  getPendapatanDetail: async (req, res) => {
    try {
      const tanggal =
        req.query.tanggal || new Date().toLocaleDateString("en-CA");
      const data = await adminModel.getPendapatanDetail(tanggal);
      res.json({
        jumlahTransaksi: data.jumlahTransaksi || 0,
        totalPendapatan: data.totalPendapatan || 0,
        tunai: data.tunai || 0,
        nonTunai: data.nonTunai || 0,
        transaksiTunai: data.transaksiTunai || 0,
        transaksiNonTunai: data.transaksiNonTunai || 0,
      });
    } catch (err) {
      console.error("Gagal mengambil detail pendapatan:", err);
      res.status(500).json({ message: "Gagal mengambil data" });
    }
  },

  getTransaksiDetail: async (req, res) => {
    try {
      const tanggal =
        req.query.tanggal || new Date().toLocaleDateString("en-CA");
      const results = await adminModel.getTransaksiDetail(tanggal);

      // Konversi waktu menjadi ISO agar konsisten
      const formatted = results.map((row) => ({
        id: row.id,
        waktu: new Date(row.waktu).toISOString(),
        pelanggan: row.pelanggan,
        total: row.total,
        metode: row.metode,
        kasir_nama: row.kasir_nama || "-",
        etalase_nama: row.etalase_nama || "-",
      }));

      res.json(formatted);
    } catch (err) {
      console.error("Gagal mengambil detail transaksi:", err);
      res.status(500).json({ message: "Gagal mengambil data transaksi" });
    }
  },
};

module.exports = adminController;
