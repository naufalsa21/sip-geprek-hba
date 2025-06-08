import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { ChevronDownIcon, PhotoIcon } from "@heroicons/react/24/solid";
import axios from "axios";

const TambahStaffPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [role, setJabatan] = useState("Kasir");
  const [telepon, setTelepon] = useState("");
  const [password, setPassword] = useState("");
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleGambarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSimpan = async () => {
    if (isSubmitting) return;

    if (!nama || !role || !telepon || !password || !foto) {
      alert("Harap isi semua field dan unggah foto");
      return;
    }

    setIsSubmitting(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result.split(",")[1];

        try {
          await axios.post(`${API_BASE_URL}/api/tambah-user`, {
            nama,
            role,
            telepon,
            password,
            foto: base64Data,
          });

          alert("Staff berhasil ditambahkan!");
          navigate("/admin/staff");
        } catch (err) {
          console.error("Gagal menambah staff:", err);
          alert("Gagal menambah staff");
        } finally {
          setIsSubmitting(false);
        }
      };

      reader.readAsDataURL(foto);
    } catch (err) {
      console.error("Gagal memproses gambar:", err);
      alert("Terjadi kesalahan saat membaca gambar");
      setIsSubmitting(false);
    }
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
        <h1 className="text-xl font-bold text-red-700">Tambah Akun Staff</h1>
      </div>

      <div className="p-4">
        <div className="bg-white rounded shadow p-6 space-y-4 w-full">
          {/* Nama */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Nama Staff Karyawan
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama lengkap staff karyawan"
              className="w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          {/* Dropdown Jabatan */}
          <div className="relative">
            <label className="block text-sm font-semibold mb-1">
              Posisi atau Jabatan
            </label>
            <div
              onClick={toggleDropdown}
              className="relative px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm cursor-pointer bg-white"
            >
              <span>{role}</span>
              <span className="absolute top-1/2 right-3 transform -translate-y-1/2">
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </span>
            </div>
            <div
              className={`absolute bg-white shadow-lg mt-1 rounded-md w-full transition-all duration-200 transform z-10 ${
                isDropdownOpen
                  ? "scale-y-100 opacity-100"
                  : "scale-y-0 opacity-0 pointer-events-none"
              }`}
              style={{ transformOrigin: "top" }}
            >
              <ul className="py-1 text-sm">
                {["Kasir", "Etalase"].map((item) => (
                  <li
                    key={item}
                    onClick={() => {
                      setJabatan(item);
                      setIsDropdownOpen(false);
                    }}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Nomor Telepon */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Nomor Telepon
            </label>
            <input
              type="tel"
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
              placeholder="Masukkan nomor telepon staff"
              className="w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          {/* Kata Sandi */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi"
              className="w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          {/* Upload Gambar */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Foto Staff Karyawan
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer bg-gray-50">
              <PhotoIcon className="w-10 h-10 text-gray-400" />
              <p className="text-sm text-gray-600">
                Klik untuk upload foto staff
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleGambarChange}
                className="hidden"
              />
              {fotoPreview && (
                <img
                  src={fotoPreview}
                  alt="Preview"
                  className="mt-4 w-32 h-32 object-cover rounded border"
                />
              )}
            </label>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => navigate(-1)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Batal
            </button>
            <button
              onClick={handleSimpan}
              disabled={isSubmitting}
              className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TambahStaffPage;
