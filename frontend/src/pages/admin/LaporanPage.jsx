import React, { useEffect, useState } from "react";
import MainLayoutKepalaToko from "../../layouts/MainLayoutKepalaToko";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const LaporanPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  const [selectedPeriode, setSelectedPeriode] = useState("Harian");
  const [isPeriodeOpen, setIsPeriodeOpen] = useState(false);
  const [isMetodeOpen, setIsMetodeOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [periode, setPeriode] = useState("Harian");

  const [tanggalHarian, setTanggalHarian] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [mingguAwal, setMingguAwal] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [metode, setMetode] = useState("Semua");

  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  // Data transaksi dari backend
  const [transaksiData, setTransaksiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data transaksi dengan status 'Selesai' dari backend saat komponen mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/pesanan-selesai`);
        setTransaksiData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Gagal mengambil data dari server");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fungsi filter transaksi berdasarkan periode yang dipilih
  const filterByPeriode = (transaksi) => {
    const waktu = dayjs(transaksi.waktu_pesan);

    if (periode === "Harian" && tanggalHarian) {
      const tanggalTransaksi = waktu.format("YYYY-MM-DD");
      return tanggalTransaksi === tanggalHarian;
    }

    if (periode === "Mingguan" && mingguAwal) {
      const start = dayjs(mingguAwal);
      const end = start.add(6, "day");
      return (
        waktu.isSameOrAfter(start, "day") && waktu.isSameOrBefore(end, "day")
      );
    }

    if (periode === "Bulanan" && selectedMonth && selectedYear) {
      return (
        waktu.month() + 1 === Number(selectedMonth) &&
        waktu.year() === Number(selectedYear)
      );
    }

    if (periode === "Custom" && customStart && customEnd) {
      const start = dayjs(customStart);
      const end = dayjs(customEnd);
      return (
        waktu.isSameOrAfter(start, "day") && waktu.isSameOrBefore(end, "day")
      );
    }

    return true;
  };

  // Fungsi toggle dropdown periode dan metode pembayaran
  const togglePeriodeDropdown = () => setIsPeriodeOpen(!isPeriodeOpen);
  const toggleMetodeDropdown = () => setIsMetodeOpen(!isMetodeOpen);

  // Pilih opsi periode filter dan tampilkan popup input
  const handlePeriodeSelection = (option) => {
    setSelectedPeriode(option);
    setPopupType(option);
    setShowPopup(true);
    setIsPeriodeOpen(false);
  };

  // Terapkan filter periode dari popup
  const applyPeriodeFilter = () => {
    setPeriode(selectedPeriode);
    setShowPopup(false);
  };

  // Filter data berdasarkan periode dan metode pembayaran
  const filteredData = transaksiData
    .filter(filterByPeriode)
    .filter((item) => metode === "Semua" || item.metode_pembayaran === metode);

  // Hitung statistik dari data filter
  const totalTransaksi = filteredData.length;
  const totalPendapatan = filteredData.reduce(
    (sum, item) => sum + item.total,
    0
  );
  const jumlahTunai = filteredData.filter(
    (t) => t.metode_pembayaran === "Tunai"
  ).length;
  const jumlahNonTunai = filteredData.filter(
    (t) => t.metode_pembayaran === "Non-Tunai"
  ).length;

  // Render konten popup filter periode sesuai tipe
  const renderPopupContent = () => {
    switch (popupType) {
      case "Harian":
        return (
          <input
            type="date"
            value={tanggalHarian}
            onChange={(e) => setTanggalHarian(e.target.value)}
            className="px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm"
          />
        );
      case "Mingguan":
        return (
          <input
            type="date"
            value={mingguAwal}
            onChange={(e) => setMingguAwal(e.target.value)}
            className="px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm"
          />
        );
      case "Bulanan":
        return (
          <div className="space-y-3">
            <div className="relative">
              <div
                onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                className="relative px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm cursor-pointer bg-white"
              >
                <span>
                  {selectedMonth
                    ? [
                        "Januari",
                        "Februari",
                        "Maret",
                        "April",
                        "Mei",
                        "Juni",
                        "Juli",
                        "Agustus",
                        "September",
                        "Oktober",
                        "November",
                        "Desember",
                      ][selectedMonth - 1]
                    : "Pilih Bulan"}
                </span>
                <span className="absolute top-1/2 right-3 transform -translate-y-1/2">
                  <ChevronDownIcon
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                      isMonthDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </span>
              </div>
              <div
                className={`absolute bg-white shadow-lg mt-1 rounded-md w-full max-h-40 overflow-y-auto transition-all duration-200 transform z-10 ${
                  isMonthDropdownOpen
                    ? "scale-y-100 opacity-100"
                    : "scale-y-0 opacity-0 pointer-events-none"
                }`}
                style={{ transformOrigin: "top" }}
              >
                <ul className="py-1 text-sm">
                  {[
                    "Januari",
                    "Februari",
                    "Maret",
                    "April",
                    "Mei",
                    "Juni",
                    "Juli",
                    "Agustus",
                    "September",
                    "Oktober",
                    "November",
                    "Desember",
                  ].map((bulan, index) => (
                    <li
                      key={bulan}
                      onClick={() => {
                        setSelectedMonth(index + 1);
                        setIsMonthDropdownOpen(false);
                      }}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      {bulan}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) setSelectedYear(value);
              }}
              placeholder="Masukkan Tahun (misal: 2025)"
              className="px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        );
      case "Custom":
        return (
          <div className="space-y-3">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm"
            />
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const handleUnduhLaporan = async () => {
    try {
      // 1. Ambil semua data selesai dari backend
      const res = await axios.get(`${API_BASE_URL}/api/pesanan-selesai`);
      const semuaData = res.data;

      const dataTerfilter = semuaData
        .filter(filterByPeriode)
        .filter(
          (item) => metode === "Semua" || item.metode_pembayaran === metode
        );

      // 3. Siapkan file Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Laporan Transaksi");

      worksheet.columns = [
        // { header: "ID", key: "id", width: 10 },
        { header: "Nama Pelanggan", key: "nama_pelanggan", width: 20 },
        { header: "Tipe Pesanan", key: "tipe_pesanan", width: 15 },
        { header: "Nomor Meja", key: "nomor_meja", width: 15 },
        { header: "Total", key: "total", width: 15 },
        { header: "Status", key: "status", width: 15 },
        { header: "Waktu Pesan", key: "waktu_pesan", width: 25 },
        { header: "Metode Pembayaran", key: "metode_pembayaran", width: 20 },
        { header: "ID Kasir", key: "kasir_id", width: 10 },
        { header: "Nama Kasir", key: "nama_kasir", width: 20 },
        { header: "ID Etalase", key: "etalase_id", width: 10 },
        { header: "Nama Etalase", key: "nama_etalase", width: 20 },
      ];

      // Tambah data ke worksheet
      dataTerfilter.forEach((item) => {
        worksheet.addRow({
          id: item.id,
          nama_pelanggan: item.nama_pelanggan,
          tipe_pesanan: item.tipe_pesanan,
          nomor_meja: item.nomor_meja || "-",
          total: item.total,
          status: item.status,
          waktu_pesan: new Date(item.waktu_pesan).toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
          }),
          metode_pembayaran: item.metode_pembayaran,
          kasir_id: item.kasir_id || "-",
          nama_kasir: item.nama_kasir || "-",
          etalase_id: item.etalase_id || "-",
          nama_etalase: item.nama_etalase || "-",
        });
      });

      worksheet.getColumn("waktu_pesan").numFmt = 'dd/mm/yyyy hh:mm:ss "WIB"'; // format tanggal & waktu
      worksheet.getColumn("total").numFmt = '"Rp"#,##0;[Red]-"Rp"#,##0'; // format rupiah dengan tanda minus warna merah

      // Styling header (baris pertama)
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } }; // putih
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "c53030" }, // biru tua
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Styling isi data (baris selain header)
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1) {
          row.eachCell((cell) => {
            cell.alignment = { vertical: "middle", horizontal: "left" };
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });
        }
      });

      // Simpan file Excel
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Laporan_Transaksi_Geprek_HBA.xlsx");
    } catch (error) {
      console.error("Gagal mengunduh laporan:", error);
    }
  };

  const handleRowClick = (id) => {
    navigate(`/admin/pesanan/${id}`);
  };

  return (
    <MainLayoutKepalaToko>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Laporan Transaksi
        </h2>
        <p className="text-gray-600">
          Halaman ini digunakan untuk melihat dan mengunduh laporan transaksi
          penjualan di Rumah Makan Ayam Geprek HBA.
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-4 items-start">
        {/* Dropdown Periode */}
        <div className="relative w-48">
          <p className="text-xs text-gray-600 mb-1">Pilih Periode</p>
          <div
            onClick={togglePeriodeDropdown}
            className="relative px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm cursor-pointer bg-white"
          >
            <span>{periode}</span>
            <span className="absolute top-1/2 right-3 transform -translate-y-1/2">
              <ChevronDownIcon
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  isPeriodeOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </span>
          </div>
          <div
            className={`absolute bg-white shadow-lg mt-1 rounded-md w-full transition-all duration-300 transform z-10 ${
              isPeriodeOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
            }`}
            style={{ transformOrigin: "top" }}
          >
            <ul className="py-1 text-sm">
              {["Harian", "Mingguan", "Bulanan", "Custom"].map((option) => (
                <li
                  key={option}
                  onClick={() => handlePeriodeSelection(option)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dropdown Metode */}
        <div className="relative w-48">
          <p className="text-xs text-gray-600 mb-1">Metode Transaksi</p>
          <div
            onClick={toggleMetodeDropdown}
            className="relative px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm cursor-pointer bg-white"
          >
            <span>{metode}</span>
            <span className="absolute top-1/2 right-3 transform -translate-y-1/2">
              <ChevronDownIcon
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  isMetodeOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </span>
          </div>
          <div
            className={`absolute bg-white shadow-lg mt-1 rounded-md w-full transition-all duration-300 transform z-10 ${
              isMetodeOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
            }`}
            style={{ transformOrigin: "top" }}
          >
            <ul className="py-1 text-sm">
              {["Semua", "Tunai", "Non-Tunai"].map((option) => (
                <li
                  key={option}
                  onClick={() => {
                    setMetode(option);
                    setIsMetodeOpen(false);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Tabel Transaksi */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div
          className="max-h-[300px] overflow-auto"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE 10+
          }}
        >
          <table className="min-w-full text-sm">
            <thead className="text-white font-semibold tracking-wide">
              <tr className="bg-red-700">
                <th className="sticky top-0 bg-red-700 z-9 py-2 px-4 text-left">
                  Tanggal, Waktu Transaksi
                </th>
                <th className="sticky top-0 bg-red-700 z-9 py-2 px-4 text-left">
                  Nama Pelanggan
                </th>
                <th className="sticky top-0 bg-red-700 z-9 py-2 px-4 text-left">
                  Total Pembayaran
                </th>
                <th className="sticky top-0 bg-red-700 z-9 py-2 px-4 text-left">
                  Metode Transaksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-4 text-gray-500 italic text-sm"
                  >
                    Tidak ada data transaksi
                  </td>
                </tr>
              ) : (
                filteredData.map((row, index) => (
                  <tr
                    key={row.id}
                    onClick={() => handleRowClick(row.id)}
                    className={`cursor-pointer ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-100"
                    }`}
                  >
                    <td className="py-2 px-4">
                      {new Date(row.waktu_pesan).toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}{" "}
                      WIB
                    </td>
                    <td className="py-2 px-4">{row.nama_pelanggan}</td>
                    <td className="py-2 px-4">
                      Rp. {row.total.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2 px-4">{row.metode_pembayaran}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ringkasan */}
      <div className="bg-gray-200 p-4 rounded-md text-sm text-gray-800">
        <h3 className="font-bold text-gray-800 mb-2">Ringkasan</h3>
        <p>
          Total Pendapatan :{" "}
          <span className="font-semibold">
            Rp. {totalPendapatan.toLocaleString("id-ID")}
          </span>
        </p>
        <p>
          Total Transaksi :{" "}
          <span className="font-semibold">{totalTransaksi} transaksi</span>
        </p>
        <p>
          Metode Pembayaran :{" "}
          <span className="font-semibold">
            {jumlahTunai} tunai, {jumlahNonTunai} non-tunai
          </span>
        </p>
      </div>

      {/* Tombol Unduh */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleUnduhLaporan}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Unduh Laporan
        </button>
      </div>

      {/* Pop-up Filter */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-white p-6 rounded-md shadow-md w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-700">
              <Calendar className="w-5 h-5" /> Pilih{" "}
              {popupType === "Harian"
                ? "Tanggal"
                : popupType === "Mingguan"
                ? "Tanggal Awal Minggu"
                : popupType === "Bulanan"
                ? "Bulan & Tahun"
                : "Periode"}
            </h2>
            <div className="space-y-3 mb-4">{renderPopupContent()}</div>
            <button
              onClick={applyPeriodeFilter}
              className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800"
            >
              Tampilkan Laporan
            </button>
          </div>
        </div>
      )}
    </MainLayoutKepalaToko>
  );
};

export default LaporanPage;
