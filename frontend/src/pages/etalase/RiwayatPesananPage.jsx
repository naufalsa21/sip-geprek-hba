import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/SidebarEtalase";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const statusWarna = {
  Selesai: "bg-green-500 text-white",
};

const RiwayatPesananPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [filter, setFilter] = useState("Semua");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pesanan, setPesanan] = useState([]);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/pesanan/kasir`);
        console.log("Data pesanan dari API:", res.data);

        // Waktu hari ini (WIB)
        const todayStart = dayjs().tz("Asia/Jakarta").startOf("day");
        const todayEnd = dayjs().tz("Asia/Jakarta").endOf("day");

        // Filter hanya yang status 'Selesai' dan waktu_pesan hari ini (WIB)
        const dataSelesaiHariIni = res.data.filter((p) => {
          const waktuWIB = dayjs(p.waktu_pesan).tz("Asia/Jakarta");
          return (
            p.status === "Selesai" &&
            waktuWIB.isAfter(todayStart) &&
            waktuWIB.isBefore(todayEnd)
          );
        });

        setPesanan(dataSelesaiHariIni);
      } catch (err) {
        console.error("Gagal mengambil data pesanan:", err);
      }
    };

    fetchData();
  }, []);

  const filteredData = pesanan.filter((item) => {
    const matchNama = item.nama_pelanggan
      ?.toLowerCase()
      .includes(searchText.toLowerCase());
    const matchMetode =
      filter === "Semua"
        ? true
        : item.metode_pembayaran?.toLowerCase() === filter.toLowerCase();
    return matchNama && matchMetode;
  });

  const totalPendapatan = filteredData.reduce(
    (acc, item) => acc + item.total,
    0
  );
  const totalTransaksi = filteredData.length;
  const jumlahTunai = filteredData.filter(
    (item) => item.metode_pembayaran === "Tunai"
  ).length;
  const jumlahNonTunai = filteredData.filter(
    (item) => item.metode_pembayaran === "Non-Tunai"
  ).length;

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
              Riwayat Pesanan
            </h2>
            <p className="text-gray-600">
              Halaman ini digunakan untuk melihat seluruh daftar pesanan yang
              telah selesai hari ini
            </p>
          </div>

          {/* Kolom pencarian */}
          <input
            type="text"
            placeholder="Cari pesanan berdasarkan nama pelanggan"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full"
          />

          {/* Filter metode pembayaran */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-56">
              <p className="text-xs text-gray-600 mb-1">
                Filter Metode Pembayaran
              </p>
              <div
                onClick={toggleDropdown}
                className="relative px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm cursor-pointer bg-white"
              >
                <span>{filter}</span>
                <span className="absolute top-1/2 right-3 transform -translate-y-1/2">
                  <ChevronDownIcon
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                      dropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </span>
              </div>
              <div
                className={`absolute bg-white shadow-lg mt-1 rounded-md w-full transition-all duration-200 transform z-10 ${
                  dropdownOpen
                    ? "scale-y-100 opacity-100"
                    : "scale-y-0 opacity-0 pointer-events-none"
                }`}
                style={{ transformOrigin: "top" }}
              >
                <ul className="py-1 text-sm">
                  {["Semua", "Tunai", "Non-Tunai"].map((item) => (
                    <li
                      key={item}
                      onClick={() => {
                        setFilter(item);
                        setDropdownOpen(false);
                      }}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      {item}
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
              Jumlah : <strong>{filteredData.length}</strong> Pesanan
            </span>
          </div>

          {/* Daftar Pesanan */}
          <div className="max-h-[450px] overflow-y-auto space-y-3">
            {filteredData.map((item) => (
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
                      className={`text-xs px-2 py-1 rounded ${statusWarna["Selesai"]}`}
                    >
                      Selesai
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

            {filteredData.length === 0 && (
              <p className="text-center text-gray-500 text-sm">
                Tidak ada data pesanan selesai.
              </p>
            )}
          </div>

          {/* Ringkasan */}
          <div className="bg-gray-200 p-4 rounded-md text-sm text-gray-800">
            <h3 className="font-bold text-gray-800 mb-2">
              Ringkasan Total Transaksi Hari Ini
            </h3>
            <p>
              Total Pesanan Selesai:{" "}
              <span className="font-semibold">{totalTransaksi}</span>
            </p>
            <p>
              Pendapatan Total:{" "}
              <span className="font-semibold">
                Rp {totalPendapatan.toLocaleString("id-ID")}
              </span>
            </p>
            <p>
              Total Pembayaran Tunai:{" "}
              <span className="font-semibold">
                Rp{" "}
                {filteredData
                  .filter((item) => item.metode_pembayaran === "Tunai")
                  .reduce((acc, item) => acc + item.total, 0)
                  .toLocaleString("id-ID")}
              </span>
            </p>
            <p>
              Total Pembayaran Non-Tunai:{" "}
              <span className="font-semibold">
                Rp{" "}
                {filteredData
                  .filter((item) => item.metode_pembayaran === "Non-Tunai")
                  .reduce((acc, item) => acc + item.total, 0)
                  .toLocaleString("id-ID")}
              </span>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RiwayatPesananPage;
