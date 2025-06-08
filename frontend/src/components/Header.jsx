import React, { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../assets/LogoGeprekHBA.png";

const Header = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [user, setUser] = useState({ nama: "", role: "", foto: null });

  const roleMap = {
    admin: "Kepala Toko",
    kasir: "Kasir",
    etalase: "Etalase",
  };

  useEffect(() => {
    const fetchUser = async () => {
      const id = localStorage.getItem("userId");
      if (id) {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/user/${id}`);
          setUser(res.data);
        } catch (err) {
          console.error("Gagal memuat data user:", err);
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="fixed top-0 left-20 right-0 h-16 bg-white shadow z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <img src={Logo} alt="Logo" className="w-10 h-10" />
        <h1 className="text-lg font-bold text-red-700 whitespace-nowrap">
          Ayam Geprek HBA
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold">{user.nama}</p>
          <p className="text-xs text-gray-600">
            {roleMap[user.role] || user.role}
          </p>
        </div>
        <img
          src={
            user.foto
              ? `data:image/jpeg;base64,${user.foto}`
              : "/default-foto.jpg"
          }
          alt="Profil"
          className="w-10 h-10 rounded-full object-cover border-2 border-red-700"
        />
      </div>
    </header>
  );
};

export default Header;
