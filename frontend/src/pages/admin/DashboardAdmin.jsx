import React, { useState, useEffect, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import "dayjs/locale/id";
import { registerLocale } from "react-datepicker";
import { id } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { getSummary, getChartData } from "../../services/dashboardService";
import { formatRupiah } from "../../utils/formatRupiah";
import { formatTanggal, formatRentangTanggal } from "../../utils/formatDate";
import MainLayoutKepalaToko from "../../layouts/MainLayoutKepalaToko";
import SummaryBox from "../../components/SummaryBox";
import GrafikTransaksiMingguan from "../../components/GrafikTransaksiMingguan";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

registerLocale("id", id);
dayjs.locale("id");

const DashboardAdmin = () => {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    pendapatan: 0,
    transaksi: 0,
    menuTerjual: 0,
  });

  const [tanggalAwal, setTanggalAwal] = useState(new Date());
  const [dataMingguan, setDataMingguan] = useState([]);

  // Tambah state tanggal yang dipilih di grafik
  const [tanggalTerpilih, setTanggalTerpilih] = useState(
    dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD")
  );

  // Fetch ringkasan untuk tanggal terpilih
  const fetchSummary = async () => {
    try {
      const startOfDay = dayjs(tanggalTerpilih)
        .tz("Asia/Jakarta")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");

      const endOfDay = dayjs(tanggalTerpilih)
        .tz("Asia/Jakarta")
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");

      const response = await getSummary(startOfDay, endOfDay);

      setSummary({
        pendapatan: Number(response.data.pendapatan) || 0,
        transaksi: response.data.transaksi || 0,
        menuTerjual: response.data.menuTerjual || 0,
      });
    } catch (error) {
      console.error("Gagal mengambil ringkasan:", error);
    }
  };

  // Fetch data grafik mingguan sesuai tanggalAwal
  const fetchChartData = async (startDate) => {
    try {
      const start = dayjs(startDate)
        .tz("Asia/Jakarta")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");

      const end = dayjs(startDate)
        .tz("Asia/Jakarta")
        .add(6, "day")
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");

      const response = await getChartData(start);

      setDataMingguan(response.data || []);
    } catch (error) {
      console.error("Gagal mengambil data grafik:", error);
      setDataMingguan([]);
    }
  };

  // Fetch data grafik saat tanggalAwal berubah
  useEffect(() => {
    fetchChartData(tanggalAwal);
  }, [tanggalAwal]);

  // Fetch ringkasan saat tanggalTerpilih berubah
  useEffect(() => {
    fetchSummary();
  }, [tanggalTerpilih]);

  return (
    <MainLayoutKepalaToko>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h2>
        <p className="text-gray-600">
          Selamat datang di dashboard Kepala Toko Rumah Makan Ayam Geprek HBA!
          Di halaman ini, Anda dapat memantau secara lengkap ringkasan transaksi
          penjualan berdasarkan tanggal yang dipilih Pendapatan grafik dibawah
          untuk membantu pengambilan keputusan yang lebih tepat dan meningkatkan
          kinerja operasional restoran.
        </p>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-700">
          Ringkasan untuk hari :{" "}
          <strong>{dayjs(tanggalTerpilih).format("dddd, DD MMMM YYYY")}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryBox
          title="Total Pendapatan"
          value={formatRupiah(summary.pendapatan)}
          onClick={() =>
            navigate(`/admin/pendapatan?tanggal=${tanggalTerpilih}`)
          }
        />
        <SummaryBox
          title="Total Transaksi"
          value={summary.transaksi}
          unit="Transaksi"
          onClick={() =>
            navigate(`/admin/transaksi?tanggal=${tanggalTerpilih}`)
          }
        />
        <SummaryBox
          title="Total Menu Terjual"
          value={summary.menuTerjual}
          unit="Porsi"
          onClick={() =>
            navigate(`/admin/menu-terlaris?tanggal=${tanggalTerpilih}`)
          }
        />
      </div>

      {/* Bagian Grafik */}
      <GrafikTransaksiMingguan
        dataMingguan={dataMingguan}
        tanggalAwal={tanggalAwal}
        setTanggalAwal={setTanggalAwal}
        tanggalTerpilih={tanggalTerpilih}
        setTanggalTerpilih={setTanggalTerpilih}
      />
    </MainLayoutKepalaToko>
  );
};

export default DashboardAdmin;
