import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { ChevronDownIcon, PhotoIcon } from "@heroicons/react/24/solid";
import axios from "axios";

const TambahMenuPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [kategori, setKategori] = useState("Paket");
  const [deskripsi, setDeskripsi] = useState("");
  const [gambar, setGambar] = useState(null);
  const [isKategoriOpen, setIsKategoriOpen] = useState(false);

  const toggleKategoriDropdown = () => setIsKategoriOpen(!isKategoriOpen);

  const [gambarPreview, setGambarPreview] = useState(null);

  const handleGambarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambar(file);
      setGambarPreview(URL.createObjectURL(file));
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSimpan = async () => {
    if (isLoading) return;

    if (!nama || !harga || !kategori || !gambar) {
      alert("Semua kolom wajib diisi");
      return;
    }

    if (Number(harga) <= 0) {
      alert("Harga harus lebih dari 0");
      return;
    }

    setIsLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const gambarBase64 = reader.result.split(",")[1];
      try {
        await axios.post(`${API_BASE_URL}/api/menu`, {
          nama,
          harga,
          kategori,
          deskripsi: kategori === "Paket" ? deskripsi : "",
          gambar: gambarBase64,
        });

        alert("Menu berhasil ditambahkan!");
        navigate("/admin/menu");
      } catch (err) {
        console.error("Gagal tambah menu:", err);
        alert("Gagal menambahkan menu");
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsDataURL(gambar);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
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

      <div className="p-4">
        <div className="bg-white rounded shadow p-6 space-y-4 w-full">
          {/* Nama Menu */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Nama Menu
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama menu"
              className="w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          {/* Dropdown Kategori */}
          <div className="relative w-full">
            <label className="block text-sm font-semibold mb-1">
              Kategori Menu
            </label>
            <div
              onClick={toggleKategoriDropdown}
              className="relative px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm cursor-pointer bg-white"
            >
              <span>{kategori}</span>
              <span className="absolute top-1/2 right-3 transform -translate-y-1/2">
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                    isKategoriOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </span>
            </div>
            <div
              className={`absolute bg-white shadow-lg mt-1 rounded-md w-full transition-all duration-200 transform z-10 ${
                isKategoriOpen
                  ? "scale-y-100 opacity-100"
                  : "scale-y-0 opacity-0 pointer-events-none"
              }`}
              style={{ transformOrigin: "top" }}
            >
              <ul className="py-1 text-sm">
                {["Paket", "Lauk Tambahan", "Minuman"].map((item) => (
                  <li
                    key={item}
                    onClick={() => {
                      setKategori(item);
                      setIsKategoriOpen(false);
                    }}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Deskripsi jika kategori Paket */}
          {kategori === "Paket" && (
            <div>
              <label className="block text-sm font-semibold mb-1">
                Deskripsi Paket
              </label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Contoh: Ayam, Nasi, Sambal"
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
            </div>
          )}

          {/* Harga */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Harga Menu (Rp.)
            </label>
            <input
              type="number"
              min="1"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              placeholder="Masukkan harga tanpa titik atau desimal (cth: 1000, 2000, 15000...)"
              className="w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          {/* Upload Gambar */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Foto Menu
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer bg-gray-50">
              <PhotoIcon className="w-10 h-10 text-gray-400" />
              <p className="text-sm text-gray-600">
                Klik untuk upload foto menu
              </p>
              <input
                type="file"
                onChange={handleGambarChange}
                className="hidden"
              />
              {gambarPreview && (
                <img
                  src={gambarPreview}
                  alt="Preview"
                  className="mt-4 w-40 h-40 object-contain rounded border"
                />
              )}
            </label>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Batal
            </button>
            <button
              onClick={handleSimpan}
              className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TambahMenuPage;
