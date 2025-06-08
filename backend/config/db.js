const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Koneksi database gagal:", err);
  } else {
    console.log("✅ Terhubung ke database MySQL");
    db.query("SET time_zone = '+07:00';", (err) => {
      if (err) {
        console.error("❌ Gagal set timezone session:", err);
      } else {
        console.log("✅ Timezone session di-set ke WIB (+07:00)");
      }
    });
  }
});

module.exports = db;
