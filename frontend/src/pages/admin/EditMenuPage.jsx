import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { ChevronDownIcon, PhotoIcon } from "@heroicons/react/24/solid";
import axios from "axios";

const EditMenuPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [kategori, setKategori] = useState("Paket");
  const [deskripsi, setDeskripsi] = useState("");
  const [gambar, setGambar] = useState(null);
  const [gambarPreview, setGambarPreview] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/menu/${id}`);
        const data = res.data;
        setNama(data.nama);
        setHarga(data.harga);
        setKategori(data.kategori);
        setDeskripsi(data.deskripsi || "");

        if (data.gambar) {
          const base64Image = `data:image/jpeg;base64,${data.gambar}`;
          setGambarPreview(data.gambar);
          setGambar(data.gambar.split(",")[1]);
        } else {
          setGambar(null);
          setGambarPreview(null);
        }
      } catch (err) {
        console.error("Gagal memuat data menu:", err);
        alert("Gagal memuat data menu");
      }
    };

    fetchMenu();
  }, [id]);

  const handleGambarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGambar(reader.result.split(",")[1]);
        setGambarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimpan = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/menu/${id}`, {
        nama,
        harga,
        kategori,
        deskripsi,
        gambar,
      });
      alert("Menu berhasil diperbarui");
      navigate("/admin/menu");
    } catch (err) {
      console.error("Gagal update menu:", err);
      alert("Gagal update menu");
    }
  };

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
        <h1 className="text-xl font-bold text-red-700">Edit Menu</h1>
      </div>

      <div className="p-4">
        <div className="bg-white rounded shadow p-6 space-y-4 w-full">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Nama Menu
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold mb-1">Kategori</label>
            <div
              onClick={toggleDropdown}
              className="relative px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm cursor-pointer bg-white"
            >
              <span>{kategori}</span>
              <span className="absolute top-1/2 right-3 transform -translate-y-1/2">
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </span>
            </div>
            {isDropdownOpen && (
              <ul className="absolute bg-white border mt-1 w-full rounded shadow z-10">
                {["Paket", "Lauk Tambahan", "Minuman"].map((item) => (
                  <li
                    key={item}
                    onClick={() => {
                      setKategori(item);
                      setIsDropdownOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {kategori === "Paket" && (
            <div>
              <label className="block text-sm font-semibold mb-1">
                Deskripsi Paket
              </label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-1">
              Harga Menu (Rp.)
            </label>
            <input
              type="number"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

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

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => navigate(-1)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Batal
            </button>
            <button
              onClick={handleSimpan}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMenuPage;
