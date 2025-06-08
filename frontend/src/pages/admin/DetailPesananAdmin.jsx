import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import axios from "axios";

const formatTanggal = (tanggalString) => {
  const tgl = new Date(tanggalString);
  return (
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(tgl) + " WIB"
  );
};

const DetailPesananAdminPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const [pesanan, setPesanan] = useState(null);

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

          {/* Kanan - Preview bukti pembayaran untuk Non-Tunai */}
          {pesanan.metode_pembayaran === "Non-Tunai" &&
            pesanan.bukti_pembayaran && (
              <div className="flex flex-col items-start gap-2">
                <p className="text-sm font-medium">Bukti Pembayaran :</p>
                <img
                  src={`${API_BASE_URL}/upload-bukti/${pesanan.bukti_pembayaran}`}
                  alt="Bukti Transfer"
                  className="rounded-md shadow-md max-w-full max-h-[400px] object-contain"
                />
              </div>
            )}
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-bold text-lg mb-2">Yang Melayani</h2>
          <div className="grid grid-cols-3 gap-y-2 text-sm">
            <div className="font-semibold text-gray-700">Kasir</div>
            <div className="col-span-2">: {pesanan.kasir_nama || "-"}</div>

            <div className="font-semibold text-gray-700">Etalase</div>
            <div className="col-span-2">: {pesanan.etalase_nama || "-"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPesananAdminPage;
