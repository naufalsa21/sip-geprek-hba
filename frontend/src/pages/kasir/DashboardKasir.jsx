import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/SidebarKasir";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const DashboardKasir = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [daftarPesanan, setDaftarPesanan] = useState([]);

  // Prioritas status untuk urutan tampil
  const statusPrioritas = {
    "Belum Diproses": 1,
    "Sedang Diproses": 2,
  };

  useEffect(() => {
    const fetchPesanan = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/pesanan/kasir`);

        const todayStart = dayjs().tz("Asia/Jakarta").startOf("day");
        const todayEnd = dayjs().tz("Asia/Jakarta").endOf("day");

        // Filter status yang sesuai
        let data = res.data.filter((item) => {
          const waktuWIB = dayjs(item.waktu_pesan).tz("Asia/Jakarta");
          return (
            ["Belum Diproses", "Sedang Diproses"].includes(item.status) &&
            waktuWIB.isAfter(todayStart) &&
            waktuWIB.isBefore(todayEnd)
          );
        });

        // Sorting: prioritas status lalu waktu pesan terbaru
        data.sort((a, b) => {
          if (statusPrioritas[a.status] !== statusPrioritas[b.status]) {
            return statusPrioritas[a.status] - statusPrioritas[b.status];
          }
          return (
            dayjs(b.waktu_pesan).valueOf() - dayjs(a.waktu_pesan).valueOf()
          );
        });

        setDaftarPesanan(data);
      } catch (err) {
        console.error("Gagal mengambil data pesanan:", err);
        alert("Gagal memuat data pesanan");
      }
    };

    fetchPesanan();
  }, []);

  const getStatusBadge = (status) => {
    const styleMap = {
      Selesai: "bg-green-500 text-white",
      "Sedang Diproses": "bg-yellow-400 text-gray-800",
      "Belum Diproses": "bg-blue-100 text-blue-700",
    };

    return (
      <span
        className={`text-xs px-2 py-1 rounded ${
          styleMap[status] || "bg-gray-400 text-white"
        }`}
      >
        {status}
      </span>
    );
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

        {/* Main Content */}
        <main className="p-6 space-y-6 mt-15">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h2>
            <p className="text-gray-600">
              Hai, selamat datang di dashboard kasir. Ingatlah selalu untuk
              bekerja dengan penuh semangat dan tanggung jawab agar pelayanan
              kita tetap cepat dan tepat, karena keberhasilan Rumah Makan Ayam
              Geprek HBA bergantung pada kerja keras kita semua. — Kepala Toko
            </p>
          </div>

          {/* Tombol Tambah Pesanan */}
          <div>
            <button
              onClick={() => navigate("/kasir/tambah-pesanan")}
              className="w-50 h-15 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 font-semibold"
            >
              + Tambah Pesanan
            </button>
          </div>

          {/* Daftar Pesanan Aktif */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Daftar Pesanan Hari Ini
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {daftarPesanan.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Belum ada pesanan hari ini.
                </p>
              ) : (
                daftarPesanan.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(`/kasir/detail-pesanan/${item.id}`)}
                    className="flex justify-between items-start border border-gray-200 rounded p-3 hover:bg-gray-50 transition cursor-pointer shadow-sm"
                  >
                    <div>
                      <p className="font-bold">{item.nama_pelanggan}</p>
                      <p className="text-sm text-gray-600">
                        {item.tipe_pesanan}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            getStatusBadge(item.status).props.className
                          }`}
                        >
                          {item.status}
                        </span>
                        <span className="text-xs text-gray-600">
                          {dayjs(item.waktu_pesan)
                            .tz("Asia/Jakarta")
                            .format("HH:mm")}{" "}
                          WIB
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="pt-4">
              <button
                onClick={() => navigate("/kasir/pesanan")}
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

export default DashboardKasir;
