const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

// Ambil semua user (staff)
const getAllStaff = (req, res) => {
  userModel.getAllStaff((err, results) => {
    if (err) {
      console.error("Gagal mengambil data staff:", err);
      return res.status(500).json({ message: "Server error" });
    }

    const data = results.map((user) => ({
      ...user,
      foto: user.foto ? Buffer.from(user.foto).toString("base64") : null,
    }));

    res.json(data);
  });
};

// Tambah user baru (staff)
const addUser = async (req, res) => {
  try {
    const userData = req.body;

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Ganti password dengan hasil hash
    const userDataWithHash = {
      ...userData,
      password: hashedPassword,
    };

    userModel.addUser(userDataWithHash, (err, result) => {
      if (err) {
        console.error("Gagal menambah user:", err);
        return res.status(500).json({ message: "Gagal menyimpan user" });
      }
      res.json({ message: "User berhasil ditambahkan" });
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Ambil detail 1 staff berdasarkan ID
const getUserById = (req, res) => {
  const { id } = req.params;

  userModel.getUserById(id, (err, user) => {
    if (err) {
      console.error("Gagal mengambil data staff:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (!user) {
      return res.status(404).json({ message: "Staff tidak ditemukan" });
    }

    // Konversi foto buffer ke base64
    const fotoBase64 = user.foto
      ? Buffer.from(user.foto).toString("base64")
      : null;

    res.json({
      id: user.id,
      nama: user.nama,
      telepon: user.telepon,
      password: user.password,
      role: user.role,
      tanggal_gabung: user.tanggal_gabung,
      foto: fotoBase64,
    });
  });
};

// Update / edit data staff
const updateStaffById = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };

  try {
    if (data.password) {
      const saltRounds = 10;
      data.password = await bcrypt.hash(data.password, saltRounds);
    }

    userModel.updateStaffById(id, data, (err, result) => {
      if (err) {
        console.error("Gagal update staff:", err);
        return res.status(500).json({ message: "Gagal update staff" });
      }
      res.json({ message: "Data staff berhasil diupdate" });
    });
  } catch (error) {
    console.error("Error saat update staff:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Hapus user (staff)
const deleteStaffById = (req, res) => {
  const { id } = req.params;

  userModel.deleteStaffById(id, (err, result) => {
    if (err) {
      console.error("Gagal menghapus staff:", err);
      return res.status(500).json({ message: "Gagal menghapus staff" });
    }
    res.json({ message: "Staff berhasil dihapus" });
  });
};

const getUserHeaderById = (req, res) => {
  const { id } = req.params;

  userModel.getUserHeaderById(id, (err, user) => {
    if (err) {
      console.error("Gagal mengambil data user:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(user);
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
