-- Buat database
CREATE DATABASE IF NOT EXISTS sipgeprek;
USE sipgeprek;

-- Tabel users (admin, kasir, etalase)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('admin', 'kasir', 'etalase') NOT NULL,
  foto LONGBLOB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel menu
CREATE TABLE menu (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_menu VARCHAR(100),
  kategori ENUM('makanan', 'minuman'),
  harga INT,
  status ENUM('tersedia', 'tidak tersedia'),
  gambar LONGBLOB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel pesanan
CREATE TABLE pesanan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pelanggan VARCHAR(100),
  total INT,
  metode_pembayaran ENUM('tunai', 'non-tunai'),
  bukti_pembayaran LONGBLOB,
  status ENUM('Belum Diproses', 'Sedang Diproses', 'Selesai', 'Dibatalkan'),
  kasir_id INT,
  etalase_id INT,
  waktu_pesan DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kasir_id) REFERENCES users(id),
  FOREIGN KEY (etalase_id) REFERENCES users(id)
);

-- Tabel detail_pesanan
CREATE TABLE detail_pesanan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pesanan_id INT,
  menu_id INT,
  jumlah INT,
  subtotal INT,
  FOREIGN KEY (pesanan_id) REFERENCES pesanan(id),
  FOREIGN KEY (menu_id) REFERENCES menu(id)
);
