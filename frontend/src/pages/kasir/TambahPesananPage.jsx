import React, { useState, useMemo, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TambahPesananPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [kategori, setKategori] = useState("Paket");
  const [tipePesanan, setTipePesanan] = useState("Makan di Tempat");
  const [metodePembayaran, setMetodePembayaran] = useState("Tunai"); // Added
  const [nomorMeja, setNomorMeja] = useState("");
  const [catatan, setCatatan] = useState("");
  const [pesanan, setPesanan] = useState({});
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [menuList, setMenuList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/menu`);
        setMenuList(
          res.data.map((item) => ({
            ...item,
            stok: item.status === "Aktif",
          }))
        );
      } catch (err) {
        console.error("Gagal mengambil menu:", err);
      }
    };
    fetchMenu();
  }, []);

  const tambahItem = (item) => {
    if (!item.stok) return;
    const exist = pesanan[item.id] || { ...item, jumlah: 0 };
    setPesanan({
      ...pesanan,
      [item.id]: { ...exist, jumlah: exist.jumlah + 1 },
    });
  };

  const kurangItem = (item) => {
    const exist = pesanan[item.id];
    if (exist && exist.jumlah > 0) {
      setPesanan({
        ...pesanan,
        [item.id]: { ...exist, jumlah: exist.jumlah - 1 },
      });
    }
  };

  const daftarMenu = menuList.filter((item) => item.kategori === kategori);

  const totalHarga = useMemo(() => {
    return Object.values(pesanan).reduce(
      (total, item) => total + item.harga * item.jumlah,
      0
    );
  }, [pesanan]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleKirimPesanan = async () => {
    if (isSubmitting) return;

    if (!namaPelanggan.trim()) {
      alert("Nama pelanggan wajib diisi.");
      return;
    }

    if (tipePesanan === "Makan di Tempat" && !nomorMeja.trim()) {
      alert("Nomor meja wajib diisi untuk pesanan makan di tempat.");
      return;
    }

    const items = Object.values(pesanan)
      .filter((item) => item.jumlah > 0)
      .map((item) => ({
        menu_id: item.id,
        jumlah: item.jumlah,
        harga: item.harga,
      }));

    if (items.length === 0) {
      alert("Pesanan tidak boleh kosong. Tambahkan minimal satu menu.");
      return;
    }

    const kasirId = localStorage.getItem("userId");

    try {
      setIsSubmitting(true);

      await axios.post(`${API_BASE_URL}/api/pesanan`, {
        nama_pelanggan: namaPelanggan,
        tipe_pesanan: tipePesanan,
        nomor_meja: tipePesanan === "Makan di Tempat" ? nomorMeja : null,
        catatan,
        total: totalHarga,
        metode_pembayaran: metodePembayaran,
        items,
        kasir_id: kasirId,
      });

      alert("Pesanan berhasil dikirim.");
      navigate("/kasir");
    } catch (err) {
      console.error("Gagal mengirim pesanan:", err);
      alert("Terjadi kesalahan saat menyimpan pesanan.");
    } finally {
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
        <h1 className="text-xl font-bold text-red-700">Tambah Pesanan</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Bagian Nama Pelanggan */}
        <div className="bg-white rounded shadow p-4 space-y-2">
          <label className="block font-semibold mb-1">Nama Pelanggan :</label>
          <input
            type="text"
            value={namaPelanggan}
            onChange={(e) => setNamaPelanggan(e.target.value)}
            placeholder="Masukkan nama pelanggan"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Kategori & Box Menu */}
        <div className="flex gap-2 mb-4">
          {["Paket", "Lauk Tambahan", "Minuman"].map((k) => (
            <button
              key={k}
              className={`px-4 py-2 rounded ${
                kategori === k
                  ? "bg-red-700 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
              onClick={() => setKategori(k)}
            >
              {k}
            </button>
          ))}
        </div>

        <div className="bg-white shadow rounded-md p-4 h-[300px] flex flex-col">
          <div className="overflow-y-auto space-y-3 flex-grow pr-1">
            {menuList.length === 0 ? (
              <p className="text-sm text-gray-500">Memuat Menu...</p>
            ) : (
              daftarMenu.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded border border-gray-300 shadow-sm p-3 ${
                    kategori === "Paket" ? "min-h-[150px]" : "min-h-[70px]"
                  }`}
                >
                  <div className="flex justify-between items-stretch">
                    <div
                      className={`flex gap-3 ${
                        kategori === "Paket" ? "items-start" : "items-center"
                      }`}
                    >
                      <img
                        src={item.gambar}
                        alt={item.nama}
                        className={`rounded ${
                          kategori === "Paket"
                            ? "w-40 h-full object-contain"
                            : "w-14 h-14 object-cover"
                        }`}
                      />
                      <div className="text-sm">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{item.nama}</h3>
                          {!item.stok && (
                            <span className="text-xs text-red-700">
                              (Menu tidak tersedia)
                            </span>
                          )}
                        </div>
                        {item.deskripsi && kategori === "Paket" && (
                          <p className="text-gray-600 whitespace-pre-line">
                            {item.deskripsi}
                          </p>
                        )}
                      </div>
                    </div>

                    {kategori === "Paket" ? (
                      <div className="flex flex-col items-end justify-start gap-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold whitespace-nowrap">
                            Rp. {item.harga.toLocaleString("id-ID")}
                          </p>
                          <button
                            onClick={() => kurangItem(item)}
                            className="px-3 py-1 text-lg bg-red-600 text-white rounded"
                          >
                            -
                          </button>
                          <button
                            onClick={() => tambahItem(item)}
                            disabled={!item.stok}
                            className={`px-3 py-1 text-lg text-white rounded ${
                              item.stok
                                ? "bg-green-600"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold whitespace-nowrap">
                          Rp. {item.harga.toLocaleString("id-ID")}
                        </p>
                        <button
                          onClick={() => kurangItem(item)}
                          className="px-3 py-1 text-lg bg-red-600 text-white rounded"
                        >
                          -
                        </button>
                        <button
                          onClick={() => tambahItem(item)}
                          className={`px-3 py-1 text-lg text-white rounded ${
                            item.stok
                              ? "bg-green-600"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Catatan */}
          <div className="mt-2 pt-2">
            <input
              type="text"
              placeholder="Catatan (misal: tanpa sambal, dll)"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full"
            />
          </div>
        </div>

        {/* Ringkasan Pesanan */}
        <div className="bg-white rounded shadow p-3 space-y-3">
          <h2 className="text-lg font-semibold">Ringkasan Pesanan :</h2>
          {Object.values(pesanan).filter((item) => item.jumlah > 0).length ===
          0 ? (
            <p className="text-sm italic text-gray-600">Belum ada pesanan.</p>
          ) : (
            <div className="space-y-2">
              {Object.values(pesanan)
                .filter((item) => item.jumlah > 0)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b border-gray-200 pb-1"
                  >
                    <div>
                      <p className="font-semibold">{item.nama}</p>
                      <p className="text-sm text-gray-600">
                        Jumlah : {item.jumlah}
                      </p>
                    </div>
                    <p className="font-semibold">
                      Rp. {(item.harga * item.jumlah).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
            </div>
          )}

          <p className="font-bold text-red-700 text-right text-lg">
            Total : Rp. {totalHarga.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Pilih Tipe Pesanan */}
        <div className="bg-white rounded shadow p-3 space-y-3">
          <h2 className="font-semibold">Pilih Tipe Pesanan :</h2>
          <div className="flex gap-2">
            {["Makan di Tempat", "Bawa Pulang"].map((tipe) => (
              <button
                key={tipe}
                className={`px-4 py-2 rounded ${
                  tipePesanan === tipe
                    ? "bg-red-700 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
                onClick={() => setTipePesanan(tipe)}
              >
                {tipe}
              </button>
            ))}
          </div>

          {/* Jika Makan di Tempat, input nomor meja */}
          {tipePesanan === "Makan di Tempat" && (
            <div>
              <label className="block font-semibold mt-2 mb-1">
                Nomor Meja :
              </label>
              <input
                type="text"
                value={nomorMeja}
                onChange={(e) => setNomorMeja(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm w-full"
                placeholder="Masukkan nomor meja"
              />
            </div>
          )}
        </div>

        {/* Pilih Metode Pembayaran - Added */}
        <div className="bg-white rounded shadow p-3 space-y-3">
          <h2 className="font-semibold">Pilih Metode Pembayaran :</h2>
          <div className="flex gap-2">
            {["Tunai", "Non-Tunai"].map((metode) => (
              <button
                key={metode}
                className={`px-4 py-2 rounded ${
                  metodePembayaran === metode
                    ? "bg-red-700 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
                onClick={() => setMetodePembayaran(metode)}
              >
                {metode}
              </button>
            ))}
          </div>
        </div>

        {/* Tombol Kirim / Batal */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-red-700 text-white py-3 rounded hover:bg-red-600"
          >
            Batal
          </button>
          <button
            onClick={handleKirimPesanan}
            disabled={isSubmitting}
            className={`flex-1 bg-green-600 text-white py-3 rounded hover:bg-green-700 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Mengirim Pesanan..." : " Kirim Pesanan ke Etalase"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TambahPesananPage;
