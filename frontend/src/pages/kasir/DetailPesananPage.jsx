import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import axios from "axios";

const formatTanggal = (tanggalString) => {
  const tgl = new Date(tanggalString);
  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return formatter.format(tgl) + " WIB";
};

const DetailPesananPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const [pesanan, setPesanan] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [gambarPreview, setGambarPreview] = useState(null);

  useEffect(() => {
    const fetchPesanan = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/pesanan/${id}`);
        setPesanan(res.data);
      } catch (err) {
        console.error("Gagal mengambil data pesanan:", err);
      }
    };
    fetchPesanan();
  }, [id]);

  const handleBatal = async () => {
    if (!window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?"))
      return;
    try {
      await axios.patch(`${API_BASE_URL}/api/pesanan/${id}/batalkan`);
      alert("Pesanan berhasil dibatalkan.");
      navigate(-1);
    } catch (err) {
      console.error("Gagal membatalkan pesanan:", err);
      alert("Terjadi kesalahan.");
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("bukti", file);
    setGambarPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      await axios.patch(
        `${API_BASE_URL}/api/pesanan/${id}/upload-bukti`,
        formData
      );
      alert("Bukti pembayaran berhasil diunggah.");
      window.location.reload();
    } catch (err) {
      console.error("Upload gagal:", err);
      alert("Upload gagal.");
    }
    setUploading(false);
  };

  if (!pesanan) return <div className="p-6">Memuat detail pesanan...</div>;

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
        <h1 className="text-xl font-bold text-red-700">Detail Pesanan</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Informasi Pesanan */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-bold text-lg mb-2">Informasi Pesanan</h2>
          <div className="grid grid-cols-3 gap-y-2 text-sm">
            <div className="font-semibold text-gray-700">Nama Pelanggan</div>
            <div className="col-span-2">: {pesanan.nama_pelanggan}</div>

            <div className="font-semibold text-gray-700">Tanggal & Waktu</div>
            <div className="col-span-2">
              : {formatTanggal(pesanan.waktu_pesan)}
            </div>

            <div className="font-semibold text-gray-700">Tipe Pesanan</div>
            <div className="col-span-2">: {pesanan.tipe_pesanan}</div>

            {pesanan.nomor_meja && (
              <>
                <div className="font-semibold text-gray-700">Nomor Meja</div>
                <div className="col-span-2">: {pesanan.nomor_meja}</div>
              </>
            )}
          </div>
        </div>

        {/* Daftar Item Pesanan */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-bold text-lg mb-3">Daftar Item Pesanan</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="font-semibold text-left">
                <th className="py-1">Nama Menu</th>
                <th className="py-1 text-center">Jumlah</th>
                <th className="py-1 text-center">Harga Per Item</th>
                <th className="py-1 text-left">Total Harga</th>
              </tr>
            </thead>
            <tbody>
              {pesanan.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-1">{item.nama}</td>
                  <td className="py-1 text-center">{item.jumlah}</td>
                  <td className="py-1 text-center">
                    Rp {item.harga_satuan.toLocaleString("id-ID")}
                  </td>
                  <td className="py-1 text-left">
                    Rp{" "}
                    {(item.harga_satuan * item.jumlah).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2"></td>
                <td className="text-right font-bold pt-5 pr-4">
                  Total Pembayaran
                </td>
                <td className="pt-5 font-bold text-left">
                  Rp {pesanan.total.toLocaleString("id-ID")}
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="mt-4 text-sm">
            <span className="font-semibold">Catatan :</span>{" "}
            {pesanan.catatan?.trim() ? pesanan.catatan : "Tidak ada catatan"}
          </div>
        </div>

        {/* Status Pesanan */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-bold text-lg mb-2">Status Pesanan</h2>
          <p className="text-sm">Status : {pesanan.status}</p>
          <button
            onClick={handleBatal}
            disabled={pesanan.status !== "Belum Diproses"}
            className={`mt-3 px-4 py-2 rounded text-white font-semibold ${
              pesanan.status === "Belum Diproses"
                ? "bg-red-700 hover:bg-red-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Batalkan Pesanan
          </button>
        </div>

        {/* Pembayaran */}
        <div className="bg-white rounded shadow p-4 flex flex-row flex-wrap justify-between gap-4 items-start">
          {/* Kiri - Info pembayaran */}
          <div className="flex-1">
            <h2 className="font-bold text-lg mb-2">Pembayaran</h2>
            <p className="text-sm">
              <span className="font-semibold">Metode Pembayaran :</span>{" "}
              {pesanan.metode_pembayaran}
            </p>
          </div>

          {/* Kanan - Upload bukti jika Non-Tunai */}
          {pesanan.metode_pembayaran === "Non-Tunai" && (
            <div className="flex flex-col items-start gap-2">
              <p className="text-sm font-medium">Bukti Pembayaran :</p>
              <label className="relative cursor-pointer group">
                {/* Preview gambar */}
                {pesanan.bukti_pembayaran || gambarPreview ? (
                  <img
                    src={
                      gambarPreview
                        ? gambarPreview
                        : `${API_BASE_URL}/upload-bukti/${pesanan.bukti_pembayaran}`
                    }
                    alt="Bukti Transfer"
                    className="rounded-md shadow-md max-w-full max-h-[400px] object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 bg-gray-50">
                    <PhotoIcon className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-600 mt-1">
                      Klik untuk upload bukti pembayaran
                    </p>
                  </div>
                )}

                {/* Input file tersembunyi tapi tetap bisa diklik */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPesananPage;
