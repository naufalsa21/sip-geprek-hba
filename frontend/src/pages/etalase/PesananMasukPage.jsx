import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/SidebarEtalase";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useNavigate } from "react-router-dom";

dayjs.extend(utc);
dayjs.extend(timezone);

const statusWarna = {
  Selesai: "bg-green-500 text-white",
  "Sedang Diproses": "bg-yellow-400 text-gray-800",
  "Belum Diproses": "bg-blue-100 text-blue-700",
  Dibatalkan: "bg-red-600 text-white",
};

const PesananMasukPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [daftarPesanan, setDaftarPesanan] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPesanan = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/pesanan/kasir`);

        // Tentukan waktu hari ini berdasarkan WIB
        const todayStart = dayjs().tz("Asia/Jakarta").startOf("day");
        const todayEnd = dayjs().tz("Asia/Jakarta").endOf("day");

        // Filter pesanan dengan status aktif dan waktu_pesan hari ini (WIB)
        const hanyaAktifHariIni = res.data.filter((item) => {
          const waktuWIB = dayjs(item.waktu_pesan).tz("Asia/Jakarta");
          return (
            ["Belum Diproses", "Sedang Diproses"].includes(item.status) &&
            waktuWIB.isAfter(todayStart) &&
            waktuWIB.isBefore(todayEnd)
          );
        });

        // Urutkan: Belum Diproses dulu, lalu Sedang Diproses, berdasarkan waktu_pesan (WIB)
        const urutkan = hanyaAktifHariIni.sort((a, b) => {
          const statusOrder = {
            "Belum Diproses": 0,
            "Sedang Diproses": 1,
          };

          if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
          }

          // Urut berdasarkan waktu pesan (WIB), dari yang paling lama
          return (
            dayjs(a.waktu_pesan).tz("Asia/Jakarta").valueOf() -
            dayjs(b.waktu_pesan).tz("Asia/Jakarta").valueOf()
          );
        });

        setDaftarPesanan(urutkan);
      } catch (err) {
        console.error("Gagal mengambil data pesanan:", err);
      }
    };

    fetchPesanan();
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const filtered =
    filterStatus === "Semua"
      ? daftarPesanan
      : daftarPesanan.filter((item) => item.status === filterStatus);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 h-screen w-20 z-40">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 pl-20">
        <div className="fixed top-0 left-20 right-0 z-50">
          <Header />
        </div>

        <main className="p-6 space-y-6 mt-15">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Daftar Pesanan
            </h2>
            <p className="text-gray-600">
              Halaman ini digunakan untuk melihat detail dan mengelola status
              pesanan hari ini secara lengkap.
            </p>
          </div>

          {/* Filter dan tombol */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-56">
              <p className="text-xs text-gray-600 mb-1">
                Filter Status Pesanan
              </p>
              <div
                onClick={toggleDropdown}
                className="relative px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm cursor-pointer bg-white"
              >
                <span>{filterStatus}</span>
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
                className={`absolute bg-white shadow-lg mt-1 rounded-md w-full transition-all duration-200 transform z-10 ${
                  isDropdownOpen
                    ? "scale-y-100 opacity-100"
                    : "scale-y-0 opacity-0 pointer-events-none"
                }`}
                style={{ transformOrigin: "top" }}
              >
                <ul className="py-1 text-sm">
                  {["Semua", "Belum Diproses", "Sedang Diproses"].map(
                    (status) => (
                      <li
                        key={status}
                        onClick={() => {
                          setFilterStatus(status);
                          setIsDropdownOpen(false);
                        }}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        {status}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            <button
              className="bg-red-700 text-white px-4 py-2 rounded text-sm hover:bg-red-600 mt-5"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>

            <span className="ml-auto mt-6 text-sm text-gray-800">
              Jumlah : <strong>{filtered.length}</strong> Pesanan
            </span>
          </div>

          {/* Daftar Pesanan */}
          <div className="space-y-3">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                onClick={() => navigate(`/etalase/pesanan/${item.id}`)}
                className="flex justify-between items-start bg-white p-4 rounded shadow hover:bg-gray-50 cursor-pointer"
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
                      {dayjs(item.waktu_pesan)
                        .tz("Asia/Jakarta")
                        .format("HH:mm")}{" "}
                      WIB
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default PesananMasukPage;
