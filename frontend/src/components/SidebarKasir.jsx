import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, List, LogOut } from "lucide-react";

const SidebarKasir = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <aside className="w-20 min-h-screen bg-[#1f2937] text-white flex flex-col items-center py-6 fixed top-0 left-0 z-20">
      <div className="mb-8" />

      <nav className="flex flex-col items-center gap-6 w-full">
        <MenuItem
          icon={<Home size={24} />}
          label="Dashboard"
          onClick={() => navigate("/kasir")}
          active={currentPath === "/kasir"}
        />
        <MenuItem
          icon={<List size={24} />}
          label="Pesanan"
          onClick={() => navigate("/kasir/pesanan")}
          active={currentPath === "/kasir/pesanan"}
        />
      </nav>

      <div className="mt-auto mb-4 w-full text-red-500">
        <MenuItem
          icon={<LogOut size={24} />}
          label="Keluar"
          onClick={handleLogout}
        />
      </div>
    </aside>
  );
};

const MenuItem = ({ icon, label, onClick, active }) => (
  <div className="relative w-full flex flex-col items-center group">
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full py-3 transition-colors duration-200 ${
        active ? "text-yellow-300 font-semibold" : "hover:text-yellow-300"
      }`}
    >
      {icon}
      <span className="text-[10px] mt-1">{label}</span>
    </button>
    <div
      className={`absolute right-0 top-0 h-full w-1 ${
        active
          ? "bg-red-600 scale-y-100"
          : "bg-red-600 scale-y-0 group-hover:scale-y-100"
      } transition-transform origin-top duration-200`}
    ></div>
  </div>
);

export default SidebarKasir;
