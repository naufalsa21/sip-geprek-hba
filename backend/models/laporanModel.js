const db = require("../config/db");

const laporanModel = {
  getPesananSelesai: (callback) => {
    const query = `
      SELECT 
        p.id,
        p.nama_pelanggan,
        p.tipe_pesanan,
        p.nomor_meja,
        p.total,
        p.status,
        p.waktu_pesan,
        p.metode_pembayaran,
        p.kasir_id,
        kasir.nama AS nama_kasir,
        p.etalase_id,
        etalase.nama AS nama_etalase
      FROM pesanan p
      LEFT JOIN users kasir ON p.kasir_id = kasir.id
      LEFT JOIN users etalase ON p.etalase_id = etalase.id
      WHERE p.status = 'Selesai'
      ORDER BY p.waktu_pesan DESC;
    `;
    db.query(query, callback);
  },
};

module.exports = laporanModel;
