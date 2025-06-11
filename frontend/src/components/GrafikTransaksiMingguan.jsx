import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const CustomCalendarButton = forwardRef(({ onClick }, ref) => (
  <button
    onClick={onClick}
    ref={ref}
    className="group flex items-center gap-2 rounded-md px-3 py-1.5 text-sm bg-gray-200 hover:bg-red-700 hover:text-white"
  >
    <Calendar
      className="w-4 h-4 text-red-700 group-hover:text-white"
      strokeWidth={2.5}
    />
    Pilih Tanggal Awal
  </button>
));

const GrafikTransaksiMingguan = ({
  dataMingguan,
  tanggalAwal,
  setTanggalAwal,
  tanggalTerpilih,
  setTanggalTerpilih,
}) => {
  const getBarColor = (entry) => {
    return entry.tanggalISO === tanggalTerpilih ? "#c53030" : "#718096";
  };

  const rentangTanggal = `${dayjs(tanggalAwal)
    .tz("Asia/Jakarta")
    .format("DD MMMM YYYY")} - ${dayjs(tanggalAwal)
    .tz("Asia/Jakarta")
    .add(6, "day")
    .format("DD MMMM YYYY")}`;

  return (
    <div className="bg-white shadow rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-semibold">Grafik Transaksi Mingguan</p>
        <DatePicker
          selected={tanggalAwal}
          onChange={(date) => setTanggalAwal(date)}
          dateFormat="dd-MM-yyyy"
          locale="id"
          customInput={<CustomCalendarButton />}
        />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={dataMingguan}
          onClick={(data) => {
            const clickedData = data?.activePayload?.[0]?.payload;
            if (clickedData) {
              setTanggalTerpilih(clickedData.tanggalISO);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hari" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="transaksi"
            radius={[5, 5, 0, 0]}
            isAnimationActive={false}
          >
            {dataMingguan.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="text-sm text-gray-700 mt-3 text-center">
        <p>Periode tanggal :</p>
        <strong>{rentangTanggal}</strong>
      </div>
    </div>
  );
};

export default GrafikTransaksiMingguan;
