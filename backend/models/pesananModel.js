const db = require("../config/db");

const pesananModel = {
  createPesanan: (
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
    callback
  ) => {
    const insertPesanan = `
      INSERT INTO pesanan 
      (nama_pelanggan, tipe_pesanan, nomor_meja, catatan, total, metode_pembayaran, kasir_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertPesanan,
      [
        nama_pelanggan,
        tipe_pesanan,
        nomor_meja || null,
        catatan || null,
        total || 0,
        metode_pembayaran,
        kasir_id || null,
      ],
      (err, result) => {
        if (err) return callback(err);

        const pesananId = result.insertId;
        const insertDetail =
          "INSERT INTO detail_pesanan (pesanan_id, menu_id, jumlah, harga_satuan) VALUES ?";
        const detailValues = items.map((item) => [
          pesananId,
          item.menu_id,
          item.jumlah,
          item.harga,
        ]);

        db.query(insertDetail, [detailValues], (err2) => {
          if (err2) return callback(err2);
          callback(null, { message: "Pesanan berhasil disimpan" });
        });
      }
    );
  },

  // Ambil pesanan untuk kasir & etalase
  getPesananKasir: (callback) => {
    const query = `
      SELECT 
        p.id,
        p.nama_pelanggan,
        p.tipe_pesanan,
        p.nomor_meja,
        p.status,
        p.waktu_pesan,
        p.metode_pembayaran,
        p.total,
        kasir.nama AS kasir_nama,
        etalase.nama AS etalase_nama
      FROM pesanan p
      LEFT JOIN users kasir ON p.kasir_id = kasir.id
      LEFT JOIN users etalase ON p.etalase_id = etalase.id
      WHERE 
        DATE(p.waktu_pesan) = CURDATE()
        AND p.status IN ('Belum Diproses', 'Sedang Diproses', 'Selesai', 'Dibatalkan')
      ORDER BY p.waktu_pesan DESC
    `;

    db.query(query, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  getPesananById: (id, callback) => {
    const queryPesanan = `
      SELECT 
        p.id,
        p.nama_pelanggan,
        p.tipe_pesanan,
        p.nomor_meja,
        p.catatan,
        p.total,
        p.status,
        p.metode_pembayaran,
        p.waktu_pesan,
        p.bukti_pembayaran,
        kasir.nama AS kasir_nama,
        etalase.nama AS etalase_nama
      FROM pesanan p
      LEFT JOIN users kasir ON p.kasir_id = kasir.id
      LEFT JOIN users etalase ON p.etalase_id = etalase.id
      WHERE p.id = ?
    `;

    const queryDetail = `
      SELECT dp.jumlah, dp.harga_satuan, m.nama
      FROM detail_pesanan dp
      JOIN menu m ON dp.menu_id = m.id
      WHERE dp.pesanan_id = ?
    `;

    db.query(queryPesanan, [id], (err, pesananResult) => {
      if (err) return callback(err);
      if (pesananResult.length === 0) return callback(null, null);

      db.query(queryDetail, [id], (err2, detailResult) => {
        if (err2) return callback(err2);

        const result = { ...pesananResult[0], items: detailResult };
        callback(null, result);
      });
    });
  },

  cekStatusPesanan: (id, callback) => {
    const checkQuery = "SELECT status FROM pesanan WHERE id = ?";
    db.query(checkQuery, [id], (err, result) => {
      if (err) return callback(err);
      if (result.length === 0) return callback(null, null);
      callback(null, result[0].status);
    });
  },

  updateStatusPesanan: (id, status, etalase_id = null, callback) => {
    const update =
      etalase_id === null
        ? "UPDATE pesanan SET status = ? WHERE id = ?"
        : "UPDATE pesanan SET status = ?, etalase_id = ? WHERE id = ?";

    const params =
      etalase_id === null ? [status, id] : [status, etalase_id, id];

    db.query(update, params, (err) => {
      if (err) return callback(err);
      callback(null, { message: `Status pesanan diubah menjadi ${status}` });
    });
  },

  uploadBuktiPembayaran: (id, filename, callback) => {
    const update = "UPDATE pesanan SET bukti_pembayaran = ? WHERE id = ?";
    db.query(update, [filename, id], (err) => {
      if (err) return callback(err);
      callback(null, { message: "Bukti pembayaran berhasil diunggah" });
    });
  },
};

module.exports = pesananModel;
