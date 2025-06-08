import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

export const formatTanggal = (tanggal) => {
  return dayjs(tanggal).format("DD MMMM YYYY");
};

export const formatRentangTanggal = (tanggalAwal) => {
  const awal = dayjs(tanggalAwal).format("DD MMMM YYYY");
  const akhir = dayjs(tanggalAwal).add(6, "day").format("DD MMMM YYYY");
  return `${awal} - ${akhir}`;
};
