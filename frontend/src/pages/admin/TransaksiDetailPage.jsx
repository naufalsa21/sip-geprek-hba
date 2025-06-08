import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const metodeOptions = ["Semua", "Tunai", "Non-Tunai"];
const metodeWarna = {
  Tunai: "bg-green-500 text-white",
  "Non-Tunai": "bg-blue-500 text-white",
};

const TransaksiDetailPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const tanggalTerpilih =
    searchParams.get("tanggal") || dayjs().format("YYYY-MM-DD");

  const [dataTransaksi, setDataTransaksi] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterMetode, setFilterMetode] = useState("Semua");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransaksiDetail();
  }, [tanggalTerpilih]);

  const fetchTransaksiDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE_URL}/api/transaksi/detail`, {
        params: { tanggal: tanggalTerpilih },
      });
      setDataTransaksi(res.data);
    } catch (err) {
      console.error("Gagal mengambil data transaksi:", err);
      setError("Gagal mengambil data transaksi");
    } finally {
      setLoading(false);
    }
  };

  // Toggle dropdown filter metode
  const toggleFilterDropdown = () => {
    setIsFilterOpen((prev) => !prev);
  };

  // Filter data berdasarkan searchText dan filterMetode
  const filteredData = dataTransaksi.filter((row) => {
    const matchPelanggan = row.pelanggan
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchMetode =
      filterMetode === "Semua"
        ? true
        : row.metode.toLowerCase() === filterMetode.toLowerCase();

    return matchPelanggan && matchMetode;
  });

  return (
    <div className="bg-gray-100 min-h-screen">
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

      <div className="p-6 space-y-6">
        {/* Judul & Deskripsi */}
        <div>
          <h2 className="text-2xl font-bold mb-1">Detail Total Transaksi</h2>
          <p className="text-gray-600">
            Rincian transaksi pada hari{" "}
            <strong>
              {dayjs(tanggalTerpilih).format("dddd, DD MMMM YYYY")}
            </strong>
            .
          </p>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Cari transaksi berdasarkan nama pelanggan"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full"
        />

        {/* Filter dan tombol */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Filter Metode Pembayaran */}
          <div className="relative w-56">
            <p className="text-xs text-gray-600 mb-1">
              Filter Metode Pembayaran
            </p>
            <div
              onClick={toggleFilterDropdown}
              className="relative px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm cursor-pointer bg-white select-none"
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
              className={`absolute bg-white shadow-lg mt-1 rounded-md w-full transition-all duration-200 transform origin-top z-10 ${
                isFilterOpen
                  ? "scale-y-100 opacity-100"
                  : "scale-y-0 opacity-0 pointer-events-none"
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
          </div>

          {/* Teks Jumlah di ujung kanan */}
          <span className="ml-auto mt-6 text-sm text-gray-800 whitespace-nowrap">
            Jumlah : <strong>{filteredData.length}</strong> Transaksi
          </span>
        </div>

        {/* Box Cards List */}
        {loading ? (
          <p className="text-center text-gray-500">Memuat data transaksi...</p>
        ) : error ? (
          <p className="text-center text-red-600 font-semibold">{error}</p>
        ) : filteredData.length === 0 ? (
          <p className="text-center text-gray-500">
            Tidak ada transaksi ditemukan.
          </p>
        ) : (
          <div className="max-h-[450px] overflow-y-auto space-y-3">
            {filteredData.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/admin/pesanan/${item.id}`)}
                className="flex justify-between items-start bg-white p-4 rounded shadow hover:bg-gray-50 cursor-pointer"
              >
                {/* Kiri: Informasi pelanggan dan transaksi */}
                <div>
                  <p className="font-bold">{item.pelanggan}</p>
                  <p className="text-sm text-gray-600">
                    Kasir : {item.kasir_nama}
                  </p>
                  <p className="text-sm text-gray-600">
                    Etalase : {item.etalase_nama}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        metodeWarna[item.metode] || "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {item.metode}
                    </span>
                    <span className="text-xs text-gray-600">
                      {dayjs(item.waktu).format("HH:mm")} WIB
                    </span>
                  </div>
                </div>

                {/* Kanan: Total */}
                <div className="text-right text-red-700 text-lg font-bold whitespace-nowrap">
                  Rp {Number(item.total).toLocaleString("id-ID")}
                </div>
              </div>
            ))}

            {filteredData.length === 0 && (
              <p className="text-center text-gray-500 text-sm">
                Tidak ada data transaksi ditemukan.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransaksiDetailPage;
