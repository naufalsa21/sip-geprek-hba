const db = require("../config/db");

const adminModel = {
  getSummary: (tanggal) => {
    const query = `
      SELECT 
        COUNT(*) AS total_transaksi,
        SUM(total) AS total_pendapatan,
        (SELECT COALESCE(SUM(jumlah), 0) 
         FROM detail_pesanan dp
         JOIN pesanan p ON dp.pesanan_id = p.id
         WHERE DATE(p.waktu_pesan) = ? AND p.status = 'Selesai') AS total_menu_terjual
      FROM pesanan
      WHERE DATE(waktu_pesan) = ? AND status = 'Selesai'
    `;

    return new Promise((resolve, reject) => {
      db.query(query, [tanggal, tanggal], (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || {});
      });
    });
  },

  getWeeklyChart: (startDate, endDate) => {
    const query = `
      SELECT 
        DATE(waktu_pesan) AS tanggal,
        COUNT(*) AS jumlah_transaksi
      FROM pesanan
      WHERE DATE(waktu_pesan) BETWEEN ? AND ? AND status = 'Selesai'
      GROUP BY DATE(waktu_pesan)
    `;

    return new Promise((resolve, reject) => {
      db.query(query, [startDate, endDate], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  getMenuTerjual: (tanggal) => {
    const query = `
      SELECT m.nama, COALESCE(SUM(filtered_dp.jumlah), 0) AS jumlah_terjual
      FROM menu m
      LEFT JOIN (
        SELECT dp.menu_id, dp.jumlah
        FROM detail_pesanan dp
        JOIN pesanan p ON dp.pesanan_id = p.id
        WHERE p.status = 'Selesai' AND DATE(p.waktu_pesan) = ?
      ) AS filtered_dp ON m.id = filtered_dp.menu_id
      GROUP BY m.id, m.nama
      ORDER BY jumlah_terjual DESC;
    `;

    return new Promise((resolve, reject) => {
      db.query(query, [tanggal], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  getPendapatanDetail: (tanggal) => {
    const query = `
      SELECT 
        COUNT(*) AS jumlahTransaksi,
        COALESCE(SUM(total), 0) AS totalPendapatan,
        COALESCE(SUM(CASE WHEN metode_pembayaran = 'Tunai' THEN total ELSE 0 END), 0) AS tunai,
        COALESCE(SUM(CASE WHEN metode_pembayaran != 'Tunai' THEN total ELSE 0 END), 0) AS nonTunai,
        COUNT(CASE WHEN metode_pembayaran = 'Tunai' THEN 1 END) AS transaksiTunai,
        COUNT(CASE WHEN metode_pembayaran != 'Tunai' THEN 1 END) AS transaksiNonTunai
      FROM pesanan
      WHERE DATE(waktu_pesan) = ? AND status = 'Selesai'
    `;

    return new Promise((resolve, reject) => {
      db.query(query, [tanggal], (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || {});
      });
    });
  },

  getTransaksiDetail: (tanggal) => {
    const query = `
      SELECT 
        p.id,
        p.waktu_pesan AS waktu,
        IFNULL(p.nama_pelanggan, '-') AS pelanggan,
        p.total,
        p.metode_pembayaran AS metode,
        kasir.nama AS kasir_nama,
        etalase.nama AS etalase_nama
      FROM pesanan p
      LEFT JOIN users kasir ON p.kasir_id = kasir.id
      LEFT JOIN users etalase ON p.etalase_id = etalase.id
      WHERE DATE(p.waktu_pesan) = ? AND p.status = 'Selesai'
      ORDER BY p.waktu_pesan DESC
    `;

    return new Promise((resolve, reject) => {
      db.query(query, [tanggal], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },
};

module.exports = adminModel;
