import React, { useState } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/SidebarEtalase";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

const DashboardEtalase = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [filterTipe, setFilterTipe] = useState("Semua");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const [daftarPesanan, setDaftarPesanan] = useState([]);

  useEffect(() => {
    const fetchPesanan = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/pesanan/kasir`);

        // Sort ascending berdasarkan waktu_pesan (dari yang paling lama ke yang terbaru)
        const sortedData = res.data.sort(
          (a, b) => new Date(a.waktu_pesan) - new Date(b.waktu_pesan)
        );

        setDaftarPesanan(sortedData);
      } catch (err) {
        console.error("Gagal mengambil data pesanan:", err);
      }
    };
    fetchPesanan();
  }, []);

  const filtered =
    filterTipe === "Semua"
      ? daftarPesanan.filter((p) => p.status === "Belum Diproses")
      : daftarPesanan.filter(
          (p) => p.tipe_pesanan === filterTipe && p.status === "Belum Diproses"
        );

  const statusWarna = {
    Selesai: "bg-green-500 text-white",
    "Sedang Diproses": "bg-yellow-400 text-gray-800",
    "Belum Diproses": "bg-blue-100 text-blue-700",
    Dibatalkan: "bg-red-600 text-white",
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 h-screen w-20 z-40">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 pl-20">
        <div className="fixed top-0 left-20 right-0 z-50">
          <Header />
        </div>

        {/* Konten utama */}
        <main className="p-6 space-y-6 mt-15">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h2>
            <p className="text-gray-600">
              Hai, selamat datang di dashboard etalase. Ingatlah selalu untuk
              bekerja dengan penuh semangat dan tanggung jawab agar pelayanan
              kita tetap cepat dan tepat, karena keberhasilan Rumah Makan Ayam
              Geprek HBA bergantung pada kerja keras kita semua. — Kepala Toko
            </p>
          </div>

          {/* Filter dan daftar pesanan */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-56">
              <p className="text-xs text-gray-600 mb-1">Filter Tipe Pesanan</p>
              <div
                onClick={toggleDropdown}
                className="relative px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm cursor-pointer bg-white"
              >
                <span>{filterTipe}</span>
                <span className="absolute top-1/2 right-3 transform -translate-y-1/2">
                  <ChevronDownIcon
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </span>
              </div>

              {/* Dropdown */}
              <div
                className={`absolute bg-white shadow-lg mt-1 rounded-md w-full transition-all duration-200 transform ${
                  isDropdownOpen
                    ? "scale-y-100 opacity-100"
                    : "scale-y-0 opacity-0"
                }`}
                style={{ transformOrigin: "top" }}
              >
                <ul className="py-1 text-sm">
                  {["Semua", "Makan di Tempat", "Bawa Pulang"].map((tipe) => (
                    <li
                      key={tipe}
                      onClick={() => {
                        setFilterTipe(tipe);
                        setIsDropdownOpen(false);
                      }}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      {tipe}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              className="bg-red-700 text-white px-4 py-2 rounded text-sm hover:bg-red-600 mt-5"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          </div>

          {/* Kotak pembungkus daftar pesanan */}
          <div className="p-4 bg-white rounded shadow space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Daftar Pesanan
            </h3>
            {filtered.map((item, i) => (
              <div
                key={i}
                onClick={() => navigate(`/etalase/pesanan/${item.id}`)}
                className="border border-gray-300 rounded p-3 hover:bg-gray-50 transition cursor-pointer shadow-sm"
              >
                <div>
                  <p className="font-bold">{item.nama_pelanggan}</p>

                  <p className="text-sm text-gray-600">{item.tipe_pesanan}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        statusWarna[item.status]
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-xs text-gray-600">
                      {dayjs(item.waktu_pesan).format("HH:mm")} WIB
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="text-center text-gray-500 text-sm">
                Tidak ada pesanan
              </p>
            )}

            {/* Tombol Lihat Semua Pesanan */}
            <div className="pt-4">
              <button
                onClick={() => navigate("/etalase/pesanan-masuk")}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-500 transition"
              >
                Lihat Semua Pesanan
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardEtalase;
