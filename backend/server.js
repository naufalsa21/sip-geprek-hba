const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

// Koneksi ke database
const db = require("./config/db");

db.connect((err) => {
  if (err) {
    console.error("Gagal koneksi database:", err);
    process.exit(1);
  }
  console.log("Database terkoneksi");
});

// Import routes
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const menuRoute = require("./routes/menuRoute");
const pesananRoute = require("./routes/pesananRoute");
const adminRoute = require("./routes/adminRoute");
const laporanRoute = require("./routes/laporanRoute");

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Expose folder uploads
app.use("/upload-bukti", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", menuRoute);
app.use("/api", pesananRoute);
app.use("/api", adminRoute);
app.use("/api", laporanRoute);

// Route utama (test server)
app.get("/", (req, res) => {
  res.send("Server backend aktif");
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
