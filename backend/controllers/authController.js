const bcrypt = require("bcrypt");
const authModel = require("../models/authModel");

const login = (req, res) => {
  const { telepon, password } = req.body;

  if (!telepon || !password) {
    return res
      .status(400)
      .json({ message: "Nomor Telepon dan Kata Sandi wajib diisi" });
  }

  authModel.findUserByPhone(telepon, async (err, user) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }

    if (!user) {
      return res.status(401).json({ message: "Nomor Telepon tidak ditemukan" });
    }

    // Gunakan bcrypt untuk validasi password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Kata Sandi salah" });
    }

    res.status(200).json({
      id: user.id,
      role: user.role,
    });
  });
};

module.exports = {
  login,
};
