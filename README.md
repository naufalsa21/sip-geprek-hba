# SIP-Geprek HBA

Sistem Informasi Pemesanan Geprek HBA — aplikasi manajemen pemesanan dan transaksi untuk usaha kuliner, dibangun menggunakan React (Vite) untuk frontend, Node.js (Express) untuk backend, dan MySQL sebagai database.

---

## 📁 Struktur Proyek

sip-geprek-hba/
├── backend/ → Backend Node.js + Express + MySQL
└── frontend/ → Frontend React + Vite

---

## 🚀 Fitur Utama

- Multi-role login: Admin, Kasir, Etalase
- Manajemen pesanan & transaksi
- Manajemen pesanan & transaksi
- Laporan penjualan dan pendapatan

---

## 📦 Instalasi Lokal

### 1. Clone repository

```bash
git clone https://github.com/username/sip-geprek-hba.git
cd sip-geprek-hba
```

### 2. Setup Backend

cd backend
npm install

- Konfigurasi .env
  Buat file .env di folder backend/ dengan format:
  DB_HOST=localhost
  DB_PORT=3306
  DB_USER=root
  DB_PASSWORD=yourpassword
  DB_NAME=sipgeprek
  PORT=5000

- Jalankan server backend
  npx nodemon server.js

### 3. Setup Frontend

cd backend
npm install

cd ../frontend
npm install

- Konfigurasi .env
  Buat file .env di folder frontend/ dengan isi:

VITE_API_URL=http://localhost:5000

- Jalankan frontend
  npm run dev
  Frontend akan berjalan di http://localhost:5173.

---

## ☁️ Deployment

- 📍 Backend (Railway)

1. Login ke Railway
2. Buat project baru, lalu deploy folder backend/
3. Tambahkan Environment Variables sesuai file .env
4. Railway akan memberikan URL backend, misal: https://sip-backend.up.railway.app

- 📍 Frontend (Vercel)

1. Login ke Vercel
2. Buat project baru dari folder frontend/
3. Set environment variable VITE_API_URL ke URL backend Railway
4. Deploy dan dapatkan URL frontend, misalnya: https://sip-geprek-hba.vercel.app

---

## 🛠 Teknologi

- Frontend: React (Vite), TailwindCSS
- Backend: Node.js, Express.js
- Database: MySQL
- Deployment: Vercel (frontend), /Railway (backend,database)

---

## 👨‍💻 Developer

Dibuat oleh : Naufal Septio Akbar – Fullstack Developer
🚀 Proyek pengelolaan sistem informasi warung geprek berbasis web

---

## 📄 Lisensi

Proyek ini bebas digunakan untuk pembelajaran atau pengembangan lanjutan internal. Tidak untuk dikomersialisasikan tanpa izin.
