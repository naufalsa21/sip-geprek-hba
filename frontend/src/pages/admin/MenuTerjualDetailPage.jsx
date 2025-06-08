import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const MenuTerjualDetailPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil tanggal dari query param, default ke hari ini kalau tidak ada
  const searchParams = new URLSearchParams(location.search);
  const tanggalTerpilih =
    searchParams.get("tanggal") || dayjs().format("YYYY-MM-DD");

  const [menuTerjual, setMenuTerjual] = useState([]);
  const [kategoriFilter, setKategoriFilter] = useState("Semua");
  const [isKategoriOpen, setIsKategoriOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMenuTerjual();
  }, [tanggalTerpilih]); // refetch setiap tanggal berubah

  const fetchMenuTerjual = async () => {
    try {
      setLoading(true);
      setError(null);

      // Panggil API menu terjual dengan filter tanggal
      const [resTerjual, resMenu] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/dashboard/menu-terjual`, {
          params: { tanggal: tanggalTerpilih }, // Kirim tanggal ke backend
        }),
        axios.get(`${API_BASE_URL}/api/menu`),
      ]);

      // Gabungkan data menu dengan jumlah terjual sesuai tanggal
      const dataGabungan = resMenu.data.map((menu) => {
        const match = resTerjual.data.find((item) => item.nama === menu.nama);
        return {
          ...menu,
          jumlah: match ? match.jumlah_terjual : 0,
        };
      });

      // Urutan prioritas kategori
      const kategoriPrioritas = {
        Paket: 1,
        "Lauk Tambahan": 2,
        Minuman: 3,
      };

      // Urutkan berdasarkan jumlah terjual desc, lalu kategori prioritas
      dataGabungan.sort((a, b) => {
        if (b.jumlah !== a.jumlah) {
          return b.jumlah - a.jumlah; // jumlah terjual desc
        }

        // Jika jumlah sama, urutkan berdasarkan prioritas kategori
        const prioritasA = kategoriPrioritas[a.kategori] || 999;
        const prioritasB = kategoriPrioritas[b.kategori] || 999;
        return prioritasA - prioritasB;
      });

      setMenuTerjual(dataGabungan);
    } catch (err) {
      console.error("Gagal mengambil data menu terjual:", err);
      setError("Gagal mengambil data menu terjual");
    } finally {
      setLoading(false);
    }
  };

  const toggleKategoriDropdown = () => {
    setIsKategoriOpen(!isKategoriOpen);
  };

  const filteredMenu = menuTerjual.filter((menu) => {
    return kategoriFilter === "Semua" || menu.kategori === kategoriFilter;
  });

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

      <div className="p-6 space-y-6">
        {/* Judul & Deskripsi */}
        <div>
          <h2 className="text-2xl font-bold mb-1">Detail Total Menu Terjual</h2>
          <p className="text-gray-600">
            Daftar menu yang terjual pada hari{" "}
            <strong>
              {dayjs(tanggalTerpilih).format("dddd, DD MMMM YYYY")}
            </strong>
            .
          </p>
        </div>

        {/* Filter Kategori */}
        <div className="relative w-60">
          <p className="text-xs text-gray-600 mb-1">Filter Kategori Menu</p>
          <div
            onClick={toggleKategoriDropdown}
            className="relative px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm cursor-pointer bg-white"
          >
            <span>{kategoriFilter}</span>
            <span className="absolute top-1/2 right-3 transform -translate-y-1/2">
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  isKategoriOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </span>
          </div>
          {isKategoriOpen && (
            <div className="absolute z-10 bg-white shadow-lg mt-1 rounded-md w-full">
              <ul className="py-1 text-sm">
                {["Semua", "Paket", "Lauk Tambahan", "Minuman"].map(
                  (kategori) => (
                    <li
                      key={kategori}
                      onClick={() => {
                        setKategoriFilter(kategori);
                        setIsKategoriOpen(false);
                      }}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      {kategori}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Konten Menu Terjual */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : filteredMenu.length === 0 ? (
          <p className="text-center text-gray-500">
            Tidak ada menu terjual untuk tanggal ini
          </p>
        ) : (
          <div className="space-y-3">
            {filteredMenu.map((menu) => (
              <div
                key={menu.id}
                className="bg-white rounded-md shadow-sm px-4 py-3 flex items-center justify-between"
              >
                {/* Kiri: Gambar + Info */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 flex items-center justify-center bg-white overflow-hidden">
                    <img
                      src={menu.gambar}
                      alt={menu.nama}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{menu.nama}</p>
                    <p className="text-sm text-gray-500">{menu.kategori}</p>
                  </div>
                </div>

                {/* Kanan: Jumlah Terjual */}
                <div className="flex flex-col items-end text-right">
                  <p className="text-xs text-gray-500">Jumlah Terjual</p>
                  <p className="text-xl font-bold text-red-700">
                    {menu.jumlah}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuTerjualDetailPage;
