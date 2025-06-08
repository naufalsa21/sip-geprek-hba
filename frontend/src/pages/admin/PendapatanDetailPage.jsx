import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const PendapatanDetailPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const tanggalTerpilih =
    searchParams.get("tanggal") || dayjs().format("YYYY-MM-DD");

  const [dataPendapatan, setDataPendapatan] = useState(null);
  const [filterMetode, setFilterMetode] = useState("Semua");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendapatanDetail();
  }, [tanggalTerpilih]);

  const fetchPendapatanDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${API_BASE_URL}/api/pendapatan/detail`, {
        params: { tanggal: tanggalTerpilih },
      });

      setDataPendapatan(res.data);
    } catch (err) {
      console.error("Gagal mengambil data pendapatan detail:", err);
      setError("Gagal mengambil data pendapatan");
    } finally {
      setLoading(false);
    }
  };

  const toggleFilterDropdown = () => setIsFilterOpen(!isFilterOpen);

  const metodeOptions = ["Semua", "Tunai", "Non-Tunai"];

  const filteredData = () => {
    if (!dataPendapatan) return null;

    switch (filterMetode) {
      case "Tunai":
        return {
          label: "Pendapatan Tunai",
          value: Number(dataPendapatan.tunai || 0),
          jumlahTransaksi: Number(dataPendapatan.transaksiTunai || 0),
          transaksiTunai: Number(dataPendapatan.transaksiTunai || 0),
          transaksiNonTunai: 0,
        };
      case "Non-Tunai":
        return {
          label: "Pendapatan Non-Tunai",
          value: Number(dataPendapatan.nonTunai || 0),
          jumlahTransaksi: Number(dataPendapatan.transaksiNonTunai || 0),
          transaksiTunai: 0,
          transaksiNonTunai: Number(dataPendapatan.transaksiNonTunai || 0),
        };
      default:
        return {
          label: "Total Pendapatan",
          value: Number(dataPendapatan.totalPendapatan || 0),
          jumlahTransaksi: Number(dataPendapatan.jumlahTransaksi || 0),
          transaksiTunai: Number(dataPendapatan.transaksiTunai || 0),
          transaksiNonTunai: Number(dataPendapatan.transaksiNonTunai || 0),
        };
    }
  };

  const pendapatan = filteredData() || {
    label: "",
    value: 0,
    jumlahTransaksi: 0,
    transaksiTunai: 0,
    transaksiNonTunai: 0,
  };

  const rataRataPendapatan =
    pendapatan.jumlahTransaksi > 0
      ? pendapatan.value / pendapatan.jumlahTransaksi
      : 0;

  const totalTransaksi =
    pendapatan.transaksiTunai + pendapatan.transaksiNonTunai;

  const persenTunai =
    totalTransaksi > 0 ? (pendapatan.transaksiTunai / totalTransaksi) * 100 : 0;

  const persenNonTunai =
    totalTransaksi > 0
      ? (pendapatan.transaksiNonTunai / totalTransaksi) * 100
      : 0;

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-700 hover:text-black"
        >
          <ChevronLeft size={20} />
          <span>Kembali</span>
        </button>
        <h1 className="text-xl font-bold text-red-700">Geprek HBA</h1>
      </div>

      <main className="p-6 space-y-6">
        {/* Judul & Deskripsi */}
        <div>
          <h2 className="text-2xl font-bold mb-1">Detail Total Pendapatan</h2>
          <p className="text-gray-600">
            Rincian pendapatan pada hari{" "}
            <strong>
              {dayjs(tanggalTerpilih).format("dddd, DD MMMM YYYY")}
            </strong>
            .
          </p>
        </div>

        {/* Filter Metode Pembayaran */}
        <section className="relative w-60">
          <p className="text-xs text-gray-600 mb-1">Filter Metode Pembayaran</p>
          <div
            onClick={toggleFilterDropdown}
            className="relative px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm cursor-pointer bg-white"
          >
            <span>{filterMetode}</span>
            <span className="absolute top-1/2 right-3 transform -translate-y-1/2">
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  isFilterOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </span>
          </div>
          <div
            className={`absolute bg-white shadow-lg mt-1 rounded-md w-full transition-all duration-300 transform origin-top ${
              isFilterOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
            }`}
            style={{ transformOrigin: "top" }}
          >
            <ul className="py-1 text-sm">
              {metodeOptions.map((metode) => (
                <li
                  key={metode}
                  onClick={() => {
                    setFilterMetode(metode);
                    setIsFilterOpen(false);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {metode}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Konten Pendapatan */}
        <div>
          {loading ? (
            <p className="text-center text-gray-500">Memuat data...</p>
          ) : error ? (
            <p className="text-center text-red-600 font-semibold">{error}</p>
          ) : !dataPendapatan ? (
            <p className="text-center text-gray-500">
              Tidak ada data pendapatan
            </p>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 space-y-8">
              {/* Ringkasan Pendapatan */}
              <div className="flex flex-col items-center">
                <p className="text-gray-500 text-lg mb-2">{pendapatan.label}</p>
                <p className="text-5xl font-bold text-red-700">
                  Rp{pendapatan.value.toLocaleString("id-ID")}
                </p>
              </div>

              {/* Statistik Tambahan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
                <div className="bg-gray-100 rounded-md p-4 text-center shadow-sm">
                  <p className="font-semibold ">Jumlah Transaksi</p>
                  <p className="text-3xl font-bold">
                    {pendapatan.jumlahTransaksi}
                  </p>
                </div>
                <div className="bg-gray-100 rounded-md p-4 text-center shadow-sm">
                  <p className="font-semibold">Rata-rata Pendapatan</p>
                  <p className="text-3xl font-bold">
                    Rp
                    {rataRataPendapatan.toLocaleString("id-ID", {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
                <div className="bg-gray-100 rounded-md p-4 text-center shadow-sm col-span-full sm:col-span-2">
                  <p className="font-semibold  mb-1">
                    Perbandingan Tunai & Non-Tunai
                  </p>
                  <div className="w-full bg-gray-300 rounded-full h-5 overflow-hidden flex">
                    <div
                      className="bg-red-600 h-5"
                      style={{ width: `${persenTunai.toFixed(2)}%` }}
                      title={`Tunai: ${pendapatan.transaksiTunai}`}
                    ></div>
                    <div
                      className="bg-yellow-500 h-5"
                      style={{ width: `${persenNonTunai.toFixed(2)}%` }}
                      title={`Non-Tunai: ${pendapatan.transaksiNonTunai}`}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-gray-700">
                    <span>
                      {persenTunai.toFixed(1)}% Tunai (
                      {pendapatan.transaksiTunai})
                    </span>
                    <span>
                      {persenNonTunai.toFixed(1)}% Non-Tunai (
                      {pendapatan.transaksiNonTunai})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PendapatanDetailPage;
