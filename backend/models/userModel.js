const db = require("../config/db");

// Ambil semua user (staff)
const getAllStaff = (callback) => {
  const query = `
    SELECT id, nama, role AS jabatan, tanggal_gabung, foto 
    FROM users WHERE role IN ('kasir', 'etalase')
  `;
  db.query(query, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Tambah user baru (staff)
const addUser = (userData, callback) => {
  const { nama, telepon, password, role, foto } = userData;
  const tanggal_gabung = new Date();

  const query =
    "INSERT INTO users (nama, telepon, password, role, foto, tanggal_gabung) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    query,
    [
      nama,
      telepon,
      password,
      role,
      Buffer.from(foto, "base64"),
      tanggal_gabung,
    ],
    (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    }
  );
};

// Ambil detail 1 staff berdasarkan ID
const getUserById = (id, callback) => {
  const query = `
    SELECT id, nama, telepon, password, role, tanggal_gabung, foto 
    FROM users WHERE id = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) return callback(err, null);
    if (results.length === 0) return callback(null, null);
    callback(null, results[0]);
  });
};

// Update / edit data staff
const updateStaffById = (id, data, callback) => {
  const { nama, telepon, password, role, foto } = data;
  const fotoBuffer = Buffer.from(foto, "base64");

  let query = "";
  let values = [];

  if (password) {
    query =
      "UPDATE users SET nama = ?, telepon = ?, password = ?, role = ?, foto = ? WHERE id = ?";
    values = [nama, telepon, password, role, fotoBuffer, id];
  } else {
    query =
      "UPDATE users SET nama = ?, telepon = ?, role = ?, foto = ? WHERE id = ?";
    values = [nama, telepon, role, fotoBuffer, id];
  }

  db.query(query, values, (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
};

// Hapus user (staff)
const deleteStaffById = (id, callback) => {
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
};

const getUserHeaderById = (id, callback) => {
  const query = "SELECT id, nama, role, foto FROM users WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return callback(err, null);
    if (results.length === 0) return callback(null, null);

    const user = results[0];
    user.foto = user.foto ? Buffer.from(user.foto).toString("base64") : null;
    callback(null, user);
  });
};

module.exports = {
  getAllStaff,
  addUser,
  getUserById,
  updateStaffById,
  deleteStaffById,
  getUserHeaderById,
};
