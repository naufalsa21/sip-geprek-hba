export const formatRupiah = (angka) => {
  if (typeof angka !== "number") return "Rp 0";
  return `Rp ${angka.toLocaleString("id-ID")}`;
};
