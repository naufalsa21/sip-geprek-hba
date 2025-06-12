import React, { useState } from "react";
import Logo from "../../assets/LogoGeprekHBA.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [telepon, setTelepon] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!telepon || !password) {
      alert("No. Telepon dan Kata Sandi wajib diisi!.");
      return;
    }

    //Cek jumlah no telepon
    if (!/^[0-9]{10,15}$/.test(telepon)) {
      alert(
        "Format nomor telepon tidak valid (harus 10-15 digit angka) dan diawali dengan 08...."
      );
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/login`,

        {
          telepon,
          password,
        }
      );

      const { id, role } = response.data;
      localStorage.setItem("userId", id);
      localStorage.setItem("role", role);

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "kasir") {
        navigate("/kasir");
      } else if (role === "etalase") {
        navigate("/etalase");
      } else {
        alert("Role tidak dikenali");
      }
    } catch (error) {
      console.error("Login gagal:", error);
      const msg =
        error.response?.data?.message || "No. Telepon atau Kata Sandi salah";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center mb-6">
        <img src={Logo} alt="Logo" className="mx-auto mb-2 w-28 sm:w-32" />
        <h1 className="text-2xl font-bold text-red-700">Selamat Datang</h1>
        <p className="text-[10px] font-semibold text-gray-700">
          di Sistem Informasi Pemesanan Rumah Makan Ayam Geprek HBA
        </p>
      </div>

      <form className="w-full max-w-sm" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-red-700 font-semibold mb-1 text-[13px]">
            No. Telepon
          </label>
          <input
            type="tel"
            value={telepon}
            onChange={(e) => setTelepon(e.target.value)}
            className="w-full px-4 py-2 rounded-sm shadow-lg"
            placeholder="Masukkan No. Telepon (cth:08...)"
          />
        </div>
        <div className="mb-4">
          <label className="block text-red-700 font-semibold mb-1 text-[13px]">
            Kata Sandi
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-sm shadow-lg"
            placeholder="Masukkan Kata Sandi (cth:geprekhba123)"
          />
        </div>
        <div className="mb-6 text-right">
          <a
            href="#"
            onClick={() =>
              alert(
                "Silakan hubungi Kepala Toko melalui kontak berikut (082294402520) untuk reset kata sandi Anda."
              )
            }
            className="text-[13px] text-red-700 hover:text-blue-500"
          >
            Lupa Kata Sandi?
          </a>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="text-[15px] font-semibold w-[50%] bg-red-700 text-white py-2 rounded-sm"
            disabled={loading}
          >
            {loading ? "Memproses..." : "MASUK"}
          </button>
        </div>
        <div className="flex justify-center mt-10">
          <p className="text-[13px]">
            Belum punya akun?{" "}
            <a
              href="#"
              onClick={() =>
                alert(
                  "Silakan hubungi Kepala Toko melalui kontak berikut (082294402520) untuk membuat akun."
                )
              }
              className="text-red-700 hover:text-blue-500"
            >
              Hubungi Kepala Toko Geprek HBA
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
