import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { ChevronDownIcon, PhotoIcon } from "@heroicons/react/24/solid";
import axios from "axios";

const EditStaffPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const [nama, setNama] = useState("");
  const [role, setRole] = useState("");
  const [telepon, setTelepon] = useState("");
  const [password, setPassword] = useState("");
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/staff/${id}`);
        const data = res.data;
        setNama(data.nama);
        setRole(data.role);
        setTelepon(data.telepon);
        if (data.foto) {
          const base64Image = `data:image/jpeg;base64,${data.foto}`;
          setFotoPreview(base64Image);
          setFoto(base64Image);
        }
      } catch (err) {
        console.error("Gagal memuat data staff:", err);
        alert("Gagal memuat data staff");
        navigate("/admin/staff");
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleGambarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result);
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (!nama || !telepon || !role || !foto) {
      alert(
        "Semua field wajib diisi, kecuali password jika tidak ingin mengubah"
      );
      return;
    }

    const updatePayload = {
      nama,
      telepon,
      role,
      foto: foto.replace(/^data:image\/\w+;base64,/, ""),
    };

    if (password) {
      updatePayload.password = password;
    }

    try {
      await axios.put(`${API_BASE_URL}/api/staff/${id}`, updatePayload);
      alert("Data staff berhasil diperbarui");
      navigate("/admin/staff");
    } catch (err) {
      console.error("Gagal update staff:", err);
      alert("Gagal update staff");
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
        <h1 className="text-xl font-bold text-red-700">Edit Akun Staff</h1>
      </div>
      <div className="p-4">
        <div className="bg-white rounded shadow p-6 space-y-4 w-full">
          {/* Nama */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Nama Staff
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
              placeholder="Nama lengkap"
            />
          </div>

          {/* Jabatan */}
          <div className="relative">
            <label className="block text-sm font-semibold mb-1">Jabatan</label>
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
                {["kasir", "etalase"].map((item) => (
                  <li
                    key={item}
                    onClick={() => {
                      setRole(item);
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

          {/* Telepon */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Nomor Telepon
            </label>
            <input
              type="tel"
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
              placeholder="Biarkan kosong jika tidak ingin mengubah"
            />
          </div>

          {/* Foto */}
          <div>
            <label className="block text-sm font-semibold mb-1">Foto</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer bg-gray-50">
              <PhotoIcon className="w-10 h-10 text-gray-400" />
              <p className="text-sm text-gray-600">
                Klik untuk upload ulang foto
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

          {/* Tombol */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => navigate(-1)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Batal
            </button>
            <button
              onClick={handleUpdate}
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

export default EditStaffPage;
