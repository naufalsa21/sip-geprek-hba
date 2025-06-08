const menuModel = require("../models/menuModel");

// Tambah menu baru
const createMenu = (req, res) => {
  const data = req.body;
  menuModel.createMenu(data, (err, result) => {
    if (err) {
      console.error("Gagal menambahkan menu:", err);
      return res.status(500).json({ message: "Gagal menambahkan menu" });
    }
    res.json({ message: "Menu berhasil ditambahkan" });
  });
};

// Ambil semua menu
const getAllMenu = (req, res) => {
  menuModel.getAllMenu((err, results) => {
    if (err) {
      console.error("Gagal mengambil menu:", err);
      return res.status(500).json({ message: "Gagal mengambil menu" });
    }

    const data = results.map((menu) => ({
      ...menu,
      gambar: menu.gambar
        ? `data:image/jpeg;base64,${Buffer.from(menu.gambar).toString(
            "base64"
          )}`
        : null,
    }));

    res.json(data);
  });
};

// Ambil menu berdasarkan ID
const getMenuById = (req, res) => {
  const { id } = req.params;
  menuModel.getMenuById(id, (err, results) => {
    if (err) {
      console.error("Gagal mengambil data menu:", err);
      return res.status(500).json({ message: "Gagal mengambil data menu" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Menu tidak ditemukan" });
    }

    const menu = results[0];
    const gambarBase64 = menu.gambar
      ? `data:image/jpeg;base64,${Buffer.from(menu.gambar).toString("base64")}`
      : null;

    res.json({
      id: menu.id,
      nama: menu.nama,
      harga: menu.harga,
      kategori: menu.kategori,
      deskripsi: menu.deskripsi,
      status: menu.status,
      gambar: gambarBase64,
    });
  });
};

// Update data menu berdasarkan ID
const updateMenuById = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  menuModel.updateMenuById(id, data, (err) => {
    if (err) {
      console.error("Gagal update menu:", err);
      return res.status(500).json({ message: "Gagal update menu" });
    }
    res.json({ message: "Menu berhasil diupdate" });
  });
};

// Hapus menu berdasarkan ID
const deleteMenuById = (req, res) => {
  const { id } = req.params;
  menuModel.deleteMenuById(id, (err) => {
    if (err) {
      console.error("Gagal menghapus menu:", err);
      return res.status(500).json({ message: "Gagal menghapus menu" });
    }
    res.json({ message: "Menu berhasil dihapus" });
  });
};

// Update status menu berdasarkan ID
const updateMenuStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  menuModel.updateMenuStatus(id, status, (err) => {
    if (err) {
      console.error("Gagal ubah status menu:", err);
      return res.status(500).json({ message: "Gagal ubah status menu" });
    }
    res.json({ message: "Status menu diperbarui" });
  });
};

module.exports = {
  createMenu,
  getAllMenu,
  getMenuById,
  updateMenuById,
  deleteMenuById,
  updateMenuStatus,
};
