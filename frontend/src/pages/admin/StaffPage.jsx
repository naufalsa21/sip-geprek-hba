import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import MainLayoutKepalaToko from "../../layouts/MainLayoutKepalaToko";

const StaffPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [searchText, setSearchText] = useState("");
  const [jabatanFilter, setJabatanFilter] = useState("semua");
  const [isJabatanOpen, setIsJabatanOpen] = useState(false);
  const [staffList, setStaffList] = useState([]);

  const toggleJabatanDropdown = () => setIsJabatanOpen(!isJabatanOpen);
  const navigate = useNavigate();

  // Ambil data staff dari backend saat halaman dimuat
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/staff`);
        setStaffList(response.data);
      } catch (error) {
        console.error("Gagal memuat data staff:", error);
      }
    };

    fetchStaff();
  }, []);

  // Fungsi handleHapus
  const handleHapus = async (id) => {
    const konfirmasi = window.confirm("Yakin ingin menghapus staff ini?");
    if (!konfirmasi) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/staff/${id}`);
      alert("Staff berhasil dihapus!");
      // Refresh data setelah hapus
      setStaffList((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Gagal menghapus staff:", error);
      alert("Terjadi kesalahan saat menghapus staff");
    }
  };

  const filteredStaff = staffList.filter((staff) => {
    const cocokNama = staff.nama
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const cocokJabatan =
      jabatanFilter === "semua" || staff.jabatan === jabatanFilter;
    return cocokNama && cocokJabatan;
  });

  return (
    <MainLayoutKepalaToko>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Pengelolaan Staff
        </h2>
        <p className="text-gray-600">
          Halaman ini digunakan untuk mengelola seluruh akun staff yang bekerja
          di Ayam Geprek HBA.
        </p>
      </div>

      {/* Kolom pencarian */}
      <input
        type="text"
        placeholder="Cari staff berdasarkan nama"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full"
      />

      {/* Filter dan tombol tambah */}
      <div className="flex flex-wrap gap-4 items-start">
        {/* Filter Jabatan */}
        <div className="relative w-50">
          <p className="text-xs text-gray-600 mb-1">
            Filter Posisi atau Jabatan Staff
          </p>
          <div
            onClick={toggleJabatanDropdown}
            className="relative px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm cursor-pointer"
          >
            <span>{jabatanFilter}</span>
            <span className="absolute top-1/2 right-3 transform -translate-y-1/2">
              <ChevronDownIcon
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  isJabatanOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </span>
          </div>
          <div
            className={`absolute bg-white shadow-lg mt-1 rounded-md w-full transition-all duration-300 transform ${
              isJabatanOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
            }`}
            style={{ transformOrigin: "top" }}
          >
            <ul className="py-1 text-sm">
              {["semua", "kasir", "etalase"].map((jabatan) => (
                <li
                  key={jabatan}
                  onClick={() => {
                    setJabatanFilter(jabatan);
                    setIsJabatanOpen(false);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {jabatan}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tombol Tambah Staff */}
        <button
          onClick={() => navigate("/staff/tambah")}
          className="h-10 px-4 rounded-md bg-red-700 text-white text-sm hover:bg-red-600 ml-auto mt-5"
        >
          + Tambah Staff
        </button>
      </div>

      {/* Informasi */}
      <p className="text-sm text-gray-500">
        Berikut adalah daftar akun staff yang terdaftar dalam sistem :
      </p>

      {/* Daftar Staff */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredStaff.map((staff) => (
          <div
            key={staff.id}
            className="bg-white shadow rounded-md flex p-4 gap-4 items-start"
          >
            <img
              src={`data:image/jpeg;base64,${staff.foto}`}
              alt={staff.nama}
              className="w-24 h-full object-cover object-top rounded-md"
            />

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-gray-800">
                  {staff.nama}
                </h3>
                <p className="text-sm text-gray-600">{staff.jabatan}</p>
                <p className="text-xs text-gray-500 mt-10">
                  Bergabung :{" "}
                  {new Date(staff.tanggal_gabung).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => navigate(`/staff/edit/${staff.id}`)}
                  className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleHapus(staff.id)}
                  className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainLayoutKepalaToko>
  );
};

export default StaffPage;
