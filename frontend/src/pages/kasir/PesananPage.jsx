import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/SidebarKasir";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
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

const PesananPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pesananList, setPesananList] = useState([]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/pesanan/kasir`);
        setPesananList(res.data);
      } catch (err) {
        console.error("Gagal mengambil data pesanan:", err);
        alert("Gagal memuat data pesanan");
      }
    };
    fetchData();
  }, []);

  const statusPrioritas = {
    "Belum Diproses": 1,
    "Sedang Diproses": 2,
    Selesai: 3,
    Dibatalkan: 4,
  };

  // Filter berdasarkan hari ini (Asia/Jakarta)
  const todayStart = dayjs().tz("Asia/Jakarta").startOf("day");
  const todayEnd = dayjs().tz("Asia/Jakarta").endOf("day");

  const filtered = pesananList
    .filter((item) => {
      const waktuPesanJakarta = dayjs.utc(item.waktu_pesan).tz("Asia/Jakarta");
      return (
        waktuPesanJakarta.isAfter(todayStart) &&
        waktuPesanJakarta.isBefore(todayEnd)
      );
    })
    .filter((item) =>
      filterStatus === "Semua" ? true : item.status === filterStatus
    )
    .filter((item) =>
      item.nama_pelanggan.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      if (statusPrioritas[a.status] !== statusPrioritas[b.status]) {
        return statusPrioritas[a.status] - statusPrioritas[b.status];
      }
      return dayjs(b.waktu_pesan).valueOf() - dayjs(a.waktu_pesan).valueOf();
    });

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
              pesanan secara lengkap.
            </p>
          </div>

          {/* Kolom pencarian */}
          <input
            type="text"
            placeholder="Cari pesanan berdasarkan nama"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full"
          />

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
              <div
                className={`absolute bg-white shadow-lg mt-1 rounded-md w-full transition-all duration-200 transform ${
                  isDropdownOpen
                    ? "scale-y-100 opacity-100"
                    : "scale-y-0 opacity-0"
                }`}
                style={{ transformOrigin: "top" }}
              >
                <ul className="py-1 text-sm">
                  {[
                    "Semua",
                    "Selesai",
                    "Belum Diproses",
                    "Sedang Diproses",
                    "Dibatalkan",
                  ].map((status) => (
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

            <span className="ml-auto mt-6 text-sm text-gray-800">
              Jumlah : <strong>{filtered.length}</strong> Pesanan
            </span>
          </div>

          {/* Daftar Pesanan */}
          <div className="space-y-3">
            {filtered.map((item, i) => (
              <div
                key={i}
                onClick={() => navigate(`/kasir/detail-pesanan/${item.id}`)}
                className="flex justify-between items-start bg-white p-4 rounded shadow hover:bg-gray-50 cursor-pointer"
              >
                <div>
                  <p className="font-bold">{item.nama_pelanggan}</p>
                  <p className="text-sm text-gray-600">{item.tipe_pesanan}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        statusWarna[item.status] || "bg-gray-400 text-white"
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default PesananPage;
