const db = require("../config/db");

// Tambah menu
const createMenu = (data, callback) => {
  const { nama, harga, kategori, deskripsi, gambar } = data;
  const query = `
    INSERT INTO menu (nama, harga, kategori, deskripsi, gambar) 
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [nama, harga, kategori, deskripsi, Buffer.from(gambar, "base64")],
    callback
  );
};

// Ambil semua menu
const getAllMenu = (callback) => {
  const query = `
    SELECT id, nama, harga, kategori, deskripsi, gambar, status 
    FROM menu
  `;
  db.query(query, callback);
};

// Ambil menu berdasarkan ID
const getMenuById = (id, callback) => {
  const query = `
    SELECT id, nama, harga, kategori, deskripsi, gambar, status 
    FROM menu WHERE id = ?
  `;
  db.query(query, [id], callback);
};

// Update menu berdasarkan ID
const updateMenuById = (id, data, callback) => {
  const { nama, harga, kategori, deskripsi, gambar } = data;
  const query = `
    UPDATE menu 
    SET nama=?, harga=?, kategori=?, deskripsi=?, gambar=? 
    WHERE id=?
  `;
  db.query(
    query,
    [nama, harga, kategori, deskripsi, Buffer.from(gambar, "base64"), id],
    callback
  );
};

// Hapus menu berdasarkan ID
const deleteMenuById = (id, callback) => {
  const query = `DELETE FROM menu WHERE id = ?`;
  db.query(query, [id], callback);
};

// Ubah status menu
const updateMenuStatus = (id, status, callback) => {
  const query = `UPDATE menu SET status = ? WHERE id = ?`;
  db.query(query, [status, id], callback);
};

module.exports = {
  createMenu,
  getAllMenu,
  getMenuById,
  updateMenuById,
  deleteMenuById,
  updateMenuStatus,
};

// const db = require("../config/db");

//
// const createMenu = (menuData, callback) => {
//   const { nama, harga, kategori, deskripsi, gambar } = menuData;
//   const query = `
//     INSERT INTO menu (nama, harga, kategori, deskripsi, gambar)
//     VALUES (?, ?, ?, ?, ?)
//   `;
//   db.query(query, [nama, harga, kategori, deskripsi, gambar], callback);
// };

//
// const getAllMenu = (callback) => {
//   const query = `
//     SELECT id, nama, harga, kategori, deskripsi, gambar, status
//     FROM menu
//   `;
//   db.query(query, callback);
// };

//
// const getMenuById = (id, callback) => {
//   const query = `
//     SELECT id, nama, harga, kategori, deskripsi, gambar, status
//     FROM menu
//     WHERE id = ?
//   `;
//   db.query(query, [id], callback);
// };

//
// const updateMenuById = (id, menuData, callback) => {
//   const { nama, harga, kategori, deskripsi, gambar } = menuData;
//   const query = `
//     UPDATE menu
//     SET nama = ?, harga = ?, kategori = ?, deskripsi = ?, gambar = ?
//     WHERE id = ?
//   `;
//   db.query(query, [nama, harga, kategori, deskripsi, gambar, id], callback);
// };

//
// const deleteMenuById = (id, callback) => {
//   const query = `
//     DELETE FROM menu
//     WHERE id = ?
//   `;
//   db.query(query, [id], callback);
// };

//
// const updateMenuStatus = (id, status, callback) => {
//   const query = `
//     UPDATE menu
//     SET status = ?
//     WHERE id = ?
//   `;
//   db.query(query, [status, id], callback);
// };

// module.exports = {
//   createMenu,
//   getAllMenu,
//   getMenuById,
//   updateMenuById,
//   deleteMenuById,
//   updateMenuStatus,
// };
