import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import MainLayoutKepalaToko from "../../layouts/MainLayoutKepalaToko";
import MenuCard from "../../components/MenuCard";
import {
  getAllMenu,
  deleteMenu,
  updateMenuStatus,
} from "../../services/menuService";

const MenuPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [kategoriFilter, setKategoriFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [searchText, setSearchText] = useState("");
  const [isKategoriOpen, setIsKategoriOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getAllMenu();
        setMenuList(data);
      } catch (error) {
        console.error("Gagal mengambil menu:", error);
      }
    };

    fetchMenu();
  }, []);

  // Filter menu
  const filteredMenu = menuList.filter((menu) => {
    const cocokKategori =
      kategoriFilter === "Semua" || menu.kategori === kategoriFilter;
    const cocokStatus =
      statusFilter === "Semua" || menu.status === statusFilter;
    const cocokSearch = menu.nama
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return cocokKategori && cocokStatus && cocokSearch;
  });

  const toggleKategoriDropdown = () => setIsKategoriOpen(!isKategoriOpen);
  const toggleStatusDropdown = () => setIsStatusOpen(!isStatusOpen);

  const handleEdit = (id) => {
    navigate(`/menu/edit/${id}`);
  };

  const handleHapus = async (id) => {
    if (window.confirm("Yakin ingin menghapus menu ini?")) {
      try {
        await deleteMenu(id);
        setMenuList(menuList.filter((menu) => menu.id !== id));
      } catch (err) {
        alert("Gagal menghapus menu");
      }
    }
  };

  // Toggle status menu
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Aktif" ? "Nonaktif" : "Aktif";
    try {
      await updateMenuStatus(id, newStatus);
      const updatedList = menuList.map((menu) =>
        menu.id === id ? { ...menu, status: newStatus } : menu
      );
      setMenuList(updatedList);
    } catch (err) {
      alert("Gagal mengubah status menu");
    }
  };

  return (
    <MainLayoutKepalaToko>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Pengelolaan Menu
        </h2>
        <p className="text-gray-600">
          Halaman ini digunakan untuk mengelola menu makanan dan minuman.
        </p>
      </div>

      {/* Kolom pencarian */}
      <input
        type="text"
        placeholder="Cari menu berdasarkan nama"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full"
      />

      {/* Filter dan tombol tambah */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Filter Kategori */}
        <div className="relative w-50">
          <p className="text-xs text-gray-600 mb-1">Filter Kategori Menu</p>
          {/* Setel lebar tetap di sini */}
          <div
            onClick={toggleKategoriDropdown}
            className="relative px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm cursor-pointer"
          >
            <span>{kategoriFilter}</span>
            <span className="absolute top-1/2 right-3 transform -translate-y-1/2">
              <ChevronDownIcon
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  isKategoriOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </span>
          </div>
          {/* Dropdown Menu Kategori */}
          <div
            className={`absolute bg-white shadow-lg mt-1 rounded-md w-full transition-all duration-300 transform ${
              isKategoriOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
            }`}
            style={{ transformOrigin: "top" }}
          >
            <ul className="py-1 text-sm">
              <li
                onClick={() => {
                  setKategoriFilter("Semua");
                  setIsKategoriOpen(false);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Semua
              </li>
              <li
                onClick={() => {
                  setKategoriFilter("Paket");
                  setIsKategoriOpen(false);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Paket
              </li>
              <li
                onClick={() => {
                  setKategoriFilter("Lauk Tambahan");
                  setIsKategoriOpen(false);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Lauk Tambahan
              </li>
              <li
                onClick={() => {
                  setKategoriFilter("Minuman");
                  setIsKategoriOpen(false);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Minuman
              </li>
            </ul>
          </div>
        </div>

        {/* Filter Status */}
        <div className="relative w-50">
          <p className="text-xs text-gray-600 mb-1">Filter Status Menu</p>
          {/* Setel lebar tetap di sini */}
          <div
            onClick={toggleStatusDropdown}
            className="relative px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm cursor-pointer"
          >
            <span>{statusFilter}</span>
            <span className="absolute top-1/2 right-3 transform -translate-y-1/2">
              <ChevronDownIcon
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  isStatusOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </span>
          </div>
          {/* Dropdown Menu Status */}
          <div
            className={`absolute bg-white shadow-lg mt-1 rounded-md w-full transition-all duration-300 transform ${
              isStatusOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
            }`}
            style={{ transformOrigin: "top" }}
          >
            <ul className="py-1 text-sm">
              <li
                onClick={() => {
                  setStatusFilter("Semua");
                  setIsStatusOpen(false);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Semua
              </li>
              <li
                onClick={() => {
                  setStatusFilter("Aktif");
                  setIsStatusOpen(false);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Aktif
              </li>
              <li
                onClick={() => {
                  setStatusFilter("Nonaktif");
                  setIsStatusOpen(false);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Nonaktif
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={() => navigate("/menu/tambah")}
          className="h-10 px-4 rounded-md bg-red-700 text-white text-sm hover:bg-red-600 ml-auto mt-5"
        >
          + Tambah Menu
        </button>
      </div>

      {/* Daftar Menu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMenu.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            onEdit={() => handleEdit(item.id)}
            onDelete={() => handleHapus(item.id)}
            onToggleStatus={() => handleToggleStatus(item.id, item.status)}
          />
        ))}
      </div>
    </MainLayoutKepalaToko>
  );
};

export default MenuPage;
